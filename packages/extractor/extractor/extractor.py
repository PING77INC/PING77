"""Causal-chain extraction from failure narratives using Anthropic API."""

import json
import os
import re
from pathlib import Path

import yaml
from anthropic import Anthropic

from extractor.types import CausalChain

PROMPTS_DIR = Path(__file__).parent / "prompts"
DEFAULT_MODEL = "claude-sonnet-4-6-20250514"


def _load_prompt() -> dict[str, str]:
    """Load the causal chain extraction prompt from YAML."""
    prompt_path = PROMPTS_DIR / "causal_chain.yaml"
    with open(prompt_path) as f:
        return yaml.safe_load(f)


def extract_causal_chains(
    text: str,
    api_key: str | None = None,
    model: str = DEFAULT_MODEL,
) -> list[CausalChain]:
    """Extract structured causal chains from a failure narrative.

    Args:
        text: The failure narrative text to analyze.
        api_key: Anthropic API key. Falls back to ANTHROPIC_API_KEY env var.
        model: The Claude model to use for extraction.

    Returns:
        A list of CausalChain objects extracted from the narrative.
    """
    key = api_key or os.getenv("ANTHROPIC_API_KEY", "")
    if not key:
        raise ValueError(
            "ANTHROPIC_API_KEY not set. Provide api_key argument or set the environment variable."
        )

    client = Anthropic(api_key=key)
    prompt = _load_prompt()

    user_message = prompt["user"].replace("{narrative}", text)

    response = client.messages.create(
        model=model,
        max_tokens=4096,
        system=prompt["system"],
        messages=[{"role": "user", "content": user_message}],
    )

    raw_text = response.content[0].text
    json_match = re.search(r"\[.*\]", raw_text, re.DOTALL)
    if not json_match:
        return []

    raw_chains = json.loads(json_match.group())

    chains: list[CausalChain] = []
    for item in raw_chains:
        chains.append(
            CausalChain(
                trigger=item.get("trigger", ""),
                mechanism=item.get("mechanism", ""),
                outcome=item.get("outcome", ""),
                time_months=item.get("time_months"),
                source_span_start=item.get("source_span_start"),
                source_span_end=item.get("source_span_end"),
                confidence=item.get("confidence", 0.5),
            )
        )

    return chains
