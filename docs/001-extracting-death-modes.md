# Extracting Structured Death Modes from Failure Narratives

> // 001 · PROTOCOL DESIGN · 2026.04

Failure stories are inherently bad data. They're long, emotional, and full of self-justification—founders subconsciously put "the market wasn't ready" ahead of "I never found the right customer." Dump these stories into a vector database for similarity search and you'll get a pile of synonymous restatements of "startups are hard." The first-principles question for PING77 is: how do you distill this narrative garbage into structured signals a market can price?

## A Two-Stage Extraction Pipeline

We use a two-stage pipeline. **Stage one** is causal-chain extraction: an LLM uses a fixed schema to break each story into `(trigger, mechanism, outcome, time)` tuples. For example, "we burned 18 months on enterprise SaaS and died because the sales cycle was too long" becomes `(enterprise sales, decision cycles > 6mo, cash exhausted, 18mo)`. This step compresses the narrative into a comparable causal skeleton.

**Stage two** is embedding-space clustering. We embed the `mechanism` field of every tuple into a 1536-dimensional space and run HDBSCAN density clustering. Each stable cluster core becomes a "death mode." A pattern is only minted as a tradable token if it's supported by at least N independent stories and its semantic distance variance falls below a threshold. This prevents the LLM from freelancing "novel ways to die."

## Fighting the LLM's Hallucination Tendency

LLMs have a dangerous tendency in attribution work: they love generating explanations that *sound* profound. Ask one to analyze a failure story and it'll invent three layers of psychological motivation and five structural market factors—even if none of that is in the source. We counter this with three mechanisms:

1. **Citation constraint**: every extracted causal chain must carry a character-level offset back to the source span. Attributions that can't cite the original text are dropped.
2. **Multi-model cross-validation**: the same story is run through Claude, GPT, and Gemini independently; only causal chains all three agree on are kept.
3. **Reverse predictive testing**: extracted death modes are tested against a held-out set. If predictive accuracy falls below the random baseline, the pattern is flagged as an "overfit hallucination" and removed from the library.

## Why This Is Worth Doing

Every existing startup post-mortem database (CB Insights, Failory, etc.) stops at "archive in human-readable form." They are museums, not markets. The real value of structured extraction is turning failure modes from *stories* into *signals an algorithm can consume*—and once they're signals, they can be priced, hedged, and compounded.
