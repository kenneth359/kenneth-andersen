# Kenneth Stocks AI Screener

Automatisert aksje- og sosial momentum-screener. Kjøres 24/7 på en VPS og sender email-rapporter til kenneth@fundel.no.

## Hva systemet gjør

| Jobb | Frekvens | Hva |
|---|---|---|
| **QGL-screener** | Mandag 07:00 | Screener S&P 500/400 + OBX på ROIC, PEG, momentum |
| **Makro-rapport** | Mandag 07:00 | Råvarer, kredittspread, VIX, fraktrater |
| **EOD-scan** | Daglig 22:15 | RSI + volum-signaler på watchlisten |
| **Social scanner** | Hvert 6. time | Reddit mention velocity via ApeWisdom |
| **Panikk-monitor** | Hvert 30. min | VIX > 35/40/50 + Fear & Greed < 25 |

## Porteføljestruktur

| Bucket | Beløp | Strategi | Horisont |
|---|---|---|---|
| QGL-kjerne | ~37 500 kr | Quality + Growth + Lynch | 12–18 mnd |
| Social momentum | ~12 500 kr | Reddit velocity + kvalitetsfiltre | 1–5 dager |

## Oppsett (kjøres én gang på Hetzner VPS)

```bash
bash setup.sh
```

## API-nøkler som trengs

| Nøkkel | Hvor | Pris |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com/keys | ~$5–10/mnd |
| `RESEND_API_KEY` | Allerede i portfolio-nettstedet | Gratis |
| `FRED_API_KEY` | fred.stlouisfed.org/docs/api/api_key.html | Gratis |
| `ALPHA_VANTAGE_KEY` | alphavantage.co/support/#api-key | Gratis |

## Kjøre manuelt

```bash
docker compose exec screener python main.py --weekly   # Ukentlig rapport nå
docker compose exec screener python main.py --social   # Social scan nå
docker compose exec screener python main.py --eod      # EOD scan nå
docker compose exec screener python main.py --panic    # Sjekk VIX/frykt nå
```

## Konfigurering

- `config/thresholds.yaml` – QGL-filtergrenser
- `config/social_config.yaml` – Social momentum-regler (stop-loss, take-profit, kvalitetsfiltre)
- `config/universe.yaml` – Aksjer som screenes + eksisterende posisjoner
- `config/watchlist.yaml` – Ekstra watchlist utover universet
