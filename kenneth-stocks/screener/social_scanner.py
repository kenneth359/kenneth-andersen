"""
Social momentum scanner: detects early Reddit/StockTwits momentum plays.
Uses ApeWisdom (free, no key) for Reddit mention velocity + yfinance for quality gates.
Targets the high-risk 25% portfolio bucket (~12,500 NOK), holding 1-5 days.
"""

import logging
import os
from dataclasses import dataclass, field
from typing import Optional

import requests
import yfinance as yf
import yaml

logger = logging.getLogger(__name__)

APEWISDOM_URL = "https://apewisdom.io/api/v1.0/filter/all-stocks/page/{page}"
STOCKTWITS_TRENDING_URL = "https://api.stocktwits.com/api/2/trending/symbols.json"

_EXCHANGE_MAP = {
    "NMS": "NASDAQ",
    "NGM": "NASDAQ",
    "NasdaqGS": "NASDAQ",
    "NasdaqGM": "NASDAQ",
    "NasdaqCM": "NASDAQ",
    "NYQ": "NYSE",
    "NYSEArca": "NYSE",
    "NYSE": "NYSE",
}


@dataclass
class SocialCandidate:
    ticker: str
    name: str
    mentions_now: int
    mentions_24h_ago: int
    mention_velocity: float     # mentions_now / mentions_24h_ago
    rank_now: int
    rank_24h_ago: int
    rank_improvement: int       # rank_24h_ago - rank_now (positive = rising)
    price: Optional[float]
    market_cap_usd: Optional[float]
    avg_volume: Optional[float]
    price_5d_change: Optional[float]
    exchange: Optional[str]
    social_score: float         # Combined signal score
    claude_analysis: str = ""
    esma_flag: bool = False     # True = verify availability on Nordnet
    details: dict = field(default_factory=dict)


def _load_config() -> dict:
    with open("config/social_config.yaml") as f:
        return yaml.safe_load(f)


