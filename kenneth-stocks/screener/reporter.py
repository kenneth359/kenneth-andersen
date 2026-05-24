"""
Reporter: formats and sends email reports via Resend.
Weekly report + real-time alerts.
"""

import os
import logging
from datetime import datetime
from typing import Optional

import resend

logger = logging.getLogger(__name__)

TO_EMAIL = os.getenv("REPORT_EMAIL", "kenneth@fundel.no")
FROM_EMAIL = "kenneth-stocks@kennethandersen.no"


def _setup_resend():
    resend.api_key = os.environ["RESEND_API_KEY"]


def _macro_table_html(macro: dict) -> str:
    rows = []
    for name, data in macro.get("commodities", {}).items():
        pct = data.get("1m_pct", "–")
        arrow = "▲" if isinstance(pct, float) and pct > 0 else "▼" if isinstance(pct, float) and pct < 0 else ""
        color = "#16a34a" if isinstance(pct, float) and pct > 0 else "#dc2626" if isinstance(pct, float) and pct < 0 else "#666"
        rows.append(
            f'<tr><td style="padding:4px 8px">{name}</td>'
            f'<td style="padding:4px 8px;font-weight:bold">{data.get("price","–")}</td>'
            f'<td style="padding:4px 8px;color:{color}">{arrow} {pct if isinstance(pct,float) else "–"}%</td></tr>'
        )
    for name, data in macro.get("macro_indices", {}).items():
        pct = data.get("1m_pct", "–")
        arrow = "▲" if isinstance(pct, float) and pct > 0 else "▼" if isinstance(pct, float) and pct < 0 else ""
        color = "#16a34a" if isinstance(pct, float) and pct > 0 else "#dc2626" if isinstance(pct, float) and pct < 0 else "#666"
        rows.append(
            f'<tr><td style="padding:4px 8px">{name}</td>'
            f'<td style="padding:4px 8px;font-weight:bold">{data.get("price","–")}</td>'
            f'<td style="padding:4px 8px;color:{color}">{arrow} {pct if isinstance(pct,float) else "–"}%</td></tr>'
        )
    return (
        '<table style="border-collapse:collapse;width:100%;font-size:14px">'
        '<thead><tr style="background:#f3f4f6">'
        '<th style="padding:6px 8px;text-align:left">Instrument</th>'
        '<th style="padding:6px 8px;text-align:left">Pris</th>'
        '<th style="padding:6px 8px;text-align:left">1-mnd</th>'
        "</tr></thead><tbody>"
        + "".join(rows)
        + "</tbody></table>"
    )


def _candidate_card_html(stock, analysis: str) -> str:
    momentum_str = f"{stock.momentum_6m*100:+.1f}%" if stock.momentum_6m else "N/A"
    roic_str = f"{stock.roic*100:.1f}%" if stock.roic else "N/A"
    peg_str = f"{stock.peg:.2f}" if stock.peg else "N/A"
    piotroski_str = f"{stock.piotroski}/9" if stock.piotroski is not None else "N/A"
    above_ma_str = "✅ Ja" if stock.above_200d_ma else "❌ Nei" if stock.above_200d_ma is False else "N/A"

    analysis_html = analysis.replace("\n", "<br>").replace("**", "<strong>").replace("**", "</strong>")

    return f"""
<div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px;background:#fff">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
    <h2 style="margin:0;font-size:20px">{stock.ticker} – {stock.name}</h2>
    <span style="background:#1d4ed8;color:#fff;padding:4px 10px;border-radius:20px;font-size:13px;font-weight:bold">
      QGL {stock.qgl_score}/100
    </span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px">
    <div style="background:#f9fafb;padding:8px;border-radius:6px;text-align:center">
      <div style="font-size:11px;color:#6b7280">ROIC</div>
      <div style="font-weight:bold">{roic_str}</div>
    </div>
    <div style="background:#f9fafb;padding:8px;border-radius:6px;text-align:center">
      <div style="font-size:11px;color:#6b7280">PEG</div>
      <div style="font-weight:bold">{peg_str}</div>
    </div>
    <div style="background:#f9fafb;padding:8px;border-radius:6px;text-align:center">
      <div style="font-size:11px;color:#6b7280">6M momentum</div>
      <div style="font-weight:bold">{momentum_str}</div>
    </div>
    <div style="background:#f9fafb;padding:8px;border-radius:6px;text-align:center">
      <div style="font-size:11px;color:#6b7280">Piotroski</div>
      <div style="font-weight:bold">{piotroski_str}</div>
    </div>
    <div style="background:#f9fafb;padding:8px;border-radius:6px;text-align:center">
      <div style="font-size:11px;color:#6b7280">Over 200d MA</div>
      <div style="font-weight:bold">{above_ma_str}</div>
    </div>
  </div>
  <div style="font-size:14px;line-height:1.6;color:#374151">{analysis_html}</div>
</div>
"""


