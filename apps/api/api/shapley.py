"""Mock Shapley-value computation module.

This module provides a placeholder implementation of Shapley-value attribution
for contributor payouts. The interface is correct; the implementation returns
mock data until the real computation is built.
"""

import uuid

from api.schemas import ShapleyShare


def compute_shapley_shares(
    death_mode_id: uuid.UUID,
    fee_amount_usd: float,
    contributor_ids: list[uuid.UUID],
    contributor_names: list[str],
) -> list[ShapleyShare]:
    """Compute Shapley-value shares for a death mode's contributors.

    Args:
        death_mode_id: The death mode being attributed.
        fee_amount_usd: Total fee to distribute.
        contributor_ids: List of contributor UUIDs.
        contributor_names: List of contributor display names.

    Returns:
        A list of ShapleyShare objects with proportional mock payouts.
    """
    if not contributor_ids:
        return []

    n = len(contributor_ids)
    equal_share = 1.0 / n
    equal_payout = fee_amount_usd / n

    return [
        ShapleyShare(
            contributor_id=cid,
            contributor_name=cname,
            death_mode_id=death_mode_id,
            shapley_value=round(equal_share, 6),
            payout_usd=round(equal_payout, 2),
        )
        for cid, cname in zip(contributor_ids, contributor_names)
    ]
