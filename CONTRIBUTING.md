# Contributing to PING77

PING77 is an open-source protocol. Contributions are welcome.

## Development Setup

```bash
# Clone and bootstrap
git clone https://github.com/PING77INC/PING77.git
cd ping77
make bootstrap
cp .env.example .env
# Edit .env with your API keys

# Start infrastructure
docker compose up -d

# Initialize database
make db-init

# Start services (in separate terminals)
make api      # FastAPI on :8000
make web      # Next.js on :3000
```

## Project Structure

```
apps/api/           Python FastAPI backend
apps/web/           Next.js 14 frontend
packages/extractor/ LLM extraction + clustering pipeline
packages/shared/    Shared types
contracts/          Market contracts (not yet implemented)
docs/               Technical articles
```

## Code Style

### Python
- Python 3.11+ with full type hints
- Pydantic v2 for boundary validation
- Google-style docstrings
- Format with `ruff format`, lint with `ruff check`

### TypeScript
- Strict mode, no `any`
- Format with Prettier

### General
- All user-facing strings in English
- Match the tone of the landing page: direct, technical, no hype
- Commit messages should be concise and descriptive

## Making Changes

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Ensure linting passes
5. Submit a pull request with a clear description

## Areas That Need Help

- **Extraction pipeline**: improve causal chain quality, add multi-model cross-validation
- **Clustering**: tune HDBSCAN parameters, add death mode merging logic
- **Market layer**: implement LMSR contracts in Solidity (see `contracts/README.md`)
- **Shapley computation**: replace mock with real marginal contribution calculation
- **Frontend**: add data visualizations, improve mobile responsiveness
- **Testing**: unit tests for API, integration tests for pipeline

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
