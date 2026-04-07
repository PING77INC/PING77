"""PING77 FastAPI application."""

import uuid

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from api.database import get_db
from api.models import CausalChain, Contributor, DeathMode, Project
from api.schemas import (
    CausalChainResponse,
    ContributorResponse,
    DeathModeResponse,
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    QueryDeathMode,
    QueryRequest,
    QueryResponse,
    ShapleyShare,
)
from api.shapley import compute_shapley_shares

app = FastAPI(
    title="PING77",
    description="A Risk Market for Dead Projects — API",
    version="0.0.1-alpha",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Projects ---


@app.post("/projects", response_model=ProjectResponse, status_code=201, tags=["projects"])
def create_project(body: ProjectCreate, db: Session = Depends(get_db)) -> Project:
    """Upload a failed project to the protocol."""
    contributor: Contributor | None = None
    if body.contributor_name:
        if body.contributor_email:
            contributor = (
                db.query(Contributor)
                .filter(Contributor.email == body.contributor_email)
                .first()
            )
        if not contributor:
            contributor = Contributor(
                name=body.contributor_name,
                email=body.contributor_email,
            )
            db.add(contributor)
            db.flush()

    project = Project(
        name=body.name,
        description=body.description,
        narrative=body.narrative,
        stage=body.stage,
        vertical=body.vertical,
        model=body.model,
        status="pending",
        contributor_id=contributor.id if contributor else None,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/projects", response_model=ProjectListResponse, tags=["projects"])
def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> dict:
    """List all uploaded projects with pagination."""
    total = db.query(Project).count()
    items = (
        db.query(Project)
        .order_by(Project.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return {"items": items, "total": total}


@app.get("/projects/{project_id}", response_model=ProjectResponse, tags=["projects"])
def get_project(project_id: uuid.UUID, db: Session = Depends(get_db)) -> Project:
    """Get a single project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.get(
    "/projects/{project_id}/chains",
    response_model=list[CausalChainResponse],
    tags=["projects"],
)
def get_project_chains(
    project_id: uuid.UUID, db: Session = Depends(get_db)
) -> list[CausalChain]:
    """Get causal chains extracted from a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return (
        db.query(CausalChain)
        .filter(CausalChain.project_id == project_id)
        .all()
    )


# --- Death Modes ---


@app.get("/death-modes", response_model=list[DeathModeResponse], tags=["death-modes"])
def list_death_modes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[DeathMode]:
    """List all death modes."""
    return (
        db.query(DeathMode)
        .order_by(DeathMode.frequency.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# --- Query ---


MOCK_DEATH_MODES: list[QueryDeathMode] = [
    QueryDeathMode(
        id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
        label="Small-business willingness-to-pay collapses",
        description=(
            "Target SMB customers consistently churn or refuse to pay once the free "
            "trial ends. The unit economics never close because acquisition cost exceeds LTV."
        ),
        probability=0.68,
        median_ttl_months=11,
        frequency=237,
    ),
    QueryDeathMode(
        id=uuid.UUID("00000000-0000-0000-0000-000000000002"),
        label="Foundation model upgrade eats the moat overnight",
        description=(
            "A major LLM provider ships a feature that replicates the startup's core value "
            "proposition as a built-in capability, making the product redundant."
        ),
        probability=0.23,
        median_ttl_months=6,
        frequency=82,
    ),
    QueryDeathMode(
        id=uuid.UUID("00000000-0000-0000-0000-000000000003"),
        label="Founder burns out before product-market fit",
        description=(
            "Solo founder or small team exhausts personal runway and motivation before "
            "finding repeatable demand. No external funding bridge available."
        ),
        probability=0.15,
        median_ttl_months=14,
        frequency=54,
    ),
    QueryDeathMode(
        id=uuid.UUID("00000000-0000-0000-0000-000000000004"),
        label="Regulatory compliance kills unit economics",
        description=(
            "Industry-specific compliance requirements (HIPAA, SOC2, PCI) consume engineering "
            "bandwidth and push costs above what the market will pay."
        ),
        probability=0.11,
        median_ttl_months=9,
        frequency=41,
    ),
    QueryDeathMode(
        id=uuid.UUID("00000000-0000-0000-0000-000000000005"),
        label="Co-founder conflict leads to paralysis",
        description=(
            "Disagreements on product direction or equity split create decision paralysis. "
            "The company stalls while competitors move."
        ),
        probability=0.08,
        median_ttl_months=16,
        frequency=29,
    ),
]


@app.post("/query", response_model=QueryResponse, tags=["query"])
def query_death_modes(body: QueryRequest, db: Session = Depends(get_db)) -> QueryResponse:
    """Query top-k death modes for given project characteristics.

    Currently returns mock data. Will be connected to the real pattern library
    once the extraction pipeline populates enough death modes.
    """
    db_modes = db.query(DeathMode).order_by(DeathMode.frequency.desc()).limit(body.top_k).all()

    if db_modes:
        death_modes = [
            QueryDeathMode(
                id=m.id,
                label=m.label,
                description=m.description,
                probability=min(m.confidence, 1.0),
                median_ttl_months=m.median_ttl_months,
                frequency=m.frequency,
            )
            for m in db_modes
        ]
    else:
        death_modes = MOCK_DEATH_MODES[: body.top_k]

    total = db.query(Project).count()
    return QueryResponse(
        query=body,
        death_modes=death_modes,
        total_projects_analyzed=total if total > 0 else 373,
    )


# --- Shapley (mock) ---


@app.get(
    "/death-modes/{death_mode_id}/shapley",
    response_model=list[ShapleyShare],
    tags=["shapley"],
)
def get_shapley_shares(
    death_mode_id: uuid.UUID, db: Session = Depends(get_db)
) -> list[ShapleyShare]:
    """Get Shapley-value attribution shares for a death mode.

    Returns mock equal-split data. The real implementation will compute
    marginal contribution based on causal chain overlap.
    """
    chains = (
        db.query(CausalChain)
        .filter(CausalChain.death_mode_id == death_mode_id)
        .all()
    )
    if not chains:
        return []

    project_ids = {c.project_id for c in chains}
    projects = db.query(Project).filter(Project.id.in_(project_ids)).all()

    contributor_ids: list[uuid.UUID] = []
    contributor_names: list[str] = []
    for p in projects:
        if p.contributor_id and p.contributor:
            contributor_ids.append(p.contributor_id)
            contributor_names.append(p.contributor.name)

    return compute_shapley_shares(
        death_mode_id=death_mode_id,
        fee_amount_usd=10.0,
        contributor_ids=contributor_ids,
        contributor_names=contributor_names,
    )


# --- Health ---


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "alive", "version": "0.0.1-alpha"}
