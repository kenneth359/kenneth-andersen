"""
Main entry point for the Kenneth Stocks AI screener.

Schedules:
  - Weekly (Monday 07:00 Oslo): Full QGL screen + AI analysis + email report
  - Daily (22:15 Oslo):         EOD watchlist scan + alert if signals found
  - Every 30 min (US hours):    Panic monitor (VIX/Fear & Greed)

Usage:
  python main.py            # Start scheduled runner
  python main.py --weekly   # Run weekly report immediately
  python main.py --eod      # Run EOD scan immediately
  python main.py --panic    # Run panic check immediately
  python main.py --pension  # Show pension snapshot now
"""

import argparse
import logging
import os
import sys
import time

import schedule
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s – %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

# Add project root to path so imports work from anywhere
sys.path.insert(0, os.path.dirname(__file__))


def run_weekly():
    logger.info("=== Starting weekly QGL screen ===")
    from screener.qgl_screener import get_top_candidates
    from screener.macro_dashboard import get_macro_snapshot
    from screener.analyzer import analyze_batch
    from screener.reporter import send_weekly_report
    from screener.eod_scanner import run_eod_scan
    from screener.social_scanner import run_social_scan
    from screener.pension_tracker import get_pension_snapshot

    try:
        candidates = get_top_candidates(n=5)
        logger.info(f"Top QGL candidates: {[c.ticker for c in candidates]}")

        analyses = analyze_batch(candidates)
        macro = get_macro_snapshot()
        eod_hits = run_eod_scan()
        social_candidates = run_social_scan(top_n=3)
        logger.info(f"Top social candidates: {[c.ticker for c in social_candidates]}")

        pension = get_pension_snapshot()
        if pension:
            logger.info(f"Pension: Kron EPK {pension['current']['kron_epk_nok']:,.0f} kr")

        send_weekly_report(candidates, analyses, macro, eod_hits, social_candidates, pension)
        logger.info("Weekly report sent successfully.")
    except Exception as e:
        logger.error(f"Weekly run failed: {e}", exc_info=True)


def run_pension_check():
    logger.info("=== Pension snapshot ===")
    from screener.pension_tracker import get_pension_snapshot
    try:
        data = get_pension_snapshot()
        if not data:
            logger.warning("No pension data – check config/pension_config.yaml")
            return
        cur = data["current"]
        proj = data["projection"]
        logger.info(f"Kron EPK:       {cur['kron_epk_nok']:>12,.0f} kr")
        logger.info(f"Storebrand OTP: {cur['storebrand_otp_nok']:>12,.0f} kr")
        logger.info(f"Projected at {proj['retirement_age']}: {proj['total_at_retirement_nok']:>12,.0f} kr")
        logger.info(f"Est. monthly pension: {proj['monthly_pension_estimate_nok']:,.0f} kr/mnd")
        for s in data.get("signals", []):
            logger.warning(f"[{s['level']}] {s['msg']}")
    except Exception as e:
        logger.error(f"Pension check failed: {e}", exc_info=True)


def run_social_scan():
    logger.info("=== Starting social momentum scan ===")
    from screener.social_scanner import run_social_scan as _scan
    from screener.reporter import send_social_alert

    try:
        candidates = _scan(top_n=3)
        if candidates:
            send_social_alert(candidates)
            logger.info(f"Social alert sent for: {[c.ticker for c in candidates]}")
        else:
            logger.info("Social scan: no qualifying candidates this run")
    except Exception as e:
        logger.error(f"Social scan failed: {e}", exc_info=True)


def run_eod():
    logger.info("=== Starting EOD scan ===")
    from screener.eod_scanner import run_eod_scan
    from screener.reporter import send_eod_alert

    try:
        hits = run_eod_scan()
        if hits:
            send_eod_alert(hits)
            logger.info(f"EOD alert sent: {len(hits)} signals")
        else:
            logger.info("EOD scan: no signals found")
    except Exception as e:
        logger.error(f"EOD scan failed: {e}", exc_info=True)


def run_panic_check():
    logger.info("Panic check...")
    from screener.panic_monitor import run_panic_check as _check
    from screener.reporter import send_alert
    try:
        _check(send_alert)
    except Exception as e:
        logger.error(f"Panic check failed: {e}", exc_info=True)


def start_scheduler():
    # Weekly: Monday at 07:00
    schedule.every().monday.at("07:00").do(run_weekly)
    # Daily EOD: 22:15 (after US close)
    schedule.every().day.at("22:15").do(run_eod)
    # Panic check: every 30 minutes
    schedule.every(30).minutes.do(run_panic_check)
    # Social momentum: every 6 hours
    schedule.every(6).hours.do(run_social_scan)

    logger.info("Scheduler started. Waiting for jobs...")
    while True:
        schedule.run_pending()
        time.sleep(60)


def main():
    parser = argparse.ArgumentParser(description="Kenneth Stocks AI screener")
    parser.add_argument("--weekly", action="store_true", help="Run weekly report now")
    parser.add_argument("--eod", action="store_true", help="Run EOD scan now")
    parser.add_argument("--panic", action="store_true", help="Run panic check now")
    parser.add_argument("--social", action="store_true", help="Run social momentum scan now")
    parser.add_argument("--pension", action="store_true", help="Show pension snapshot now")
    args = parser.parse_args()

    if args.weekly:
        run_weekly()
    elif args.eod:
        run_eod()
    elif args.panic:
        run_panic_check()
    elif args.social:
        run_social_scan()
    elif args.pension:
        run_pension_check()
    else:
        start_scheduler()


if __name__ == "__main__":
    main()
