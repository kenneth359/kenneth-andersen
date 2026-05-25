"""
QGL Screener: Quality (Greenblatt) + Growth (Lynch) + Momentum
Runs weekly, scores S&P 500/400 + OBX universe, returns top candidates.
"""

import time
import logging
from dataclasses import dataclass, field
from typing import Optional

import pandas as pd
import numpy as np
import yfinance as yf
import yaml

logger = logging.getLogger(__name__)

CONFIG_PATH = "config/thresholds.yaml"
UNIVERSE_PATH = "config/universe.yaml"


@dataclass
class StockScore:
    ticker: str
    name: str
    qgl_score: float
    roic: Optional[float]
    earnings_yield: Optional[float]  # EBIT/EV
    peg: Optional[float]
    eps_growth_3y: Optional[float]
    debt_equity: Optional[float]
    piotroski: Optional[int]
    momentum_6m: Optional[float]
    above_200d_ma: Optional[bool]
    price: Optional[float]
    market_cap_usd: Optional[float]
    # Analyst data
    price_target: Optional[float] = None        # Analyst consensus target
    price_target_high: Optional[float] = None
    price_target_low: Optional[float] = None
    analyst_count: Optional[int] = None
    analyst_consensus: Optional[str] = None     # "buy" / "hold" / "sell"
    upside_pct: Optional[float] = None          # (target - price) / price
    # Risk classification
    risk_color: str = "yellow"                  # "green" / "yellow" / "red"
    details: dict = field(default_factory=dict)


def load_config() -> tuple[dict, dict]:
    with open(CONFIG_PATH) as f:
        thresholds = yaml.safe_load(f)
    with open(UNIVERSE_PATH) as f:
        universe = yaml.safe_load(f)
    return thresholds, universe


_WIKI_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; kenneth-stocks-screener/1.0)"}


def get_sp500_tickers() -> list[str]:
    try:
        tables = pd.read_html(
            "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies",
            storage_options={"headers": _WIKI_HEADERS},
        )
        return tables[0]["Symbol"].str.replace(".", "-", regex=False).tolist()
    except Exception:
        # Fallback: a representative 50-stock subset of S&P 500 top holdings
        return [
            "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "BRK-B", "LLY", "JPM",
            "UNH", "XOM", "V", "COST", "MA", "PG", "HD", "AVGO", "JNJ", "MRK",
            "ABBV", "KO", "CVX", "WMT", "CRM", "NFLX", "BAC", "AMD", "PEP", "TMO",
            "ADBE", "ACN", "CSCO", "DIS", "VZ", "T", "ABT", "MCD", "BMY", "DHR",
            "TXN", "INTC", "NEE", "RTX", "LIN", "HON", "AMGN", "UNP", "PM", "LOW",
        ]


def get_sp400_tickers() -> list[str]:
    try:
        tables = pd.read_html(
            "https://en.wikipedia.org/wiki/List_of_S%26P_400_companies",
            storage_options={"headers": _WIKI_HEADERS},
        )
        return tables[0]["Ticker symbol"].str.replace(".", "-", regex=False).tolist()
    except Exception:
        return []


def calculate_piotroski(info: dict, ticker_obj: yf.Ticker) -> Optional[int]:
    """Calculate a simplified Piotroski F-Score from available yfinance data."""
    score = 0
    try:
        # Profitability signals (4 points)
        roe = info.get("returnOnEquity")
        roa = info.get("returnOnAssets")
        ocf = info.get("operatingCashflow")
        net_income = info.get("netIncomeToCommon")

        if roa and roa > 0:
            score += 1
        if ocf and ocf > 0:
            score += 1
        if net_income and net_income > 0:
            score += 1
        # Cash flow > net income (accruals quality)
        if ocf and net_income and ocf > net_income:
            score += 1

        # Leverage/liquidity signals (3 points)
        de = info.get("debtToEquity")
        current_ratio = info.get("currentRatio")
        shares = info.get("sharesOutstanding")
        float_shares = info.get("floatShares")

        if de is not None and de < 100:  # D/E < 1.0 (yfinance multiplies by 100)
            score += 1
        if current_ratio and current_ratio > 1.5:
            score += 1
        # No dilution (no new shares issued)
        if shares and float_shares and shares <= float_shares * 1.02:
            score += 1

        # Efficiency signals (2 points)
        gross_margins = info.get("grossMargins")
        asset_turnover = info.get("assetTurnover")

        if gross_margins and gross_margins > 0.3:
            score += 1
        if asset_turnover and asset_turnover > 0.5:
            score += 1

    except Exception:
        return None

    return score


