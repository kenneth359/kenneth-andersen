"""
End-of-day scanner: checks watchlist + existing holdings for entry signals.
Runs daily at 22:15 Oslo time (after US market close).
"""

import logging
from typing import Optional

import pandas as pd
import numpy as np
import yfinance as yf
import yaml

logger = logging.getLogger(__name__)


def _load_watchlist() -> list[str]:
    tickers = []
    try:
        with open("config/universe.yaml") as f:
            cfg = yaml.safe_load(f)
        # Holdings
        for pos in cfg.get("kenneth_holdings", {}).get("ask", []):
            if not pos.get("unlisted"):
                tickers.append(pos["ticker"])
        for pos in cfg.get("kenneth_holdings", {}).get("regular", []):
            if not pos.get("unlisted"):
                tickers.append(pos["ticker"])
        # Extra watchlist
        with open("config/watchlist.yaml") as f:
            wl = yaml.safe_load(f)
        tickers.extend(wl.get("extra_watchlist", []))
    except Exception as e:
        logger.warning(f"Could not load watchlist: {e}")
    return list(dict.fromkeys(tickers))


def _calculate_rsi(prices: pd.Series, period: int = 14) -> Optional[float]:
    delta = prices.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = (-delta.clip(upper=0)).rolling(period).mean()
    rs = gain / loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return float(rsi.iloc[-1]) if not rsi.empty else None


def scan_ticker(ticker: str, thresholds: dict) -> Optional[dict]:
    """Scan a single ticker for EOD entry signals."""
    try:
        hist = yf.download(ticker, period="1y", progress=False, auto_adjust=True)
        if hist.empty or len(hist) < 50:
            return None

        close = hist["Close"].squeeze()
        volume = hist["Volume"].squeeze()
        current_price = float(close.iloc[-1])
        avg_volume_20d = float(volume.rolling(20).mean().iloc[-1])
        today_volume = float(volume.iloc[-1])
        ma50 = float(close.rolling(50).mean().iloc[-1])
        ma200 = float(close.rolling(200).mean().iloc[-1]) if len(hist) >= 200 else None
        rsi = _calculate_rsi(close)

        cfg = thresholds["eod_scan"]
        signals = []

        # Signal 1: Oversold with volume spike
        if rsi and rsi < cfg["rsi_oversold"] and today_volume > avg_volume_20d * cfg["volume_spike_multiplier"]:
            signals.append(f"RSI={rsi:.0f} oversold + volum {today_volume/avg_volume_20d:.1f}x snitt")

        # Signal 2: Price significantly below 50-day MA (potential mean reversion)
        pct_below_50ma = (ma50 - current_price) / ma50
        if pct_below_50ma > cfg["price_below_50d_ma_pct"]:
            signals.append(f"Kurs {pct_below_50ma*100:.1f}% under 50-dagers MA")

        if not signals:
            return None

        info = yf.Ticker(ticker).info
        return {
            "ticker": ticker,
            "name": info.get("longName") or info.get("shortName") or ticker,
            "price": round(current_price, 2),
            "rsi": round(rsi, 1) if rsi else None,
            "pct_below_50ma": round(pct_below_50ma * 100, 1),
            "above_200ma": current_price > ma200 if ma200 else None,
            "signals": signals,
        }

    except Exception as e:
        logger.debug(f"EOD scan error for {ticker}: {e}")
        return None


def run_eod_scan() -> list[dict]:
    """Run EOD scan on full watchlist. Returns tickers with signals."""
    import yaml
    with open("config/thresholds.yaml") as f:
        thresholds = yaml.safe_load(f)

    tickers = _load_watchlist()
    logger.info(f"EOD scan: {len(tickers)} tickers")

    results = []
    for ticker in tickers:
        hit = scan_ticker(ticker, thresholds)
        if hit:
            results.append(hit)
            logger.info(f"Signal found: {ticker} – {hit['signals']}")

    return results
