"""CLI for running the clustering worker independently."""

import click


@click.command()
def main() -> None:
    """Run the death mode clustering worker (placeholder).

    In production, this periodically pulls all unassigned causal chains from the
    database, runs HDBSCAN clustering, and writes new or updated death modes back.
    """
    click.echo(">> Clustering worker started")
    click.echo(">> Runs every 6 hours in production. This is a placeholder.")
    click.echo(">> Press Ctrl+C to stop.")
    try:
        import time
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        click.echo("\n>> Clustering worker stopped.")


if __name__ == "__main__":
    main()