def _signals_html(signals: list[dict]) -> str:
    if not signals:
        return ""
    level_colors = {"EXTREME": "#7f1d1d", "BUY": "#14532d", "CAUTION": "#78350f", "WATCH": "#1e3a5f"}
    items = []
    for s in signals:
        color = level_colors.get(s["level"], "#374151")
        items.append(
            f'<div style="border-left:4px solid {color};padding:8px 12px;margin-bottom:8px;background:#f9fafb">'
            f'<strong style="color:{color}">{s["level"]}</strong> – {s["msg"]}</div>'
        )
    return "<h3>Makrosignaler</h3>" + "".join(items)


def build_weekly_report_html(candidates: list, analyses: dict[str, str], macro: dict, eod_hits: list) -> str:
    date_str = datetime.now().strftime("%d.%m.%Y")
    candidates_html = "".join(
        _candidate_card_html(c, analyses.get(c.ticker, "Analyse mangler")) for c in candidates
    )
    macro_html = _macro_table_html(macro)
    signals_html = _signals_html(macro.get("signals", []))

    eod_html = ""
    if eod_hits:
        eod_items = "".join(
            f'<li><strong>{h["ticker"]}</strong> – {h["name"]}: {", ".join(h["signals"])}</li>'
            for h in eod_hits
        )
        eod_html = f"<h3>Inngangssignaler (watchlist)</h3><ul>{eod_items}</ul>"

    return f"""
<!DOCTYPE html>
<html lang="no">
<head><meta charset="utf-8"><title>Kenneth Aksjeanalyse {date_str}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111">
  <div style="background:#1d4ed8;color:#fff;padding:20px;border-radius:8px;margin-bottom:24px">
    <h1 style="margin:0;font-size:22px">📊 Ukentlig aksjeanalyse</h1>
    <p style="margin:4px 0 0;opacity:.85">{date_str} · Kenneth Andersen Portefølje</p>
  </div>

  {signals_html}

  <h2>Topp kjøpskandidater denne uken</h2>
  {candidates_html}

  {eod_html}

  <h2>Makro &amp; råvarer</h2>
  {macro_html}

  <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-size:12px;color:#9ca3af">
    Generert automatisk av Kenneth Stocks AI-screener.<br>
    Ikke finansiell rådgivning. Gjør alltid egen vurdering før du handler.
  </p>
</body>
</html>
"""


def send_weekly_report(candidates: list, analyses: dict, macro: dict, eod_hits: list) -> None:
    _setup_resend()
    html = build_weekly_report_html(candidates, analyses, macro, eod_hits)
    date_str = datetime.now().strftime("%d.%m.%Y")
    params = resend.Emails.SendParams(
        from_=FROM_EMAIL,
        to=[TO_EMAIL],
        subject=f"📊 Ukentlig aksjeanalyse {date_str} – {len(candidates)} kandidater",
        html=html,
    )
    result = resend.Emails.send(params)
    logger.info(f"Weekly report sent: {result}")


def send_alert(alert: dict) -> None:
    _setup_resend()
    html = f"""
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#dc2626;color:#fff;padding:16px;border-radius:8px;margin-bottom:16px">
    <h2 style="margin:0">{alert.get('emoji','')} {alert['title']}</h2>
  </div>
  <p style="font-size:16px;line-height:1.6">{alert['body']}</p>
  <p style="font-size:12px;color:#9ca3af">Kenneth Stocks AI-monitor</p>
</div>
"""
    params = resend.Emails.SendParams(
        from_=FROM_EMAIL,
        to=[TO_EMAIL],
        subject=f"{alert.get('emoji','')} {alert['level']}: {alert['title']}",
        html=html,
    )
    resend.Emails.send(params)
    logger.info(f"Alert sent: {alert['level']}")


def send_eod_alert(hits: list) -> None:
    if not hits:
        return
    _setup_resend()
    items = "".join(
        f'<li><strong>{h["ticker"]}</strong> ({h["name"]}) – {", ".join(h["signals"])}</li>'
        for h in hits
    )
    html = f"""
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2>🔍 Inngangssignaler funnet</h2>
  <ul>{items}</ul>
  <p style="font-size:12px;color:#9ca3af">Kenneth Stocks EOD-scanner</p>
</div>
"""
    params = resend.Emails.SendParams(
        from_=FROM_EMAIL,
        to=[TO_EMAIL],
        subject=f"🔍 {len(hits)} inngangssignal(er) funnet",
        html=html,
    )
    resend.Emails.send(params)