def calculate_momentum_6m(ticker: str) -> Optional[float]:
    """Calculate 6-month price return, skipping the most recent month (standard momentum)."""
    try:
        hist = yf.download(ticker, period="7mo", progress=False, auto_adjust=True)
        if hist.empty or len(hist) < 100:
            return None
        # Standard cross-sectional momentum: 6M return excluding last month
        price_6m_ago = hist["Close"].iloc[0]
        price_1m_ago = hist["Close"].iloc[-22]
        if price_6m_ago <= 0:
            return None
        return float((price_1m_ago / price_6m_ago) - 1)
    except Exception:
        return None


def is_above_200d_ma(ticker: str) -> Optional[bool]:
    try:
        hist = yf.download(ticker, period="1y", progress=False, auto_adjust=True)
        if hist.empty or len(hist) < 200:
            return None
        ma200 = hist["Close"].rolling(200).mean().iloc[-1]
        current = hist["Close"].iloc[-1]
        return bool(current > ma200)
    except Exception:
        return None


def fetch_stock_data(ticker: str) -> Optional[dict]:
    """Fetch all relevant data for a single stock from yfinance."""
    try:
        t = yf.Ticker(ticker)
        info = t.info
        if not info or info.get("quoteType") not in ("EQUITY", "ETF"):
            return None
        return {"ticker": ticker, "info": info, "ticker_obj": t}
    except Exception as e:
        logger.debug(f"Error fetching {ticker}: {e}")
        return None


def score_stock(data: dict, thresholds: dict) -> Optional[StockScore]:
    """Apply QGL scoring to a fetched stock."""
    info = data["info"]
    ticker = data["ticker"]
    cfg = thresholds["qgl"]

    # Gate on market cap
    market_cap = info.get("marketCap", 0)
    if market_cap < thresholds["universe"]["min_market_cap_usd"]:
        return None

    # --- Greenblatt quality: ROIC proxy (returnOnEquity + returnOnAssets) ---
    roe = info.get("returnOnEquity")
    roa = info.get("returnOnAssets")
    roic = roe if roe else roa  # best available proxy

    # --- Greenblatt value: Earnings yield (EBIT/EV) ---
    ebitda = info.get("ebitda")
    ev = info.get("enterpriseValue")
    ev_ebitda = info.get("enterpriseToEbitda")
    earnings_yield = None
    if ev and ebitda and ebitda > 0 and ev > 0:
        earnings_yield = ebitda / ev  # approximate EBIT/EV

    # --- Lynch: PEG ratio ---
    peg = info.get("pegRatio")

    # --- Lynch: EPS growth ---
    eps_growth = info.get("earningsGrowth") or info.get("revenueGrowth")

    # --- Lynch: Debt/equity ---
    de_raw = info.get("debtToEquity")
    debt_equity = de_raw / 100 if de_raw else None  # yfinance returns as percentage

    # --- Piotroski F-Score ---
    piotroski = calculate_piotroski(info, data["ticker_obj"])

    # --- Momentum (6M) ---
    momentum_6m = calculate_momentum_6m(ticker)

    # --- 200-day MA filter ---
    above_200d = is_above_200d_ma(ticker) if cfg.get("use_200d_ma_filter") else None

    # --- Calculate composite QGL score (0–100) ---
    score_components = []

    # Quality component (0–25): ROIC
    if roic is not None:
        roic_score = min(25, max(0, (roic / cfg["min_roic"]) * 12.5))
        score_components.append(roic_score)
    else:
        score_components.append(0)

    # Value component (0–25): Earnings yield
    if earnings_yield is not None:
        ey_score = min(25, max(0, (earnings_yield / cfg["min_earnings_yield"]) * 12.5))
        score_components.append(ey_score)
    else:
        score_components.append(0)

    # Growth component (0–25): PEG + EPS growth
    growth_score = 0
    if peg is not None and peg > 0:
        growth_score += min(12.5, max(0, (cfg["max_peg"] / peg) * 6.25))
    if eps_growth is not None:
        growth_score += min(12.5, max(0, (eps_growth / cfg["min_eps_growth_3y"]) * 6.25))
    score_components.append(growth_score)

    # Momentum component (0–25): 6M momentum percentile
    if momentum_6m is not None:
        mom_score = min(25, max(0, (momentum_6m + 0.5) * 25))  # normalize roughly
        score_components.append(mom_score)
    else:
        score_components.append(12.5)  # neutral if unavailable

    qgl_score = sum(score_components)

    # Hard gates: exclude if critical thresholds not met
    if piotroski is not None and piotroski < cfg["min_piotroski"]:
        qgl_score *= 0.5  # penalize, don't eliminate (data may be incomplete)
    if debt_equity is not None and debt_equity > cfg["max_debt_equity"]:
        qgl_score *= 0.7
    if cfg.get("use_200d_ma_filter") and above_200d is False:
        qgl_score *= 0.6  # penalize but keep in list for awareness

    price = info.get("currentPrice") or info.get("regularMarketPrice")
    name = info.get("longName") or info.get("shortName") or ticker

    # --- Analyst consensus & price target ---
    price_target = info.get("targetMeanPrice")
    price_target_high = info.get("targetHighPrice")
    price_target_low = info.get("targetLowPrice")
    analyst_count = info.get("numberOfAnalystOpinions")
    rec_key = info.get("recommendationKey", "")
    analyst_consensus = rec_key.lower() if rec_key else None
    upside_pct = None
    if price and price_target and price > 0:
        upside_pct = round((price_target / price - 1) * 100, 1)

    # --- Risk color: green / yellow / red ---
    risk_color = _classify_risk(qgl_score, piotroski, debt_equity, above_200d, momentum_6m, upside_pct)

    return StockScore(
        ticker=ticker,
        name=name,
        qgl_score=round(qgl_score, 2),
        roic=round(roic, 4) if roic else None,
        earnings_yield=round(earnings_yield, 4) if earnings_yield else None,
        peg=round(peg, 2) if peg else None,
        eps_growth_3y=round(eps_growth, 4) if eps_growth else None,
        debt_equity=round(debt_equity, 2) if debt_equity else None,
        piotroski=piotroski,
        momentum_6m=round(momentum_6m, 4) if momentum_6m else None,
        above_200d_ma=above_200d,
        price=round(price, 2) if price else None,
        market_cap_usd=market_cap,
        price_target=round(price_target, 2) if price_target else None,
        price_target_high=round(price_target_high, 2) if price_target_high else None,
        price_target_low=round(price_target_low, 2) if price_target_low else None,
        analyst_count=analyst_count,
        analyst_consensus=analyst_consensus,
        upside_pct=upside_pct,
        risk_color=risk_color,
        details={
            "ev_ebitda": round(ev_ebitda, 2) if ev_ebitda else None,
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "country": info.get("country"),
            "beta": info.get("beta"),
            "forward_pe": info.get("forwardPE"),
            "free_cashflow": info.get("freeCashflow"),
            "short_ratio": info.get("shortRatio"),
            "earnings_date": str(info.get("earningsTimestamp", "")),
        },
    )


