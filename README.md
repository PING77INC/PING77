# PING77

> A Risk Market for Dead Projects

PING77 is an open-source protocol that turns failed startup data into structured risk signals. Contributors upload dead projects, LLMs extract "death modes," and a prediction market prices how long new projects will survive.

**This is a reference implementation and thought experiment.** There is no hosted version, no token, no airdrop. Fork it, read it, deploy it yourself.

## Quick Start

```bash
git clone https://github.com/PING77INC/PING77.git
cd ping77
make bootstrap     # install python + node deps, start postgres & redis
make db-init       # initialize database schema
cp .env.example .env
# Edit .env with your API keys
make api           # start backend on :8000
make web           # start frontend on :3000
```

## Architecture

```
ping77/
├── apps/
│   ├── api/              # FastAPI backend
│   └── web/              # Next.js 14 frontend
├── packages/
│   ├── extractor/        # LLM extraction + clustering pipeline
│   └── shared/           # Shared types and utilities
├── contracts/            # Market-maker contracts (v0.2 roadmap)
├── infra/                # Deployment configs
├── docs/                 # Technical articles
├── docker-compose.yml    # PostgreSQL 15 + Redis 7
└── Makefile              # bootstrap / db-init / api / web / extractor
```

### Data Flow

```
Dead Project → LLM Extractor → Causal Chains → HDBSCAN Clustering → Death Modes
                                                                         ↓
New Founder ← Query Results ← API ← Pattern Library ← Death Mode Tokens
```

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Backend    | FastAPI + SQLAlchemy 2.0 + Alembic + Pydantic v2 |
| Frontend   | Next.js 14 + TypeScript + Tailwind CSS        |
| LLM        | Anthropic SDK (Claude Sonnet)                 |
| Embeddings | sentence-transformers (all-mpnet-base-v2)     |
| Clustering | HDBSCAN                                       |
| Database   | PostgreSQL 15+                                |
| Cache      | Redis 7+                                      |
| Packages   | pnpm (Node) + uv (Python)                     |

## Roadmap

- [x] v0.0.1 — Reference implementation (extraction pipeline, API, frontend)
- [ ] v0.1.0 — Multi-model cross-validation (Claude + GPT + Gemini)
- [ ] v0.2.0 — LMSR market-maker contracts (Solidity)
- [ ] v0.3.0 — Shapley-value fee distribution
- [ ] v0.4.0 — Cross-instance federation protocol

## License

MIT. See [LICENSE](./LICENSE).
