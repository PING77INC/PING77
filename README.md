<div align="center">

<pre>
 ____    ___   _   _    ____     _____   _____ 
|  _ \  |_ _| | \ | |  / ___|   |___  | |___  |
| |_) |  | |  |  \| | | |  _       / /     / / 
|  __/   | |  | |\  | | |_| |     / /     / /  
|_|     |___| |_| \_|  \____|    /_/     /_/   
</pre>

### A Risk Market for Dead Projects

Every failure has a price. Now you can collect it.

<br />

[![Website](https://img.shields.io/badge/Website-ping77.xyz-0a0f0a?style=for-the-badge&logo=googlechrome&logoColor=7fff7f&labelColor=0a0f0a)](https://ping77.xyz)
[![Twitter](https://img.shields.io/badge/Twitter-@PING77LABS-0a0f0a?style=for-the-badge&logo=x&logoColor=7fff7f&labelColor=0a0f0a)](https://x.com/PING77LABS)
[![GitHub](https://img.shields.io/badge/GitHub-PING77INC%2FPING77-0a0f0a?style=for-the-badge&logo=github&logoColor=7fff7f&labelColor=0a0f0a)](https://github.com/PING77INC/PING77)

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-7fff7f?style=flat-square&labelColor=0a0f0a)](./LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-7fff7f?style=flat-square&logo=python&logoColor=7fff7f&labelColor=0a0f0a)](https://python.org)
[![Node.js 20+](https://img.shields.io/badge/Node.js-20+-7fff7f?style=flat-square&logo=nodedotjs&logoColor=7fff7f&labelColor=0a0f0a)](https://nodejs.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-7fff7f?style=flat-square&logo=nextdotjs&logoColor=7fff7f&labelColor=0a0f0a)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-7fff7f?style=flat-square&logo=fastapi&logoColor=7fff7f&labelColor=0a0f0a)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-7fff7f?style=flat-square&logo=postgresql&logoColor=7fff7f&labelColor=0a0f0a)](https://postgresql.org)

</div>

---

## What is PING77?

PING77 is an open-source protocol that transforms failed startup data into structured, machine-readable risk signals. It is the first system to treat failure as a **compounding asset** rather than a sunk cost.

**Three steps:**

1. **Upload** — Contributors drop a dead project's code, pitch deck, burn record, and post-mortem into the protocol.
2. **Extract** — LLMs distill thousands of messy failure stories into standardized **death modes**: structured `(trigger, mechanism, outcome, time)` tuples clustered by semantic similarity.
3. **Price** — New founders query their project profile against the death mode library. A prediction market prices "how many months until it dies" using time-bucketed survival contracts. Original contributors earn fees via Shapley-value attribution every time their data is queried.

> **This is a reference implementation and thought experiment.** There is no hosted version, no official token, no airdrop. The protocol is forever free, open-source, and runs without any token. Fork it, read it, deploy it yourself.

---

## Why This Exists

Every founder, researcher, and trader has a pile of projects rotting on their hard drive. These "failures" are the most underrated dataset in the world — they tell you precisely which paths don't work, in which month they break, and why.

Existing post-mortem databases (CB Insights, Failory, etc.) stop at "archive in human-readable form." They are **museums, not markets**. PING77 turns failure modes from *stories* into *signals an algorithm can consume* — and once they're signals, they can be priced, hedged, and compounded.

**For the first time, failure compounds.** The project you killed ten years ago might still be sending you checks in year ten, because the next generation of founders is still making the same mistakes.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/PING77INC/PING77.git
cd ping77

# Install all dependencies (Python + Node) and start infrastructure
make bootstrap

# Initialize the database schema
make db-init

# Configure environment
cp .env.example .env
# Edit .env with your API keys (Anthropic, OpenAI, Gemini)

# Start the backend API (default: http://localhost:8000)
make api

# In another terminal, start the frontend (default: http://localhost:3000)
make web
```

### Run a Demo

```bash
# Seeds a sample project, queries death modes, shows end-to-end flow
make demo
```

### Available Commands

| Command | Description |
|---------|-------------|
| `make bootstrap` | Install all dependencies, start PostgreSQL + Redis |
| `make db-init` | Run Alembic migrations to initialize the database |
| `make api` | Start the FastAPI backend on `:8000` |
| `make web` | Start the Next.js frontend on `:3000` |
| `make extractor` | Run the causal-chain extraction worker |
| `make clusterer` | Run the HDBSCAN clustering worker |
| `make seed-public` | Seed the database with public post-mortem data |
| `make demo` | Run a full end-to-end demo |

---

## Architecture

```
ping77/
├── apps/
│   ├── api/                     # FastAPI backend (Python 3.11)
│   │   ├── api/
│   │   │   ├── main.py          # All API endpoints
│   │   │   ├── models.py        # SQLAlchemy ORM (4 tables)
│   │   │   ├── schemas.py       # Pydantic v2 request/response models
│   │   │   ├── shapley.py       # Shapley-value computation (mock)
│   │   │   ├── database.py      # DB connection & session management
│   │   │   └── config.py        # Environment-based configuration
│   │   └── alembic/             # Database migrations
│   │
│   └── web/                     # Next.js 14 frontend (TypeScript)
│       └── src/app/
│           ├── page.tsx          # Landing page (CRT terminal aesthetic)
│           ├── upload/           # Upload a dead project
│           ├── query/            # Query death modes
│           └── projects/         # Browse the graveyard
│
├── packages/
│   ├── extractor/               # LLM extraction pipeline
│   │   ├── extractor/
│   │   │   ├── extractor.py     # Causal-chain extraction (Anthropic API)
│   │   │   ├── clusterer.py     # Death mode clustering (HDBSCAN)
│   │   │   ├── cli.py           # CLI tool
│   │   │   ├── types.py         # CausalChain / DeathMode types
│   │   │   └── prompts/         # YAML prompt templates
│   │   └── samples/             # 5 sample failure narratives
│   │
│   └── shared/                  # Shared types and utilities
│
├── contracts/                   # LMSR market contracts (v0.2 roadmap)
├── docs/                        # 4 technical research articles
├── infra/                       # Deployment configurations
├── docker-compose.yml           # PostgreSQL 15 + Redis 7
├── Makefile                     # All project commands
└── .env.example                 # Environment variable template
```

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   DEAD REPO     │     │      LLM        │     │   DEATH MODE    │
│   pitch deck    │────>│    extractor     │────>│     tokens      │
│   post-mortem   │     │  (Claude API)    │     │  (clustered)    │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         v
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  CONTRIBUTOR    │<────│    MARKET        │<────│  NEW FOUNDER    │
│  earns fees     │     │  prices TTL      │     │  queries risk   │
│  via Shapley    │     │  survival curves │     │  gets report    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Database Schema

Four core tables:

| Table | Description |
|-------|-------------|
| `contributors` | Users who upload failure projects. Tracks reputation score and total payouts. |
| `projects` | Dead projects with name, description, narrative, stage, vertical, and business model. |
| `causal_chains` | Extracted `(trigger, mechanism, outcome, time)` tuples with source span citations and embeddings. |
| `death_modes` | Clustered failure patterns with label, frequency, median TTL, confidence, and centroid vectors. |

---

## API Endpoints

The FastAPI backend exposes the following endpoints (all with auto-generated OpenAPI docs at `/docs`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects` | Upload a failed project |
| `GET` | `/projects` | List all projects (paginated) |
| `GET` | `/projects/{id}` | Get a single project by ID |
| `GET` | `/projects/{id}/chains` | Get causal chains for a project |
| `POST` | `/query` | Query top-k death modes by project characteristics |
| `GET` | `/death-modes` | List all death modes |
| `GET` | `/death-modes/{id}/shapley` | Get Shapley attribution shares |
| `GET` | `/health` | Health check |

### Example: Upload a Project

```bash
curl -X POST http://localhost:8000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Customer Support for Pet Stores",
    "description": "Replaced human support with $200/mo AI bot for small pet stores",
    "narrative": "We spent 14 months building AI customer support...",
    "stage": "pre-seed",
    "vertical": "AI+SMB",
    "model": "SaaS"
  }'
```

### Example: Query Death Modes

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "vertical": "AI+SMB",
    "model": "SaaS",
    "stage": "pre-seed",
    "top_k": 3
  }'
```

**Sample response:**
```json
{
  "death_modes": [
    {
      "label": "Small-business willingness-to-pay collapses",
      "probability": 0.68,
      "median_ttl_months": 11,
      "frequency": 237
    },
    {
      "label": "Foundation model upgrade eats the moat overnight",
      "probability": 0.23,
      "median_ttl_months": 6,
      "frequency": 82
    },
    {
      "label": "Founder burns out before product-market fit",
      "probability": 0.15,
      "median_ttl_months": 14,
      "frequency": 54
    }
  ]
}
```

---

## Extraction Pipeline

The extraction pipeline is the protocol's core intelligence layer. It converts unstructured failure narratives into structured, market-ready signals.

### Stage 1: Causal-Chain Extraction

An LLM (Claude Sonnet) analyzes each failure narrative using a fixed schema and extracts `(trigger, mechanism, outcome, time)` tuples. Every chain must carry a character-level citation back to the source text — attributions without evidence are dropped.

```bash
# Extract causal chains from a sample narrative
cd packages/extractor
python -m extractor.cli extract --input samples/01_ai_customer_support.txt
```

### Stage 2: Embedding-Space Clustering

The `mechanism` field of every causal chain is embedded using `all-mpnet-base-v2` (local, no API calls), then clustered via HDBSCAN. Each stable cluster becomes a **death mode**.

```bash
# Extract + cluster in one pass
python -m extractor.cli extract --input samples/01_ai_customer_support.txt --cluster
```

### Anti-Hallucination Measures

1. **Citation constraint** — chains must cite source spans
2. **Multi-model cross-validation** — Claude + GPT + Gemini independently process the same story; only agreed-upon chains are kept *(v0.1 roadmap)*
3. **Reverse predictive testing** — death modes are tested against held-out data; below-baseline patterns are flagged as overfit hallucinations

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend | FastAPI + SQLAlchemy 2.0 + Alembic | API server, ORM, migrations |
| Validation | Pydantic v2 | Request/response boundary validation |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS | Terminal-aesthetic web interface |
| LLM | Anthropic SDK (Claude Sonnet) | Causal-chain extraction |
| Embeddings | sentence-transformers (`all-mpnet-base-v2`) | Local embedding generation |
| Clustering | HDBSCAN | Density-based death mode clustering |
| Database | PostgreSQL 15+ | Persistent storage |
| Cache | Redis 7+ | Market quote caching |
| Python Packages | uv | Fast Python dependency management |
| Node Packages | pnpm | Monorepo-aware Node package management |
| Infrastructure | Docker Compose | Local development environment |

---

## Research Notes

The `docs/` directory contains four technical articles covering the protocol's design decisions:

| # | Title | Topic |
|---|-------|-------|
| 001 | [Extracting Structured Death Modes from Failure Narratives](docs/001-extracting-death-modes.md) | Two-stage extraction pipeline design |
| 002 | [Continuous-Time Pricing for "How Many Months Until It Dies"](docs/002-continuous-time-pricing.md) | LMSR market mechanics + survival curves |
| 003 | [Making Contributors Tell the Truth](docs/003-honest-incentives.md) | Shapley attribution + token-free incentives |
| 004 | [Self-Host Guide](docs/004-self-host-guide.md) | Deployment from zero to first death market |

---

## System Requirements

| Requirement | Minimum |
|-------------|---------|
| OS | Linux (Ubuntu 22.04+), macOS, or Windows (WSL2) |
| CPU / RAM | 4 vCPU / 8 GB |
| Disk | 50 GB SSD |
| Python | 3.11+ |
| Node.js | 20+ |
| PostgreSQL | 15+ |
| Redis | 7+ |
| Docker | 20+ (for local infrastructure) |

---

## Roadmap

- [x] **v0.0.1** — Reference implementation: extraction pipeline, API, frontend, database
- [ ] **v0.1.0** — Multi-model cross-validation (Claude + GPT + Gemini)
- [ ] **v0.2.0** — LMSR market-maker contracts (Solidity on Base/Arbitrum)
- [ ] **v0.3.0** — Real Shapley-value fee distribution replacing mock
- [ ] **v0.4.0** — Cross-instance federation protocol
- [ ] **v0.5.0** — Settlement oracle (objective signals + optimistic arbitration)
- [ ] **v1.0.0** — Production-ready deployment with full market layer

---

## Known Pitfalls

Any honest protocol puts its problems on the table first:

| Issue | Mitigation |
|-------|------------|
| **Privacy** — failures involve unnamed cofounders, customers, investors | LLM extracts patterns only, not raw stories. Selective disclosure. |
| **Fraud** — people will fabricate failures to farm payouts | On-chain anchoring of GitHub commits, domain registration, payments. Temporal consistency checks. |
| **Manipulation** — founders can bet on their own delayed death | Actually fine — it sparks survival instinct. Society wins net. |
| **Cold Start** — no data, no liquidity in early days | Seed with public post-mortems (CB Insights, Failory, HN, Indie Hackers). |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

Areas that need help:
- Extraction quality improvements
- Multi-model cross-validation
- LMSR market contracts (Solidity)
- Real Shapley computation
- Frontend data visualizations
- Test coverage

---

## Disclaimer

This is an open-source thought experiment and reference implementation. If you see any token bearing this project's name, it is a community memorial meme — it represents no protocol equity, distributes no revenue, and may go to zero at any moment. **Do not treat it as an investment.** The protocol itself is forever free, open-source, and runs without any token.

---

## License

[MIT](./LICENSE) — No rights reserved. Built for those who failed.
