"""Shared types for the extraction pipeline."""

from pydantic import BaseModel, Field


class CausalChain(BaseModel):
    """A structured causal chain extracted from a failure narrative."""

    trigger: str = Field(..., description="The initiating event or decision")
    mechanism: str = Field(..., description="The process by which the trigger led to failure")
    outcome: str = Field(..., description="The final result (e.g., 'cash exhausted', 'team quit')")
    time_months: int | None = Field(None, description="Time from trigger to outcome in months")
    source_span_start: int | None = Field(None, description="Character offset start in source text")
    source_span_end: int | None = Field(None, description="Character offset end in source text")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class DeathMode(BaseModel):
    """A clustered failure pattern derived from multiple causal chains."""

    label: str = Field(..., description="Short label for the death mode")
    description: str = Field(..., description="Detailed description of the failure pattern")
    frequency: int = Field(default=1, description="Number of contributing causal chains")
    median_ttl_months: float | None = Field(None, description="Median time-to-death in months")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    chain_indices: list[int] = Field(default_factory=list, description="Indices of source chains")
