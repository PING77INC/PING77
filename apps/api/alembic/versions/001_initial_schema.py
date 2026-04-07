"""Initial schema: projects, causal_chains, death_modes, contributors.

Revision ID: 001
Revises: None
Create Date: 2026-04-08
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, ARRAY

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "contributors",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=True, unique=True),
        sa.Column("reputation_score", sa.Float, server_default="0.0"),
        sa.Column("total_payout", sa.Float, server_default="0.0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "death_modes",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("label", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("frequency", sa.Integer, server_default="0"),
        sa.Column("median_ttl_months", sa.Float, nullable=True),
        sa.Column("confidence", sa.Float, server_default="0.0"),
        sa.Column("cluster_id", sa.Integer, nullable=True),
        sa.Column("centroid", ARRAY(sa.Float), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "projects",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("narrative", sa.Text, nullable=False),
        sa.Column("stage", sa.String(50), nullable=True),
        sa.Column("vertical", sa.String(100), nullable=True),
        sa.Column("model", sa.String(100), nullable=True),
        sa.Column("status", sa.String(50), server_default="pending"),
        sa.Column(
            "contributor_id",
            UUID(as_uuid=True),
            sa.ForeignKey("contributors.id"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "causal_chains",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "project_id",
            UUID(as_uuid=True),
            sa.ForeignKey("projects.id"),
            nullable=False,
        ),
        sa.Column("trigger", sa.Text, nullable=False),
        sa.Column("mechanism", sa.Text, nullable=False),
        sa.Column("outcome", sa.Text, nullable=False),
        sa.Column("time_months", sa.Integer, nullable=True),
        sa.Column("source_span_start", sa.Integer, nullable=True),
        sa.Column("source_span_end", sa.Integer, nullable=True),
        sa.Column("embedding", ARRAY(sa.Float), nullable=True),
        sa.Column(
            "death_mode_id",
            UUID(as_uuid=True),
            sa.ForeignKey("death_modes.id"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )


def downgrade() -> None:
    op.drop_table("causal_chains")
    op.drop_table("projects")
    op.drop_table("death_modes")
    op.drop_table("contributors")
