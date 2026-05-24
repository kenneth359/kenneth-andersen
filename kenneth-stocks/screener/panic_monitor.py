"""
Panic monitor: checks VIX and Fear & Greed for extreme market conditions.
Runs every 30 minutes during US market hours (14:30–21:00 Oslo time).
Sends immediate email alert when thresholds are crossed.
"""

import logging
import os
from datetime import datetime

import yfinance as yf
import requests

logger = logging.getLogger(__name__)

# Track last alert to avoid spamming
_last_vix_alert_level = 0


def get_current_vix() -> float | None:
    try:
        ticker = yf.Ticker("^VIX")
        hist = ticker.history(period="2d")
        if hist.empty:
            return None
        return float(hist["Close"].iloc[-1])
    except Exception as e:
        logger.warning(f"VIX fetch failed: {e}")
        return None


def get_fear_greed() -> dict | None:
    try:
        url = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        data = resp.json()["fear_and_greed"]
        return {"score": round(data["score"], 1), "rating": data["rating"]}
    except Exception:
        return None


def check_panic_conditions() -> list[dict]:
    """
    Check current market conditions against panic thresholds.
    Returns list of alerts if any thresholds are exceeded.
    """
    import yaml
    with open("config/thresholds.yaml") as f:
        cfg = yaml.safe_load(f)["panic_alerts"]

    alerts = []
    vix = get_current_vix()
    fg = get_fear_greed()

    if vix:
        if vix >= cfg["vix_extreme"]:
            alerts.append({
                "level": "EKSTREM",
                "emoji": "🚨",
                "title": f"VIX = {vix:.0f} – STERKESTE KJØPSSIGNAL",
                "body": (
                    f"VIX over {cfg['vix_extreme']} er et av de sjeldneste og sterkeste kontrariske kjøpssignalene (3–5 ganger per tiår). "
                    "S&P 500 har steget kraftig i alle tilfeller siden 1990. Vurder å sette inn kapital NÅ."
                ),
            })
        elif vix >= cfg["vix_buy_signal"]:
            alerts.append({
                "level": "KJØPSSIGNAL",
                "emoji": "📈",
                "title": f"VIX = {vix:.0f} – Historisk kjøpssignal",
                "body": (
                    f"VIX over {cfg['vix_buy_signal']} har historisk vært fulgt av positiv S&P 500-avkastning i 12 måneder "
                    "i nesten alle tilfeller etter 1990. Vurder å øke eksponering."
                ),
            })
        elif vix >= cfg["vix_caution"]:
            alerts.append({
                "level": "FORSIKTIGHET",
                "emoji": "⚠️",
                "title": f"VIX = {vix:.0f} – Økt markedsuro",
                "body": "Markedet priser inn økt usikkerhet. Hold cash-andelen og vurder å sette limit-ordre på ønskelisten.",
            })

    if fg and fg["score"] <= cfg["fear_greed_extreme"]:
        alerts.append({
            "level": "EKSTREM FRYKT",
            "emoji": "😨",
            "title": f"CNN Fear & Greed = {fg['score']} ({fg['rating']})",
            "body": (
                f"Ekstrem frykt-nivå historisk etterfulgt av +8.6% gjennomsnittlig S&P 500-avkastning neste 3 måneder. "
                "Gode kjøpsmuligheter kan åpne seg."
            ),
        })

    return alerts


def run_panic_check(send_alert_fn) -> None:
    """Run panic check and send alert if thresholds exceeded. Pass reporter.send_alert as send_alert_fn."""
    global _last_vix_alert_level

    # Only check during US market hours (approx)
    now = datetime.utcnow()
    # US market: 13:30–20:00 UTC
    if not (13 <= now.hour < 20):
        return

    alerts = check_panic_conditions()
    for alert in alerts:
        level_num = {"FORSIKTIGHET": 1, "KJØPSSIGNAL": 2, "EKSTREM FRYKT": 2, "EKSTREM": 3}.get(alert["level"], 0)
        if level_num > _last_vix_alert_level:
            send_alert_fn(alert)
            _last_vix_alert_level = level_num
            logger.info(f"Panic alert sent: {alert['level']}")

    # Reset if VIX has calmed down
    vix = get_current_vix()
    if vix and vix < 30:
        _last_vix_alert_level = 0
