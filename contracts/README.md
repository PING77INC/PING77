# PING77 Market Contracts

This directory will contain the LMSR market-maker contracts for the PING77 prediction market layer.

## Status

**Not yet implemented.** The market layer is on the v0.2 roadmap.

## Planned Architecture

- `PredictionMarketFactory.sol` — deploys per-project LMSR market instances
- `LMSRMarket.sol` — logarithmic market scoring rule for time-bucketed survival contracts
- `SettlementOracle.sol` — three-layer death declaration (objective signals, optimistic arbitration, founder-initiated)

## Contract Design

Each project gets a strip of time-bucketed contracts:
- `DEAD_BY_3MO` / `DEAD_BY_6MO` / `DEAD_BY_12MO` / `DEAD_BY_24MO` / `SURVIVES_24MO+`

Prices must sum to 1 and be monotonically non-decreasing. See Research Note 002 for details.

## Deployment

```bash
cd contracts
forge build
forge script script/DeployFactory.s.sol --rpc-url $RPC_URL --broadcast --verify
```

Requires [Foundry](https://book.getfoundry.sh/) installed.
