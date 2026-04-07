# Self-Host Guide: From Zero to Your First Death Market

> // 004 · SELF-HOST GUIDE · 2026.04

PING77 is an open-source reference implementation. There is no official hosted version. If you want to run it, you provide the infrastructure. This guide assumes you're comfortable on the command line, have a Linux server, and have touched Web3 development at least once.

## System Requirements

A minimum viable deployment needs:

```
- Linux server (Ubuntu 22.04+ / Debian 12+)
- 4 vCPU / 8GB RAM / 50GB SSD
- Python 3.11+ / Node.js 20+
- PostgreSQL 15+ (for causal chains and pattern library)
- Redis 7+ (for market quote caching)
- Any EVM-compatible RPC (Base / Arbitrum recommended)
```

## Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/PING77INC/PING77.git
cd ping77
make bootstrap     # install python / node deps
make db-init       # initialize postgres schema
cp .env.example .env
```

Edit `.env` with the required keys:

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
RPC_URL=https://mainnet.base.org
DEPLOYER_PRIVATE_KEY=0x...
```

Note that all three LLM keys are required—the protocol depends on multi-model cross-validation to fight hallucinations (see Research Note 001). If you only configure one, the extraction pipeline will refuse to start.

## Step 2: Deploy the Market-Maker Contracts

The market layer of PING77 is a set of LMSR contracts; each project gets its own market instance. Deploy the factory contract first:

```bash
cd contracts
forge build
forge script script/DeployFactory.s.sol \
  --rpc-url $RPC_URL \
  --broadcast \
  --verify
```

Write the resulting factory address back into `.env` as `FACTORY_ADDRESS`.

## Step 3: Start the Extraction Pipeline

The extraction pipeline is the protocol's core service—it turns uploaded failure projects into structured death modes:

```bash
make extractor     # causal-chain extraction worker
make clusterer     # embedding clustering worker (runs every 6h)
```

These two processes are not cheap on LLM tokens. Rough estimate: $0.15-$0.40 of API cost per failure story.

## Step 4: Start the API and Frontend

```bash
make api       # start FastAPI backend (default :8000)
make web       # start Next.js frontend (default :3000)
```

Opening `http://localhost:3000` should show an empty PING77 instance.

## Step 5: Seed Data (Optional but Strongly Recommended)

```bash
make seed-public
# Pulls from public post-mortem sources:
#   - CB Insights startup failure database
#   - Failory public cases
#   - Hacker News "Show HN: My failed startup" tag
#   - Indie Hackers failure threads
```

The seed script takes roughly 2-6 hours. When done you'll have around 300-500 initial death modes.

## Step 6: Open Uploads

```bash
UPLOADS_ENABLED=true
make restart-api
```

## FAQ

**Q: Can I skip deploying the market-maker contracts and only run extraction?**
Yes. Set `MARKET_LAYER=disabled`. The protocol becomes a pure failure knowledge base with no pricing market.

**Q: What if I want to use my own modified LLM prompts for causal-chain extraction?**
All prompts live under `packages/extractor/extractor/prompts/` as YAML files and can be edited directly.

**Q: What does deployment cost?**
Server ~$40/month + LLM API ~$0.15-0.40 per extraction + on-chain gas (~$0.5-2 per new market on Base). A small instance running 100 projects costs roughly $80-150/month.

**Q: After I fork the protocol, how does my instance interoperate with others?**
It doesn't yet. Cross-instance federation is on the v0.2 roadmap.
