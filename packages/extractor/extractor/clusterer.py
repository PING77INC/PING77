"""Death mode clustering via sentence embeddings + HDBSCAN."""

import numpy as np
from numpy.typing import NDArray

from extractor.types import CausalChain, DeathMode

EMBEDDING_MODEL = "all-mpnet-base-v2"


def _get_embeddings(texts: list[str]) -> NDArray[np.float32]:
    """Compute sentence embeddings for a list of texts.

    Args:
        texts: List of strings to embed.

    Returns:
        Numpy array of shape (len(texts), embedding_dim).
    """
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings: NDArray[np.float32] = model.encode(texts, show_progress_bar=False)
    return embeddings


def cluster_to_death_modes(chains: list[CausalChain]) -> list[DeathMode]:
    """Cluster causal chains into death modes using HDBSCAN.

    Args:
        chains: List of CausalChain objects to cluster.

    Returns:
        A list of DeathMode objects, one per cluster.
    """
    if len(chains) < 2:
        if chains:
            return [
                DeathMode(
                    label=chains[0].mechanism[:80],
                    description=f"{chains[0].trigger} -> {chains[0].mechanism} -> {chains[0].outcome}",
                    frequency=1,
                    median_ttl_months=float(chains[0].time_months) if chains[0].time_months else None,
                    confidence=chains[0].confidence,
                    chain_indices=[0],
                )
            ]
        return []

    mechanisms = [c.mechanism for c in chains]
    embeddings = _get_embeddings(mechanisms)

    import hdbscan

    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=max(2, len(chains) // 10),
        min_samples=1,
        metric="cosine",
    )
    labels = clusterer.fit_predict(embeddings)

    unique_labels = set(labels)
    death_modes: list[DeathMode] = []

    for label_id in sorted(unique_labels):
        if label_id == -1:
            continue

        indices = [i for i, l in enumerate(labels) if l == label_id]
        cluster_chains = [chains[i] for i in indices]

        ttl_values = [c.time_months for c in cluster_chains if c.time_months is not None]
        median_ttl = float(np.median(ttl_values)) if ttl_values else None

        representative = max(cluster_chains, key=lambda c: c.confidence)

        death_modes.append(
            DeathMode(
                label=representative.mechanism[:80],
                description=f"{representative.trigger} -> {representative.mechanism} -> {representative.outcome}",
                frequency=len(indices),
                median_ttl_months=median_ttl,
                confidence=float(np.mean([c.confidence for c in cluster_chains])),
                chain_indices=indices,
            )
        )

    noise_indices = [i for i, l in enumerate(labels) if l == -1]
    for idx in noise_indices:
        c = chains[idx]
        death_modes.append(
            DeathMode(
                label=c.mechanism[:80],
                description=f"{c.trigger} -> {c.mechanism} -> {c.outcome}",
                frequency=1,
                median_ttl_months=float(c.time_months) if c.time_months else None,
                confidence=c.confidence * 0.5,
                chain_indices=[idx],
            )
        )

    return sorted(death_modes, key=lambda m: m.frequency, reverse=True)
