# Kenneth Stocks — ukentlig rapport i Claude

Ukentlig investeringsrapport levert direkte som en Claude-melding. Ingen server, ingen Docker, ingen e-posttjeneste — rapporten genereres av Claude selv via `.claude/skills/weekly-stock-report/`, satt opp som en ukentlig **Trigger** i Claude Code on the web.

## Hvorfor ingen server

Systemet kjørte tidligere som en Python-bot på en Hetzner VPS med `yfinance` for data og Postmark for e-post. Det er lagt ned: `yfinance` og Postmark er blokkert fra Claude Code sitt sandkasse-nettverk uansett, og en VPS bare for å sende én e-post i uken var unødvendig. Nå henter Claude data via websøk (som går via Anthropics egen infrastruktur, ikke den blokkerte proxyen) og leverer rapporten som selve chat-meldingen.

## Porteføljestruktur

| Bucket | Beløp | Strategi | Horisont |
|---|---|---|---|
| QGL-kjerne | ~37 500 kr | Quality + Growth + Lynch | 12–18 mnd |
| Social momentum | ~12 500 kr | Reddit velocity + kvalitetsfiltre | 1–5 dager |
| Pensjon | Kron EPK + Storebrand OTP | Indeksfond, faktor-tilt | 29 år |

## Hvordan det kjører

1. En ukentlig **Trigger** i Claude Code on the web starter en ny økt
2. Økten kjører skillen `weekly-stock-report` (se `.claude/skills/weekly-stock-report/SKILL.md`)
3. Claude leser config-filene under, henter live data via WebSearch, kjører pensjonsberegningen lokalt (ren Python, ingen nettverk), og skriver rapporten som chat-meldingen
4. En kort push-varsel sendes når rapporten er klar

## Kjøre manuelt

I en Claude Code-økt i dette repoet:
```
/weekly-stock-report
```

## Konfigurering

- `config/thresholds.yaml` – QGL-filtergrenser (ROIC, PEG, momentum osv.)
- `config/social_config.yaml` – Social momentum-regler (stop-loss, take-profit, kvalitetsfiltre)
- `config/universe.yaml` – OBX-watchlist + Kenneths faktiske ASK-beholdning
- `config/watchlist.yaml` – Ekstra US-watchlist
- `config/pension_config.yaml` – Kron EPK + Storebrand OTP-saldo (oppdateres manuelt ~månedlig)

## Vedlikehold

- Oppdater `pension_config.yaml` → `kron_epk.balance_nok` og `storebrand_otp.balance_nok` når saldo endrer seg i appene
- Oppdater `universe.yaml` → `kenneth_holdings` ved kjøp/salg på ASK-kontoen
