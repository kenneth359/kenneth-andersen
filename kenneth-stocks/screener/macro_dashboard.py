"""
Macro dashboard: fetches commodity prices, credit spreads, VIX, and leading indicators.
Used in the weekly email report as context for sector allocation.
"""

import os
import logging
from datetime import datetime, timedelta
from typing import Optional

import yfinance as yf
import pandas as pd
import requests

logger = logging.getLogger(__name__)

FRED_API_KEY = os.getenv("FRED_API_KEY", "")

COMMODITY_TICKERS = {
    "Brent Crude": "BZ=F",
    "Natural Gas": "NG=F",
    "Copper": "HG=F",
    "Aluminium": "ALI=F",
    "Gold": "GC=F",
    "Iron Ore (proxy)": "TIO=F",
}

MACRO_TICKERS = {
    "VIX": "^VIX",
    "USD/NOK": "USDNOK=X",
    "S&P 500": "^GSPC",
    "OSEBX": "OSEBX.OL",
}

FRED_SERIES = {
    "HY Credit Spread": "BAMLH0A0HYM2",
    "10Y-2Y Yield Curve": "T10Y2Y",
    "US PMI (ISM proxy)": "MANEMP",
}


def _fetch_price_change(ticker: str) -> dict:
    """Fetch current price and 1-week, 1-month, 3-month change."""
    try:
        hist = yf.download(ticker, period="4mo", progress=False, auto_adjust=True)
        if hist.empty:
            return {}
        current = float(hist["Close"].iloc[-1])
        week_ago = float(hist["Close"].iloc[-6]) if len(hist) >= 6 else None
        month_ago = float(hist["Close"].iloc[-22]) if len(hist) >= 22 else None
        three_months_ago = float(hist["Close"].iloc[-65]) if len(hist) >= 65 else None

        result = {"price": round(current, 2)}
        if week_ago:
            result["1w_pct"] = round((current / week_ago - 1) * 100, 2)
        if month_ago:
            result["1m_pct"] = round((current / month_ago - 1) * 100, 2)
        if three_months_ago:
            result["3m_pct"] = round((current / three_months_ago - 1) * 100, 2)
        return result
    except Exception as e:
        logger.warning(f"Could not fetch {ticker}: {e}")
        return {}


def _fetch_fred_series(series_id: str, days: int = 90) -> Optional[dict]:
    """Fetch latest value and trend from FRED."""
    if not FRED_API_KEY:
        return None
    try:
        end = datetime.today().strftime("%Y-%m-%d")
        start = (datetime.today() - timedelta(days=days)).strftime("%Y-%m-%d")
        url = (
            f"https://api.stlouisfed.org/fred/series/observations"
            f"?series_id={series_id}&observation_start={start}&observation_end={end}"
            f"&api_key={FRED_API_KEY}&file_type=json"
        )
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        obs = [o for o in resp.json()["observations"] if o["value"] != "."]
        if not obs:
            return None
        current = float(obs[-1]["value"])
        prev = float(obs[0]["value"]) if len(obs) > 1 else None
        return {
            "value": round(current, 3),
            "change_90d": round(current - prev, 3) if prev else None,
            "date": obs[-1]["date"],
        }
    except Exception as e:
        logger.warning(f"FRED series {series_id} failed: {e}")
        return None


def _fetch_aaii_sentiment() -> Optional[dict]:
    """Approximate AAII sentiment from the CNN Fear & Greed API (public endpoint)."""
    try:
        url = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        data = resp.json()
        score = data["fear_and_greed"]["score"]
        rating = data["fear_and_greed"]["rating"]
        return {"score": round(score, 1), "rating": rating}
    except Exception as e:
        logger.warning(f"Fear & Greed index fetch failed: {e}")
        return None


def get_macro_snapshot() -> dict:
    """Build a complete macro snapshot for the weekly report."""
    snapshot = {
        "generated_at": datetime.now().isoformat(),
        "commodities": {},
        "macro_indices": {},
        "fred": {},
        "sentiment": None,
        "signals": [],
    }

    for name, ticker in COMMODITY_TICKERS.items():
        data = _fetch_price_change(ticker)
        if data:
            snapshot["commodities"][name] = data

    for name, ticker in MACRO_TICKERS.items():
        data = _fetch_price_change(ticker)
        if data:
            snapshot["macro_indices"][name] = data

    for name, series_id in FRED_SERIES.items():
        data = _fetch_fred_series(series_id)
        if data:
            snapshot["fred"][name] = data

    snapshot["sentiment"] = _fetch_aaii_sentiment()

    # Generate signal flags
    snapshot["signals"] = _evaluate_macro_signals(snapshot)

    return snapshot


def _evaluate_macro_signals(snap: dict) -> list[dict]:
    """Evaluate macro thresholds and return actionable signals."""
    signals = []

    vix = snap["macro_indices"].get("VIX", {}).get("price")
    if vix:
        if vix > 50:
            signals.append({"level": "EXTREME", "msg": f"VIX={vix:.0f} – historisk sterkeste kjøpssignal (3–5x per tiår)"})
        elif vix > 40:
            signals.append({"level": "BUY", "msg": f"VIX={vix:.0f} – dokumentert kjøpssignal. S&P 500 har steget i 12 mnd i nesten alle tilfeller"})
        elif vix > 35:
            signals.append({"level": "CAUTION", "msg": f"VIX={vix:.0f} – økt markedsuro, vurder å øke cash"})

    hy_spread = snap["fred"].get("HY Credit Spread", {})
    if hy_spread and hy_spread.get("change_90d") and hy_spread["change_90d"] > 3.0:
        signals.append({"level": "CAUTION", "msg": f"High-yield kredittspread stiger +{hy_spread['change_90d']:.1f}pp siste 90 dager – varsler stress"})

    yield_curve = snap["fred"].get("10Y-2Y Yield Curve", {})
    if yield_curve and yield_curve.get("change_90d"):
        if yield_curve["value"] < 0 and yield_curve["change_90d"] > 0.3:
            signals.append({"level": "WATCH", "msg": f"Rentekurve re-steilner etter inversjon – historisk forvarsel om nedgang"})

    fg = snap.get("sentiment")
    if fg and fg["score"] < 25:
        signals.append({"level": "BUY", "msg": f"CNN Fear & Greed={fg['score']:.0f} ({fg['rating']}) – +8.6% gjennomsnittlig 3-mnd S&P-avkastning etter dette"})

    brent = snap["commodities"].get("Brent Crude", {})
    if brent.get("1m_pct"):
        if abs(brent["1m_pct"]) > 10:
            direction = "ned" if brent["1m_pct"] < 0 else "opp"
            signals.append({"level": "WATCH", "msg": f"Brent crude {direction} {abs(brent['1m_pct']):.1f}% siste mnd – påvirker Sea1 Offshore / Odfjell"})

    return signals
