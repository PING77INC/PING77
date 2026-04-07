.PHONY: bootstrap db-init extractor clusterer api web seed-public demo

# Install all dependencies (Python + Node)
bootstrap:
	docker compose up -d postgres redis
	cd apps/api && uv sync
	cd packages/extractor && uv sync
	pnpm install
	@echo ">> Bootstrap complete. Copy .env.example to .env and fill in your keys."

# Initialize database schema via Alembic
db-init:
	docker compose up -d postgres
	cd apps/api && uv run alembic upgrade head
	@echo ">> Database initialized."

# Run causal-chain extraction worker
extractor:
	cd packages/extractor && uv run python -m extractor.cli watch

# Run embedding clustering worker
clusterer:
	cd packages/extractor && uv run python -m extractor.cluster_cli

# Start FastAPI backend
api:
	cd apps/api && uv run uvicorn api.main:app --host 0.0.0.0 --port $${API_PORT:-8000} --reload

# Start Next.js frontend
web:
	cd apps/web && pnpm dev

# Seed database with public post-mortem data
seed-public:
	cd packages/extractor && uv run python -m extractor.seed

# Demo: run API + seed a sample project + query death modes
demo:
	@echo ">> Starting services..."
	$(MAKE) db-init
	cd apps/api && uv run uvicorn api.main:app --host 0.0.0.0 --port 8000 &
	@sleep 3
	@echo ">> Seeding a sample project..."
	curl -s -X POST http://localhost:8000/projects \
		-H "Content-Type: application/json" \
		-d '{"name":"Demo Failed Startup","description":"AI customer support for pet stores","narrative":"We spent 18 months building AI customer support for pet stores. The sales cycle was too long and small businesses would not pay enough. We ran out of cash.","stage":"pre-seed","vertical":"AI+SMB","model":"SaaS"}' | python -m json.tool
	@echo ""
	@echo ">> Querying death modes..."
	curl -s -X POST http://localhost:8000/query \
		-H "Content-Type: application/json" \
		-d '{"vertical":"AI+SMB","model":"SaaS","stage":"pre-seed"}' | python -m json.tool
	@echo ""
	@echo ">> Demo complete. Visit http://localhost:3000 for the frontend."
