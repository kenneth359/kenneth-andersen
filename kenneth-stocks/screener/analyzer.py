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
    lines = [
        f"Ticker: {stock.ticker}",
        f"Navn: {stock.name}",
        f"Pris: ${stock.price}" if stock.price else "",
        f"Sektor: {stock.details.get('sector', 'N/A')}",
        f"Bransje: {stock.details.get('industry', 'N/A')}",
        "",
        "NØKKELTALL:",
        f"  ROIC (proxy): {stock.roic*100:.1f}%" if stock.roic else "  ROIC: N/A",
        f"  Earnings Yield (EBIT/EV): {stock.earnings_yield*100:.1f}%" if stock.earnings_yield else "  Earnings Yield: N/A",
        f"  PEG-ratio: {stock.peg}" if stock.peg else "  PEG: N/A",
        f"  EPS-vekst: {stock.eps_growth_3y*100:.1f}%" if stock.eps_growth_3y else "  EPS-vekst: N/A",
        f"  Gjeld/egenkapital: {stock.debt_equity}" if stock.debt_equity else "  D/E: N/A",
        f"  Piotroski F-Score: {stock.piotroski}/9" if stock.piotroski is not None else "  Piotroski: N/A",
        f"  6-mnd momentum: {stock.momentum_6m*100:.1f}%" if stock.momentum_6m else "  Momentum: N/A",
        f"  Over 200-dagers MA: {'Ja' if stock.above_200d_ma else 'Nei'}" if stock.above_200d_ma is not None else "",
        f"  EV/EBITDA: {stock.details.get('ev_ebitda', 'N/A')}",
        f"  Markedsverdi: ${stock.market_cap_usd/1e9:.1f}mrd" if stock.market_cap_usd else "",
        f"  QGL-score: {stock.qgl_score}/100",
    ]
    return "\n".join(l for l in lines if l)


SYSTEM_PROMPT = """Du er en erfaren aksjeanalytiker som analyserer aksjer for en norsk privatinvestor, Kenneth Andersen.
Kenneth bruker en QGL-strategi (Quality + Growth + Lynch) og investerer via Nordnet IKZ (for US-aksjer) og ASK (for EØS-aksjer).
Tidshorisont: 12-18 måneder. Porteføljestørrelse: ~50 000 kr. Maks 5-8 posisjoner.

Skriv analysen på norsk. Vær konkret og kortfattet. Unngå generiske advarsler."""

ANALYSIS_PROMPT_TEMPLATE = """Analyser denne aksjen basert på de oppgitte nøkkeltallene og QGL-screener-resultatene:

{stock_context}

Skriv en strukturert analyse med disse seksjonene:

**KJØPSCASE (3-4 setninger)**
Hva er det overbevisende argumentet for å kjøpe? Hva driver vekst og avkastning?

**RISIKOER (2-3 punkter)**
Hva er de viktigste risikoene? Hva kan gå galt?

**VERDSETTELSE**
Er nøkkeltallene attraktive sammenlignet med sektoren? Hva er rimelig kurspotensial?

**KONKLUSJON**
En setning: Kjøp / Vent / Ikke aktuelt – og hvorfor.

Hold analysen under 300 ord."""


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
