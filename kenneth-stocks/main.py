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

    try:
        candidates = get_top_candidates(n=5)
        logger.info(f"Top candidates: {[c.ticker for c in candidates]}")

        analyses = analyze_batch(candidates)
        macro = get_macro_snapshot()
        eod_hits = run_eod_scan()

        send_weekly_report(candidates, analyses, macro, eod_hits)
        logger.info("Weekly report sent successfully.")
    except Exception as e:
        logger.error(f"Weekly run failed: {e}", exc_info=True)


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

    logger.info("Scheduler started. Waiting for jobs...")
    while True:
        schedule.run_pending()
        time.sleep(60)


def main():
    parser = argparse.ArgumentParser(description="Kenneth Stocks AI screener")
    parser.add_argument("--weekly", action="store_true", help="Run weekly report now")
    parser.add_argument("--eod", action="store_true", help="Run EOD scan now")
    parser.add_argument("--panic", action="store_true", help="Run panic check now")
    args = parser.parse_args()

    if args.weekly:
        run_weekly()
    elif args.eod:
        run_eod()
    elif args.panic:
        run_panic_check()
    else:
        start_scheduler()


if __name__ == "__main__":
    main()