def _classify_risk(
    qgl_score: float,
    piotroski: Optional[int],
    debt_equity: Optional[float],
    above_200d: Optional[bool],
    momentum_6m: Optional[float],
    upside_pct: Optional[float],
) -> str:
    """Return 'green', 'yellow', or 'red' risk classification."""
    red_flags = 0
    green_flags = 0

    if qgl_score >= 65:
        green_flags += 2
    elif qgl_score < 40:
        red_flags += 2

    if piotroski is not None:
        if piotroski >= 7:
            green_flags += 1
        elif piotroski < 5:
            red_flags += 2

    if debt_equity is not None:
        if debt_equity > 0.8:
            red_flags += 1
        elif debt_equity < 0.3:
            green_flags += 1

    if above_200d is True:
        green_flags += 1
    elif above_200d is False:
        red_flags += 1

    if momentum_6m is not None:
        if momentum_6m > 0.1:
            green_flags += 1
        elif momentum_6m < -0.1:
            red_flags += 1

    if upside_pct is not None:
        if upside_pct > 20:
            green_flags += 1
        elif upside_pct < 0:
            red_flags += 1

    if red_flags >= 3:
        return "red"
    if green_flags >= 4:
        return "green"
    return "yellow"


def screen_universe(max_tickers: int = 600, batch_size: int = 20, delay: float = 1.0) -> list[StockScore]:
    """
    Screen the full universe. Fetches in batches to respect yfinance rate limits.
    Returns scored stocks sorted by QGL score descending.
    """
    thresholds, universe_cfg = load_config()

    sp500 = get_sp500_tickers()
    sp400 = get_sp400_tickers()
    obx = universe_cfg.get("obx_tickers", [])

    all_tickers = list(dict.fromkeys(sp500 + sp400 + obx))[:max_tickers]
    logger.info(f"Screening {len(all_tickers)} tickers...")

    results: list[StockScore] = []

    for i in range(0, len(all_tickers), batch_size):
        batch = all_tickers[i : i + batch_size]
        logger.info(f"Batch {i // batch_size + 1}: {batch[:3]}...")

        for ticker in batch:
            data = fetch_stock_data(ticker)
            if data:
                score = score_stock(data, thresholds)
                if score:
                    results.append(score)
            time.sleep(0.1)  # small delay per ticker

        time.sleep(delay)  # batch delay

    results.sort(key=lambda x: x.qgl_score, reverse=True)
    logger.info(f"Screening complete. {len(results)} stocks scored.")
    return results


def get_top_candidates(n: int = 5) -> list[StockScore]:
    """Run the screener and return the top n candidates."""
    all_scores = screen_universe()
    return all_scores[:n]
