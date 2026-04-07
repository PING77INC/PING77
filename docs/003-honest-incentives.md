# Making Contributors Tell the Truth: Honest Incentives Without a Token

> // 003 · INCENTIVE DESIGN · 2026.04

This is the most counterintuitive part of the entire PING77 design: we don't issue a governance token, we don't issue a contributor token, we don't issue any "participate-to-earn" instrument. Because the moment you have a token, the contributor's optimal strategy shifts from "write an honest post-mortem" to "write whatever pumps the token"—and these two things are almost always opposites. Once the incentive layer is contaminated by a token, the signal-to-noise ratio of the entire dataset collapses immediately.

## Shapley-Value Attribution

So why would anyone contribute? The answer: a cash share of protocol fees. Every time a new founder queries risk or someone trades in a project market, a fee is generated. That fee is distributed back to the original data uploaders by **Shapley value** across the death modes their data informed.

The advantage of Shapley values is that their definition of "marginal contribution" is the unique fair allocation in a game-theoretic sense: if your story was among the first seeds for a death mode, your share is significantly higher than that of the 500th person to add a similar story. Conversely, if you contribute a unique, rare way of dying—even if you're the only contributor—you keep collecting as long as the market keeps querying it.

```
payout(contributor_i) =
  Σ over all death modes m:
    shapley_value(i, m) × fees_generated(m)
```

This allocation function is deterministic, auditable, and independent of any token price. Contributor income is tied directly to "how many people actually use the protocol," not "how hot the narrative is."

## Reputation as a Second Layer

Money isn't the only incentive. Many founders are willing to share failures because they want to be seen by peers as honest and reflective—a form of social capital. PING77 captures this with a non-transferable **reputation score**: every time a death mode you contributed is hit by a new query or cited by a successful prediction, your reputation goes up. Reputation can't be traded, can't be airdropped, and can only be earned through real contribution.

High-reputation contributors get a few privileges: a higher fee-share multiplier (capped at 1.5x), free credits for querying new projects, and proposal rights in protocol governance. All of these are tied to "ability to *use* the protocol," not "ability to *extract* from the protocol"—which is the fundamental difference between governance tokens and reputation systems.

## Anti-Fraud: Economic Verification, Not On-Chain Verification

One might ask: if there's money at stake, won't people fabricate fake failure stories to farm Shapley shares? Yes. Our countermeasure is to **make the cost of forgery higher than the expected payoff**:

Every uploaded failure must come with at least two hard-to-fake timestamp anchors—a GitHub commit history (or equivalent verifiable repo), domain WHOIS registration, Stripe / Apple / Google Play revenue snapshots, or verifiable business registration records. These artifacts don't need to be public, but their hashes must be on-chain, and the LLM cross-checks temporal consistency during causal-chain extraction. A fabricated "we worked 18 months and failed" story without 18 months of real activity evidence gets dropped at the causal-chain stage and never enters the pattern library.

No complex on-chain identity system required, no KYC—you just need to make "forging a failure that passes verification" cost more than the expected payout from a real failure. In most cases, actually failing once is cheaper than faking it.