def _fetch_apewisdom(pages: int = 2) -> list[dict]:
    """Fetch trending Reddit stock mentions from ApeWisdom."""
    results = []
    headers = {"User-Agent": "kenneth-stocks-screener/1.0"}
    for page in range(1, pages + 1):
        try:
            resp = requests.get(APEWISDOM_URL.format(page=page), headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            results.extend(data.get("results", []))
        except Exception as e:
            logger.warning(f"ApeWisdom page {page} failed: {e}")
    return results


def _fetch_stocktwits_trending() -> set[str]:
    """Get currently trending tickers on StockTwits."""
    try:
        resp = requests.get(STOCKTWITS_TRENDING_URL, timeout=10)
        resp.raise_for_status()
        symbols = resp.json().get("symbols", [])
        return {s["symbol"] for s in symbols}
    except Exception as e:
        logger.warning(f"StockTwits trending failed: {e}")
        return set()


def _check_quality_gates(ticker: str, cfg: dict) -> Optional[dict]:
    """Fetch yfinance data and check all quality filters. Returns None if stock fails gates."""
    qf = cfg["quality_filters"]
    try:
        t = yf.Ticker(ticker)
        info = t.info
        if not info:
            return None

        exchange = info.get("exchange") or info.get("fullExchangeName", "")
        # Remap exchange code
        exchange_clean = _EXCHANGE_MAP.get(exchange, exchange)
        allowed = cfg["quality_filters"].get("allowed_exchanges", [])
        if exchange not in allowed and exchange_clean not in ["NASDAQ", "NYSE"]:
            logger.debug(f"{ticker}: exchange {exchange!r} not in allowlist")
            return None

        market_cap = info.get("marketCap", 0) or 0
        if market_cap < qf["min_market_cap_usd"]:
            logger.debug(f"{ticker}: market cap {market_cap:,.0f} below minimum")
            return None

        price = info.get("currentPrice") or info.get("regularMarketPrice") or 0
        if price < qf["min_price_usd"]:
            logger.debug(f"{ticker}: price ${price:.2f} below minimum")
            return None

        avg_volume = info.get("averageVolume") or info.get("averageDailyVolume10Day") or 0
        if avg_volume < qf["min_avg_daily_volume"]:
            logger.debug(f"{ticker}: avg volume {avg_volume:,.0f} below minimum")
            return None

        # 5-day price change check (avoid buying into already-run pumps)
        try:
            hist = yf.download(ticker, period="8d", progress=False, auto_adjust=True)
            price_5d_change = None
            if not hist.empty and len(hist) >= 5:
                price_5d_ago = float(hist["Close"].iloc[-6])
                price_now = float(hist["Close"].iloc[-1])
                price_5d_change = (price_now / price_5d_ago) - 1
                if price_5d_change > qf["max_5d_price_increase_pct"]:
                    logger.debug(f"{ticker}: already up {price_5d_change*100:.1f}% this week – skipping")
                    return None
        except Exception:
            price_5d_change = None

        return {
            "price": round(price, 2),
            "market_cap_usd": market_cap,
            "avg_volume": avg_volume,
            "price_5d_change": round(price_5d_change, 4) if price_5d_change is not None else None,
            "exchange": exchange_clean,
            "sector": info.get("sector"),
            "name": info.get("longName") or info.get("shortName") or ticker,
            "esma_flag": market_cap < 500_000_000,  # Flag small-caps for Nordnet check
        }
    except Exception as e:
        logger.debug(f"Quality check error for {ticker}: {e}")
        return None


def _calculate_social_score(mention_velocity: float, rank_improvement: int, mentions_now: int) -> float:
    """
    Composite social score 0–100.
    Weights: mention velocity (40%), rank improvement (40%), absolute mentions (20%).
    """
    # Mention velocity score (0–40): velocity of 3x = full marks
    velocity_score = min(40, (mention_velocity / 3.0) * 40)

    # Rank improvement score (0–40): rising 20 spots = full marks
    rank_score = min(40, (rank_improvement / 20.0) * 40)

    # Absolute mention floor (0–20): capped at 100 mentions
    mention_score = min(20, (mentions_now / 100) * 20)

    return round(velocity_score + rank_score + mention_score, 1)


def _analyze_with_claude(candidate: SocialCandidate) -> str:
    """Quick Claude sanity check: legitimate company or pure speculation?"""
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

        esma_note = "\n⚠️ Market cap under $500M – verifiser at aksjen er tilgjengelig på Nordnet (ESMA-regler)." if candidate.esma_flag else ""

        prompt = f"""Du er en erfaren aksjeanalytiker. Analyser denne sosiale momentum-kandidaten KORT (maks 150 ord).

Ticker: {candidate.ticker} ({candidate.name})
Sektor: {candidate.details.get('sector', 'N/A')}
Kurs: ${candidate.price}
Market cap: ${candidate.market_cap_usd/1e6:.0f}M
5-dagers kursendring: {(candidate.price_5d_change or 0)*100:.1f}%
Reddit-omtaler (nå): {candidate.mentions_now}
Reddit-omtaler (24t siden): {candidate.mentions_24h_ago}
Mention velocity: {candidate.mention_velocity:.1f}x
Rank i dag: #{candidate.rank_now} (var #{candidate.rank_24h_ago} i går)
Social score: {candidate.social_score}/100{esma_note}

Svar med:
1. **Er dette et legitimt selskap?** (Ja/Nei/Usikkert + 1 setning)
2. **Hva driver Reddit-interessen akkurat nå?** (1 setning)
3. **Risiko** (1 setning – hva kan gå galt)
4. **Konklusjon**: Verdt å se på / Unngå"""

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Claude analysis failed for {candidate.ticker}: {e}")
        return "Analyse ikke tilgjengelig."


def run_social_scan(top_n: int = 3) -> list[SocialCandidate]:
    """
    Main entry point: fetch Reddit trending, apply quality gates, return top candidates.
    """
    cfg = _load_config()
    sf = cfg["signal_filters"]

    logger.info("Fetching ApeWisdom trending stocks...")
    ape_data = _fetch_apewisdom(pages=3)
    if not ape_data:
        logger.warning("ApeWisdom returned no data")
        return []

    # Also get StockTwits trending for cross-confirmation
    st_trending = _fetch_stocktwits_trending()
    logger.info(f"ApeWisdom: {len(ape_data)} stocks. StockTwits trending: {len(st_trending)} tickers")

    candidates = []

    for item in ape_data:
        ticker = item.get("ticker", "").upper().strip()
        mentions_now = int(item.get("mentions", 0))
        mentions_24h = int(item.get("mentions_24h_ago", 0)) or 1  # avoid div/0
        rank_now = int(item.get("rank", 99))
        rank_24h = int(item.get("rank_24h_ago", 99))

        if mentions_now < sf["min_apewisdom_mentions"]:
            continue

        velocity = mentions_now / mentions_24h
        rank_improvement = rank_24h - rank_now

        if velocity < sf["min_mention_velocity"]:
            continue
        if rank_improvement < sf["min_rank_improvement"]:
            continue

        logger.info(f"Signal: {ticker} – velocity {velocity:.1f}x, rank +{rank_improvement}")

        quality = _check_quality_gates(ticker, cfg)
        if not quality:
            continue

        social_score = _calculate_social_score(velocity, rank_improvement, mentions_now)
        # Bonus if also trending on StockTwits (cross-platform confirmation)
        if ticker in st_trending:
            social_score = min(100, social_score + 10)

        candidate = SocialCandidate(
            ticker=ticker,
            name=quality["name"],
            mentions_now=mentions_now,
            mentions_24h_ago=mentions_24h,
            mention_velocity=round(velocity, 2),
            rank_now=rank_now,
            rank_24h_ago=rank_24h,
            rank_improvement=rank_improvement,
            price=quality["price"],
            market_cap_usd=quality["market_cap_usd"],
            avg_volume=quality["avg_volume"],
            price_5d_change=quality["price_5d_change"],
            exchange=quality["exchange"],
            social_score=social_score,
            esma_flag=quality.get("esma_flag", False),
            details={"sector": quality.get("sector"), "stocktwits": ticker in st_trending},
        )
        candidates.append(candidate)

    # Sort by social score and take top N
    candidates.sort(key=lambda x: x.social_score, reverse=True)
    top = candidates[:top_n]

    # Claude analysis for finalists only
    for c in top:
        logger.info(f"Analyzing {c.ticker} with Claude...")
        c.claude_analysis = _analyze_with_claude(c)

    logger.info(f"Social scan complete: {len(top)} candidates")
    return top
