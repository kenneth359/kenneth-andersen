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


def build_weekly_report_html(candidates: list, analyses: dict[str, str], macro: dict, eod_hits: list, social_candidates: list = None) -> str:
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

  <h2>Topp kjøpskandidater denne uken (QGL – 75% kjernestrategi)</h2>
  {candidates_html}

  {_social_section_html(social_candidates or [])}

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


def send_weekly_report(candidates: list, analyses: dict, macro: dict, eod_hits: list, social_candidates: list = None) -> None:
    _setup_resend()
    html = build_weekly_report_html(candidates, analyses, macro, eod_hits, social_candidates)
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


def _social_candidate_card_html(c) -> str:
    velocity_str = f"{c.mention_velocity:.1f}x"
    rank_str = f"#{c.rank_now} (var #{c.rank_24h_ago})"
    price_change_str = f"{c.price_5d_change*100:+.1f}%" if c.price_5d_change is not None else "N/A"
    mcap_str = f"${c.market_cap_usd/1e6:.0f}M" if c.market_cap_usd else "N/A"
    st_badge = ' <span style="background:#1da1f2;color:#fff;font-size:11px;padding:2px 6px;border-radius:10px">StockTwits ✓</span>' if c.details.get("stocktwits") else ""
    esma_warning = '<p style="color:#b45309;font-size:12px;margin-top:8px">⚠️ Market cap under $500M – verifiser tilgjengelighet på Nordnet (ESMA-regler).</p>' if c.esma_flag else ""
    analysis_html = c.claude_analysis.replace("\n", "<br>")

    return f"""
<div style="border:1px solid #fca5a5;border-radius:8px;padding:16px;margin-bottom:16px;background:#fff">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <h3 style="margin:0;font-size:17px">{c.ticker} – {c.name}{st_badge}</h3>
    <span style="background:#dc2626;color:#fff;padding:3px 10px;border-radius:20px;font-size:13px;font-weight:bold">
      Social {c.social_score}/100
    </span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:12px">
    <div style="background:#fef2f2;padding:6px;border-radius:5px;text-align:center">
      <div style="font-size:10px;color:#6b7280">Kurs</div>
      <div style="font-weight:bold">${c.price}</div>
    </div>
    <div style="background:#fef2f2;padding:6px;border-radius:5px;text-align:center">
      <div style="font-size:10px;color:#6b7280">Market cap</div>
      <div style="font-weight:bold">{mcap_str}</div>
    </div>
    <div style="background:#fef2f2;padding:6px;border-radius:5px;text-align:center">
      <div style="font-size:10px;color:#6b7280">Mention velocity</div>
      <div style="font-weight:bold">{velocity_str}</div>
    </div>
    <div style="background:#fef2f2;padding:6px;border-radius:5px;text-align:center">
      <div style="font-size:10px;color:#6b7280">Reddit rank</div>
      <div style="font-weight:bold">{rank_str}</div>
    </div>
    <div style="background:#fef2f2;padding:6px;border-radius:5px;text-align:center">
      <div style="font-size:10px;color:#6b7280">5-dagers kurs</div>
      <div style="font-weight:bold">{price_change_str}</div>
    </div>
  </div>
  <div style="font-size:13px;color:#374151;line-height:1.5">{analysis_html}</div>
  {esma_warning}
  <div style="margin-top:10px;padding:8px;background:#fef9c3;border-radius:5px;font-size:12px;color:#78350f">
    ⏱ Holdeperiode: 1–5 dager &nbsp;|&nbsp; 🛑 Stop-loss: 10% &nbsp;|&nbsp; 💰 Ta 50% gevinst ved +20%
  </div>
</div>
"""


def _social_section_html(candidates: list) -> str:
    if not candidates:
        return ""
    cards = "".join(_social_candidate_card_html(c) for c in candidates)
    return f"""
<h2 style="border-top:2px solid #dc2626;padding-top:16px;margin-top:24px">
  🔥 Social Momentum – 25% høyrisikoportefølje
</h2>
<p style="font-size:13px;color:#6b7280;margin-bottom:16px">
  Basert på Reddit mention velocity. Holdeperiode 1–5 dager. Maks 4 000 kr per posisjon. Hard stop-loss 10%.
</p>
{cards}
"""


def send_social_alert(candidates: list) -> None:
    """Send immediate email alert when new social momentum candidates are found."""
    if not candidates:
        return
    _setup_resend()
    cards_html = "".join(_social_candidate_card_html(c) for c in candidates)
    html = f"""
<div style="font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:24px">
  <div style="background:#dc2626;color:#fff;padding:16px;border-radius:8px;margin-bottom:20px">
    <h2 style="margin:0">🔥 Nye sosiale momentum-kandidater</h2>
    <p style="margin:4px 0 0;opacity:.85">{datetime.now().strftime('%d.%m.%Y %H:%M')} – 25% høyrisikoportefølje</p>
  </div>
  <p style="font-size:14px;color:#374151">
    Disse aksjene viser høy Reddit mention velocity og passerer alle kvalitetsfiltre (NYSE/NASDAQ, market cap > $150M, kurs > $3).
    <strong>Horisont: 1–5 dager. Stop-loss: 10%. Maks 4 000 kr per posisjon.</strong>
  </p>
  {cards_html}
  <p style="font-size:12px;color:#9ca3af">Kenneth Stocks Social Scanner · Ikke finansiell rådgivning.</p>
</div>
"""
    params = resend.Emails.SendParams(
        from_=FROM_EMAIL,
        to=[TO_EMAIL],
        subject=f"🔥 {len(candidates)} sosiale momentum-kandidat(er) funnet",
        html=html,
    )
    resend.Emails.send(params)
    logger.info(f"Social alert sent: {[c.ticker for c in candidates]}")
