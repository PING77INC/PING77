"""Seed script: load sample failure stories into the database.

Usage:
    python -m extractor.seed
"""

import click


@click.command()
def main() -> None:
    """Seed the database with public post-mortem data (placeholder).

    In production, this pulls from:
    - CB Insights startup failure database
    - Failory public cases
    - Hacker News "Show HN: My failed startup" tag
    - Indie Hackers failure threads
    """
    click.echo(">> Seed script started")
    click.echo(">> This is a placeholder for the public data seeding pipeline.")
    click.echo(">> In production, this would scrape and process 300-500 public post-mortems.")
    click.echo(">> Done (no-op).")


if __name__ == "__main__":
    main()
