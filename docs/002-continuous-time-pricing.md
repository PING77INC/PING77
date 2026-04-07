# Continuous-Time Pricing for "How Many Months Until It Dies"

> // 002 · MARKET MECHANICS · 2026.04

Traditional prediction markets like Polymarket and Augur are good at one thing: pricing whether some binary event will occur by a future date. "Will Trump win in 2024?" "Will BTC break $100k by year-end?"—these are classic yes/no contracts. But what PING77 needs to price isn't binary at all: *whether* a new startup will die isn't really a question (most do). The question is *when* it dies and *how*. That's a continuous-time, multi-mode survival process.

## From Yes/No Contracts to Survival Curves

Our solution borrows the Kaplan-Meier estimator from survival analysis and bakes it into the market-maker logic. The market doesn't issue a single binary token; it issues a strip of time-bucketed contracts: `DEAD_BY_3MO` / `DEAD_BY_6MO` / `DEAD_BY_12MO` / `DEAD_BY_24MO` / `SURVIVES_24MO+`. The prices of these contracts must sum to 1 and be monotonically non-decreasing—any arbitrageur can free-money on a monotonicity violation, which automatically maintains the curve shape.

The immediate benefit: **the market price *is* an implicit survival curve**. You can directly read off "the market thinks this project has a 23% chance of surviving past month 12," no extra computation required. For founders, this is a free, money-backed risk health checkup.

## LMSR or CPMM?

For the market-making mechanism, we ultimately chose **LMSR (Logarithmic Market Scoring Rule)** over a Uniswap-style constant product (CPMM). The reason is cold start: CPMM needs initial liquidity to open, but every project in PING77 is its own market and most will never see significant volume. LMSR lets a market maker open at zero inventory with a fixed liquidity parameter `b`; the loss is bounded above by `b·ln(N)`, which the protocol treasury can budget exactly.

The trade-off is that LMSR has higher slippage on large trades—but that's a feature, not a bug. It punishes whales trying to manipulate small markets.

## The Settlement Oracle: Who Declares Death

The hardest part of a prediction market has never been pricing—it's settlement. "Is this project dead?" is a much harder question than "did Trump win?" because founders have a strong incentive to pretend they're still alive. We use a three-layer settlement mechanism:

1. **Objective signals**: domain expired, GitHub repo silent for 90 days, no new Stripe subscriptions, official accounts stopped posting—any two triggers move the project into arbitration.
2. **UMA-style optimistic arbitration**: anyone can submit a "this project is dead" assertion with a posted bond; if no one disputes within a 7-day challenge window, it settles.
3. **Founder-initiated settlement**: the founder can self-declare death and receive a small "honesty dividend"—an incentive to exit gracefully rather than zombie along.
