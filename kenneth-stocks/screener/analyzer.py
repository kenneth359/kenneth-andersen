"""
Analyzer: calls Claude API to generate investment analysis for QGL screener candidates.
"""

import os
import logging
from typing import Optional

import anthropic

logger = logging.getLogger(__name__)

_client: Optional[anthropic.Anthropic] = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    return _client


def _format_stock_context(stock) -> str:
    """Format stock data for Claude prompt."""
    upside_str = f"{stock.upside_pct:+.1f}% oppside" if stock.upside_pct is not None else "ingen analytikerkursmål"
    analyst_str = f"{stock.analyst_consensus} ({stock.analyst_count} analytikere)" if stock.analyst_consensus else "ingen konsensus"
    lines = [
        f"Ticker: {stock.ticker}",
        f"Navn: {stock.name}",
        f"Pris: ${stock.price}" if stock.price else "",
        f"Analytikerkursmål: ${stock.price_target} ({upside_str})" if stock.price_target else "",
        f"Analytikerkonsensus: {analyst_str}",
        f"Sektor: {stock.details.get('sector', 'N/A')}",
        f"Bransje: {stock.details.get('industry', 'N/A')}",
        f"Beta: {stock.details.get('beta', 'N/A')}",
        "",
        "NØKKELTALL:",
        f"  ROIC (proxy): {stock.roic*100:.1f}%" if stock.roic else "  ROIC: N/A",
        f"  Earnings Yield (EBIT/EV): {stock.earnings_yield*100:.1f}%" if stock.earnings_yield else "  Earnings Yield: N/A",
        f"  PEG-ratio: {stock.peg}" if stock.peg else "  PEG: N/A",
        f"  Forward P/E: {stock.details.get('forward_pe', 'N/A')}",
        f"  EPS-vekst: {stock.eps_growth_3y*100:.1f}%" if stock.eps_growth_3y else "  EPS-vekst: N/A",
        f"  Gjeld/egenkapital: {stock.debt_equity}" if stock.debt_equity else "  D/E: N/A",
        f"  Piotroski F-Score: {stock.piotroski}/9" if stock.piotroski is not None else "  Piotroski: N/A",
        f"  6-mnd momentum: {stock.momentum_6m*100:.1f}%" if stock.momentum_6m else "  Momentum: N/A",
        f"  Over 200-dagers MA: {'Ja' if stock.above_200d_ma else 'Nei'}" if stock.above_200d_ma is not None else "",
        f"  Short ratio: {stock.details.get('short_ratio', 'N/A')}",
        f"  EV/EBITDA: {stock.details.get('ev_ebitda', 'N/A')}",
        f"  Markedsverdi: ${stock.market_cap_usd/1e9:.1f}mrd" if stock.market_cap_usd else "",
        f"  QGL-score: {stock.qgl_score}/100",
        f"  Systemets risikofarge: {stock.risk_color.upper()}",
    ]
    return "\n".join(l for l in lines if l)


SYSTEM_PROMPT = """Du er en kontant aksjeanalytiker som gir Kenneth Andersen direkte kjøps- og salgsanbefalinger.

Regler du MÅ følge:
1. Første linje er ALLTID én av: «KJØP», «VENT», eller «SELG» – ingen annen åpning
2. Aldri skriv «kan», «bør vurdere», «muligens», «potensielt» – skriv fakta og konklusjoner
3. Risiko: skriv «risiko: X» ikke «det kan hende at X»
4. Kursmål: si eksakt hva du tror kursen er verdt om 12 mnd, ikke bare analytikernes snitt
5. Maks 250 ord. Norsk.

Kenneth: 41 år, 12-18 mnd horisont, ~50 000 kr handelsportefølje, Nordnet IKZ (US) og ASK (EØS)."""

ANALYSIS_PROMPT_TEMPLATE = """Analyser denne aksjen og gi Kenneth en direkte anbefaling:

{stock_context}

Struktur (følg nøyaktig):

**[KJØP / VENT / SELG]** – [én setning årsak]

**Kursmål 12 mnd:** [ditt eget estimat i USD, ikke bare analytikernes snitt] ([X]% fra nåværende kurs)
**Analytikere:** [oppside fra analytikerkursmål, antall]

**Hvorfor:**
[2-3 setninger med de konkrete tallargumentene. Tall, ikke adjektiver.]

**Risikoer:**
- [Spesifikk risiko 1 med konsekvens]
- [Spesifikk risiko 2 med konsekvens]

**Trigger å vente på:** [Konkret hendelse – f.eks. «neste kvartalsrapport dd.mm» eller «brudd over $X»]

Maks 200 ord."""


def analyze_stock(stock) -> str:
    """Generate a 1-page analysis of a single stock using Claude."""
    client = _get_client()
    context = _format_stock_context(stock)
    prompt = ANALYSIS_PROMPT_TEMPLATE.format(stock_context=context)

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=600,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Claude API error for {stock.ticker}: {e}")
        return f"Analyse ikke tilgjengelig for {stock.ticker} ({e})"


def analyze_batch(stocks: list, max_concurrent: int = 3) -> dict[str, str]:
    """Analyze a batch of stocks. Returns dict of ticker -> analysis text."""
    results = {}
    for i, stock in enumerate(stocks):
        logger.info(f"Analyzing {stock.ticker} ({i+1}/{len(stocks)})...")
        results[stock.ticker] = analyze_stock(stock)
    return results
