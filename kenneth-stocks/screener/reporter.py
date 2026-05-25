"""
Reporter: formats and sends email reports via Postmark.
Weekly report + real-time alerts.
"""

import os
import logging
from datetime import datetime
from typing import Optional

import requests

logger = logging.getLogger(__name__)

TO_EMAIL = os.getenv("REPORT_EMAIL", "kenneth@fundel.no")
FROM_EMAIL = "kenneth-stocks@kennethandersen.no"
POSTMARK_API_URL = "https://api.postmarkapp.com/email"


def _send_postmark(subject: str, html: str) -> None:
    api_key = os.environ["POSTMARK_API_KEY"]
    resp = requests.post(
        POSTMARK_API_URL,
        headers={
            "X-Postmark-Server-Token": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={
            "From": FROM_EMAIL,
            "To": TO_EMAIL,
            "Subject": subject,
            "HtmlBody": html,
            "MessageStream": "outbound",
        },
        timeout=15,
    )
    if not resp.ok:
        logger.error(f"Postmark error {resp.status_code}: {resp.text}")
        resp.raise_for_status()
    logger.info(f"Email sent via Postmark: {resp.json().get('MessageID', '')}")


_RISK_CONFIG = {
    "green": {"bg": "#16a34a", "label": "🟢 LAV RISIKO", "border": "#16a34a"},
    "yellow": {"bg": "#d97706", "label": "🟡 MIDDELS RISIKO", "border": "#d97706"},
    "red": {"bg": "#dc2626", "label": "🔴 HØY RISIKO", "border": "#dc2626"},
}

_CONSENSUS_MAP = {
    "strong_buy": "STERKT KJØP",
    "buy": "KJØP",
    "hold": "HOLD",
    "underperform": "SELG",
    "sell": "STERKT SELG",
}


def _risk_badge_html(color: str) -> str:
    cfg = _RISK_CONFIG.get(color, _RISK_CONFIG["yellow"])
    return (
        f'<span style="background:{cfg["bg"]};color:#fff;'
        f'padding:3px 10px;border-radius:12px;font-size:12px;font-weight:bold">'
        f'{cfg["label"]}</span>'
    )


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
    risk_badge = _risk_badge_html(getattr(stock, "risk_color", "yellow"))

    # Price target row
    upside_color = "#16a34a" if (stock.upside_pct or 0) > 10 else "#dc2626" if (stock.upside_pct or 0) < 0 else "#d97706"
    target_html = ""
    if stock.price_target:
        consensus_label = _CONSENSUS_MAP.get(stock.analyst_consensus or "", stock.analyst_consensus or "N/A")
        analyst_note = f"({stock.analyst_count} analytikere · {consensus_label})" if stock.analyst_count else ""
        target_html = (
            f'<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;'
            f'padding:8px 12px;margin-bottom:12px;font-size:13px">'
            f'📊 <strong>Analytikerkursmål: ${stock.price_target}</strong> '
            f'<span style="color:{upside_color};font-weight:bold">'
            f'({stock.upside_pct:+.1f}% fra nåkurs)</span> {analyst_note}'
            f'</div>'
        )

    # --- Advanced signals row ---
    signals_row = []
    fcf = getattr(stock, "fcf_yield", None)
    if fcf is not None:
        fcf_color = "#16a34a" if fcf > 5 else "#dc2626" if fcf < 0 else "#374151"
        signals_row.append(f'<span style="color:{fcf_color}"><strong>FCF yield:</strong> {fcf:+.1f}%</span>')
    si_chg = getattr(stock, "short_interest_chg", None)
    if si_chg is not None:
        si_color = "#dc2626" if si_chg > 20 else "#16a34a" if si_chg < -10 else "#374151"
        signals_row.append(f'<span style="color:{si_color}"><strong>Short ↕:</strong> {si_chg:+.0f}% MoM</span>')
    rev_up = getattr(stock, "eps_revisions_up_7d", None)
    rev_dn = getattr(stock, "eps_revisions_down_30d", None)
    if rev_up is not None or rev_dn is not None:
        rev_color = "#16a34a" if (rev_up or 0) > (rev_dn or 0) else "#dc2626"
        signals_row.append(f'<span style="color:{rev_color}"><strong>EPS rev (7d):</strong> ↑{rev_up or 0} ↓{rev_dn or 0}</span>')
    nxt = getattr(stock, "next_earnings_days", None)
    if nxt is not None:
        earn_color = "#dc2626" if nxt <= 21 else "#d97706" if nxt <= 45 else "#374151"
        earn_warn = " ⚠️ KJØP FØR RAPPORT?" if nxt <= 21 else ""
        signals_row.append(f'<span style="color:{earn_color}"><strong>Neste rapport:</strong> om {nxt}d{earn_warn}</span>')
    signals_html_row = ""
    if signals_row:
        signals_html_row = (
            '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;'
            'padding:8px 12px;margin-bottom:12px;font-size:12px;display:flex;gap:16px;flex-wrap:wrap">'
            + " &nbsp;|&nbsp; ".join(signals_row) + "</div>"
        )

    # Bold the first word of each paragraph (the KJØP/VENT/SELG verdict)
    import re
    analysis_html = analysis.strip()
    analysis_html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', analysis_html)
    analysis_html = analysis_html.replace("\n\n", "</p><p>").replace("\n", "<br>")
    analysis_html = f"<p>{analysis_html}</p>"

    return f"""
<div style="border:2px solid {_RISK_CONFIG.get(getattr(stock,'risk_color','yellow'),_RISK_CONFIG['yellow'])['border']};border-radius:8px;padding:20px;margin-bottom:20px;background:#fff">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px">
    <h2 style="margin:0;font-size:20px">{stock.ticker} – {stock.name}</h2>
    <div style="display:flex;gap:8px;align-items:center">
      {risk_badge}
      <span style="background:#1d4ed8;color:#fff;padding:4px 10px;border-radius:20px;font-size:13px;font-weight:bold">
        QGL {stock.qgl_score}/100
      </span>
    </div>
  </div>
  {target_html}
  {signals_html_row}
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


def build_weekly_report_html(candidates: list, analyses: dict[str, str], macro: dict, eod_hits: list, social_candidates: list = None, pension_data: dict = None) -> str:
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

  {_pension_section_html(pension_data or {})}

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


def send_weekly_report(candidates: list, analyses: dict, macro: dict, eod_hits: list, social_candidates: list = None, pension_data: dict = None) -> None:
    html = build_weekly_report_html(candidates, analyses, macro, eod_hits, social_candidates, pension_data)
    date_str = datetime.now().strftime("%d.%m.%Y")
    _send_postmark(
        subject=f"📊 Ukentlig aksjeanalyse {date_str} – {len(candidates)} kandidater",
        html=html,
    )
    logger.info("Weekly report sent successfully.")


def send_alert(alert: dict) -> None:
    html = f"""
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#dc2626;color:#fff;padding:16px;border-radius:8px;margin-bottom:16px">
    <h2 style="margin:0">{alert.get('emoji','')} {alert['title']}</h2>
  </div>
  <p style="font-size:16px;line-height:1.6">{alert['body']}</p>
  <p style="font-size:12px;color:#9ca3af">Kenneth Stocks AI-monitor</p>
</div>
"""
    _send_postmark(
        subject=f"{alert.get('emoji','')} {alert['level']}: {alert['title']}",
        html=html,
    )
    logger.info(f"Alert sent: {alert['level']}")


def send_eod_alert(hits: list) -> None:
    if not hits:
        return
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
    _send_postmark(
        subject=f"🔍 {len(hits)} inngangssignal(er) funnet",
        html=html,
    )


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
  <div style="margin-top:10px;padding:10px;background:#fef9c3;border-radius:5px;font-size:12px;color:#78350f;line-height:1.6">
    ⏱ Holdeperiode: 1–5 dager &nbsp;|&nbsp; 🛑 Stop-loss: 10%<br>
    💰 <strong>Standardregel:</strong> selg 50% ved +50%, trailing stop på resten<br>
    📈 <strong>Hold lenger</strong> hvis kurs fortsatt stiger + volum over 20-dagers snitt (rally pågår)<br>
    📉 <strong>Selg tidligere</strong> (&lt;+50%) hvis volum faller + åpenbar topp-formasjon
  </div>
</div>
"""


def _pension_section_html(data: dict) -> str:
    if not data:
        return ""

    cur = data["current"]
    proj = data["projection"]
    signals = data.get("signals", [])
    alloc = data.get("allocation", {})

    def nok(n):
        return f"{n:,.0f} kr".replace(",", " ")

    signal_html = ""
    level_colors = {"ACTION": "#7f1d1d", "WATCH": "#78350f"}
    for s in signals:
        color = level_colors.get(s["level"], "#374151")
        signal_html += (
            f'<div style="border-left:4px solid {color};padding:8px 12px;margin-bottom:6px;background:#fafafa;font-size:13px">'
            f'<strong style="color:{color}">{s["level"]}</strong> – {s["msg"]}</div>'
        )

    alloc_html = ""
    if alloc:
        alloc_html = (
            f'<div style="font-size:12px;color:#6b7280;margin-top:6px">'
            f'Allokering: {alloc.get("global_pct",0)}% global · '
            f'{alloc.get("nordic_pct",0)}% nordisk · '
            f'{alloc.get("em_pct",0)}% EM</div>'
        )

    stale_note = ""
    if cur.get("days_stale") and cur["days_stale"] > 30:
        stale_note = f'<span style="color:#b45309;font-size:11px"> (oppdatert for {cur["days_stale"]} dager siden)</span>'

    return f"""
<h2 style="border-top:2px solid #7c3aed;padding-top:16px;margin-top:24px">
  🏦 Pensjonsoversikt – EPK + OTP
</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#f9fafb">
    <div style="font-size:12px;color:#6b7280;margin-bottom:4px">Kron EPK – nåværende{stale_note}</div>
    <div style="font-size:22px;font-weight:bold;color:#111">{nok(cur['kron_epk_nok'])}</div>
    <div style="font-size:12px;color:#6b7280;margin-top:4px">{cur['kron_fund']}</div>
    <div style="font-size:12px;color:#6b7280">Kostnad: {cur['kron_cost_pct']}%/år</div>
    {alloc_html}
  </div>
  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#f9fafb">
    <div style="font-size:12px;color:#6b7280;margin-bottom:4px">Storebrand OTP – løpende</div>
    <div style="font-size:22px;font-weight:bold;color:#111">{nok(cur['otp_monthly_contribution'])}/mnd</div>
    <div style="font-size:12px;color:#6b7280;margin-top:4px">Arbeidsgiver-bidrag</div>
    <div style="font-size:12px;color:#6b7280">Profil: {cur['otp_profile']}</div>
  </div>
</div>
<div style="border:1px solid #7c3aed;border-radius:8px;padding:16px;background:#faf5ff;margin-bottom:12px">
  <div style="font-size:13px;color:#6b7280;margin-bottom:8px">
    Projeksjon ved {proj['retirement_age']} år ({proj['years_to_retirement']} år frem)
    – {proj['real_return_assumption_pct']}% reell avkastning/år
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
    <div style="text-align:center">
      <div style="font-size:11px;color:#6b7280">Kron EPK</div>
      <div style="font-size:16px;font-weight:bold;color:#7c3aed">{nok(proj['kron_at_retirement_nok'])}</div>
    </div>
    <div style="text-align:center">
      <div style="font-size:11px;color:#6b7280">Storebrand OTP</div>
      <div style="font-size:16px;font-weight:bold;color:#7c3aed">{nok(proj['otp_at_retirement_nok'])}</div>
    </div>
    <div style="text-align:center;border-left:1px solid #ddd">
      <div style="font-size:11px;color:#6b7280">Est. månedlig pensjon</div>
      <div style="font-size:16px;font-weight:bold;color:#059669">{nok(proj['monthly_pension_estimate_nok'])}/mnd</div>
    </div>
  </div>
</div>
{signal_html}
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
    cards_html = "".join(_social_candidate_card_html(c) for c in candidates)
    html = f"""
<div style="font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:24px">
  <div style="background:#dc2626;color:#fff;padding:16px;border-radius:8px;margin-bottom:20px">
    <h2 style="margin:0">🔥 Nye sosiale momentum-kandidater</h2>
    <p style="margin:4px 0 0;opacity:.85">{datetime.now().strftime('%d.%m.%Y %H:%M')} – 25% høyrisikoportefølje</p>
  </div>
  <p style="font-size:14px;color:#374151">
    Disse aksjene viser høy Reddit mention velocity og passerer alle kvalitetsfiltre (NYSE/NASDAQ, market cap &gt; $150M, kurs &gt; $3).
    <strong>Horisont: 1–5 dager. Stop-loss: 10%. Maks 4 000 kr per posisjon.</strong>
  </p>
  {cards_html}
  <p style="font-size:12px;color:#9ca3af">Kenneth Stocks Social Scanner</p>
</div>
"""
    _send_postmark(
        subject=f"🔥 {len(candidates)} sosiale momentum-kandidat(er) funnet",
        html=html,
    )
    logger.info(f"Social alert sent: {[c.ticker for c in candidates]}")
