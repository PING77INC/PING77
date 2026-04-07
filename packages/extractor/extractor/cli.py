"""CLI for the PING77 extraction pipeline.

Usage:
    python -m extractor.cli --input sample.txt
    python -m extractor.cli --input sample.txt --cluster
"""

import json
import sys
from pathlib import Path

import click
from dotenv import load_dotenv

from extractor.extractor import extract_causal_chains
from extractor.types import CausalChain

load_dotenv()


@click.group()
def cli() -> None:
    """PING77 extraction pipeline CLI."""
    pass


@cli.command()
@click.option("--input", "input_path", required=True, type=click.Path(exists=True))
@click.option("--output", "output_path", type=click.Path(), default=None)
@click.option("--cluster", is_flag=True, help="Also run clustering on extracted chains")
@click.option("--model", default="claude-sonnet-4-6-20250514", help="Claude model to use")
def extract(
    input_path: str,
    output_path: str | None,
    cluster: bool,
    model: str,
) -> None:
    """Extract causal chains from a failure narrative file."""
    text = Path(input_path).read_text(encoding="utf-8")
    click.echo(f">> Reading {input_path} ({len(text)} chars)")

    click.echo(">> Extracting causal chains...")
    chains = extract_causal_chains(text, model=model)
    click.echo(f">> Found {len(chains)} causal chain(s)")

    for i, chain in enumerate(chains):
        click.echo(f"\n  [{i+1}] {chain.trigger}")
        click.echo(f"      -> {chain.mechanism}")
        click.echo(f"      -> {chain.outcome}")
        if chain.time_months:
            click.echo(f"      TTL: {chain.time_months}mo")

    if cluster and len(chains) >= 2:
        click.echo("\n>> Clustering into death modes...")
        from extractor.clusterer import cluster_to_death_modes

        modes = cluster_to_death_modes(chains)
        click.echo(f">> Found {len(modes)} death mode(s)")
        for i, mode in enumerate(modes):
            click.echo(f"\n  [MODE {i+1}] {mode.label}")
            click.echo(f"      frequency={mode.frequency}, TTL={mode.median_ttl_months}mo")

    if output_path:
        output = {
            "chains": [c.model_dump() for c in chains],
        }
        if cluster and len(chains) >= 2:
            from extractor.clusterer import cluster_to_death_modes

            modes = cluster_to_death_modes(chains)
            output["death_modes"] = [m.model_dump() for m in modes]

        Path(output_path).write_text(json.dumps(output, indent=2), encoding="utf-8")
        click.echo(f"\n>> Output written to {output_path}")


@cli.command()
def watch() -> None:
    """Watch for new projects and extract causal chains (placeholder)."""
    click.echo(">> Extraction worker started (watching for new projects...)")
    click.echo(">> This is a placeholder. In production, this polls the database")
    click.echo("   for projects with status='pending' and processes them.")
    click.echo(">> Press Ctrl+C to stop.")
    try:
        import time
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        click.echo("\n>> Worker stopped.")


if __name__ == "__main__":
    cli()
