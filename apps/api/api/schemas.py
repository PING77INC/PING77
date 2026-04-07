"""Pydantic v2 schemas for API request/response validation."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# --- Contributors ---

class ContributorBase(BaseModel):
    name: str
    email: str | None = None


class ContributorCreate(ContributorBase):
    pass


class ContributorResponse(ContributorBase):
    id: uuid.UUID
    reputation_score: float
    total_payout: float
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Projects ---

class ProjectCreate(BaseModel):
    """Request body for uploading a failed project."""

    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    narrative: str = Field(..., min_length=1)
    stage: str | None = Field(None, max_length=50)
    vertical: str | None = Field(None, max_length=100)
    model: str | None = Field(None, max_length=100)
    contributor_name: str | None = None
    contributor_email: str | None = None


class ProjectResponse(BaseModel):
    """Response body for a project."""

    id: uuid.UUID
    name: str
    description: str
    narrative: str
    stage: str | None
    vertical: str | None
    model: str | None
    status: str
    contributor_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    """Paginated list of projects."""

    items: list[ProjectResponse]
    total: int


# --- Causal Chains ---

class CausalChainResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    trigger: str
    mechanism: str
    outcome: str
    time_months: int | None
    death_mode_id: uuid.UUID | None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Death Modes ---

class DeathModeResponse(BaseModel):
    """A clustered failure pattern."""

    id: uuid.UUID
    label: str
    description: str
    frequency: int
    median_ttl_months: float | None
    confidence: float
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Query ---

class QueryRequest(BaseModel):
    """Request body for querying death modes by project characteristics."""

    vertical: str | None = None
    model: str | None = None
    stage: str | None = None
    description: str | None = None
    top_k: int = Field(default=5, ge=1, le=20)


class QueryDeathMode(BaseModel):
    """A death mode result with match score."""

    id: uuid.UUID
    label: str
    description: str
    probability: float = Field(..., ge=0.0, le=1.0)
    median_ttl_months: float | None
    frequency: int


class QueryResponse(BaseModel):
    """Response body for a death mode query."""

    query: QueryRequest
    death_modes: list[QueryDeathMode]
    total_projects_analyzed: int


# --- Shapley (mock) ---

class ShapleyShare(BaseModel):
    """A contributor's Shapley-value share for a death mode."""

    contributor_id: uuid.UUID
    contributor_name: str
    death_mode_id: uuid.UUID
    shapley_value: float
    payout_usd: float
