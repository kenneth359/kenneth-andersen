---
name: weekly-stock-report
description: Generate Kenneth's weekly investment report (QGL core, social momentum, pension) directly as a Claude chat message. No external services — data via WebSearch, math via local Python. Triggered on a weekly schedule via Claude Code on the web, or run manually with "/weekly-stock-report".
---

# Weekly Stock Report

Kenneth Andersen (kenneth@fundel.no), 41, investing until age 70. Three portfolios, all reported together in ONE message every run. No email, no server — the report IS this chat message. Config lives in `kenneth-stocks/config/*.yaml` in this repo; read it fresh each run, don't hardcode values from memory.

## Why this exists

This used to run as a Python bot on a Hetzner VPS emailing reports via Postmark, using `yfinance` for data. That's gone — `yfinance`, Postmark, and similar hosts are blocked from this sandboxed environment's network, and running a VPS just to send an email was unnecessary overhead. Now: WebSearch/WebFetch for data (those go through Anthropic's infra, not the blocked proxy), Claude's own reasoning for analysis (no separate Anthropic API key needed), and the chat message itself as delivery.

## Step 1 — Load config

Read these files from `kenneth-stocks/config/`:
- `universe.yaml` — OBX watchlist tickers + Kenneth's actual holdings (ASK account + unlisted)
- `watchlist.yaml` — US mega-cap watchlist
- `thresholds.yaml` — QGL scoring thresholds
- `social_config.yaml` — social momentum rules (position size, stop-loss, take-profit)
- `pension_config.yaml` — Kron EPK + Storebrand OTP figures

## Step 2 — QGL core portfolio (~37 500 kr, 12–18 mnd horisont)

Don't attempt to screen the full S&P 500/400 — that's not practical via web search each week. Instead, cover:
1. **Kenneth's existing holdings** (from `universe.yaml` → `kenneth_holdings.ask`) — always report on these, they need ongoing KJØP/HOLD/SELG calls regardless of whether they still pass the screen.
2. **`watchlist.yaml` extra_watchlist** (US mega-caps) + **`universe.yaml` obx_tickers** (Norwegian OBX) — scan these for new candidates.

For each ticker, use WebSearch (queries like `"<ticker> stock analyst price target"`, `"<ticker> stock ROIC PEG earnings growth"`, `"<ticker> stock 200 day moving average"`) to gather:
- Current price
- Analyst mean price target, consensus rating, analyst count → upside %
- Rough profitability/value read (ROIC or margins, P/E or PEG, EPS growth trend) — enough to judge against `thresholds.yaml` (`min_roic: 15%`, `max_peg: 1.0`, `min_eps_growth_3y: 10%`, `max_debt_equity: 0.5`)
- Momentum: is it above its 200-day moving average? Recent 6-month trend?
- Next earnings date (flag if within 21 days)
- Anything material this week (news, guidance changes)

You won't get precise Piotroski F-scores or FCF yield from search results — don't fabricate exact numbers. Give a qualitative call instead ("solid" / "middels" / "svak" on profitability, leverage, momentum) and be explicit that it's a qualitative read, not a computed score.

Score each as 🟢 grønn / 🟡 gul / 🔴 rød risiko based on: passes most QGL criteria + above 200d MA + analyst upside positive = grønn; mixed signals = gul; fails multiple criteria or below MA with negative analyst view = rød.

## Step 3 — Social momentum (~12 500 kr, 1–5 dagers hold)

Use WebSearch for current Reddit/social momentum stocks (queries like `"apewisdom trending stocks reddit today"`, `"reddit most mentioned stocks this week"`, `"stocktwits trending tickers"`). Apply quality gates from `social_config.yaml`: NYSE/NASDAQ listed, market cap > $150M, price > $3. Flag ESMA risk if market cap < $500M (may not be tradeable on Nordnet). Report position sizing and stop-loss/take-profit rules straight from `social_config.yaml` — don't reinvent them.

If nothing qualifies this week, say so in one line and move on — don't pad with weak candidates.

## Step 4 — Pension (Kron EPK + Storebrand OTP, 29-årig horisont)

Pure math, no network needed — run it directly:

```bash
cd kenneth-stocks && python3 -c "
from screener.pension_tracker import get_pension_snapshot
import json
print(json.dumps(get_pension_snapshot(), indent=2, ensure_ascii=False))
"
```

Report current balances, 29-year projection, estimated monthly pension at retirement, and any ACTION/WATCH signals it returns (e.g. Storebrand not on Offensiv profile, stale data). Only remind about updating `pension_config.yaml` if `days_stale > 45`.

## Step 5 — Macro snapshot

Brief WebSearch for current VIX level, CNN Fear & Greed Index, and any major macro headline from the past week (Fed, inflation print, etc.). Keep this to 3-4 lines — it's context, not the main event.

## Output format

Write the ENTIRE report as your final chat message in this session — that delivery IS the point, there's no separate send step. Norwegian, direct, no hedging. Rules:

1. Every stock call opens with **KJØP**, **HOLD**, or **SELG** — never "kan vurderes" or "muligens"
2. Structure per stock:
   ```
   ### TICKER – Navn 🟢/🟡/🔴
   **[KJØP/HOLD/SELG]** – én setning årsak
   Kursmål: $X (Y% oppside) · Z analytikere · [konsensus]
   Hvorfor: 2-3 setninger med konkrete tall
   Risiko: 1-2 spesifikke risikoer
   ```
3. Group by portfolio with clear headers: QGL-kjerne → Social momentum → Pensjon → Makro
4. Keep the whole thing scannable — Kenneth reads this on his phone. Bullet points over prose.
5. End with a one-line summary of the week's single most important action, if there is one.

## Step 6 — Notify

After posting the report, send a short `PushNotification` (e.g. "Ukentlig aksjerapport klar i Claude") so Kenneth knows it's ready if he's not watching the session live.

## Notes on config maintenance

- `pension_config.yaml` → Kenneth updates `kron_epk.balance_nok` and `storebrand_otp.balance_nok` manually once a month from the Kron/Storebrand apps
- `universe.yaml` → Kenneth's ASK holdings should be kept current if he buys/sells
- No API keys, no `.env`, no Docker — this skill only needs the repo checked out and network access to WebSearch/WebFetch, which Claude Code on the web already has
