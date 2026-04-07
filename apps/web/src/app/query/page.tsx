"use client";

import { useState } from "react";
import { queryDeathModes } from "@/lib/api";
import type { QueryResponse } from "@/lib/api";

export default function QueryPage() {
  const [form, setForm] = useState({
    vertical: "",
    model: "",
    stage: "",
    description: "",
    top_k: "5",
  });
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await queryDeathModes({
        vertical: form.vertical || undefined,
        model: form.model || undefined,
        stage: form.stage || undefined,
        description: form.description || undefined,
        top_k: parseInt(form.top_k) || 5,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h2 className="text-[15px] font-bold text-fg-bright uppercase tracking-[0.15em] mb-4 pb-1 border-b border-fg-dim before:content-['>>_'] before:text-accent">
        Query Death Modes
      </h2>

      <p className="text-fg-dim text-[13px] mb-6 max-w-[72ch]">
        Describe a project and the protocol returns the most likely ways it will
        die, drawn from the collective failure data of every dead project in the
        system.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[640px]">
        <div>
          <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
            Project Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe the project you want to assess risk for..."
            rows={4}
            className="w-full resize-y"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
              Vertical
            </label>
            <input
              type="text"
              value={form.vertical}
              onChange={(e) => updateField("vertical", e.target.value)}
              placeholder="e.g., AI+SMB"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
              Business Model
            </label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => updateField("model", e.target.value)}
              placeholder="e.g., SaaS"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
              Stage
            </label>
            <select
              value={form.stage}
              onChange={(e) => updateField("stage", e.target.value)}
              className="w-full"
            >
              <option value="">--</option>
              <option value="idea">Idea</option>
              <option value="pre-seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b+">Series B+</option>
              <option value="bootstrapped">Bootstrapped</option>
            </select>
          </div>
        </div>

        <div className="w-32">
          <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
            Top K
          </label>
          <input
            type="number"
            value={form.top_k}
            onChange={(e) => updateField("top_k", e.target.value)}
            min="1"
            max="20"
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="self-start px-6 py-3 bg-fg-bright text-bg font-mono text-[13px] font-bold uppercase tracking-widest border border-fg-bright hover:bg-fg hover:shadow-[0_0_24px_var(--fg-bright)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "[ QUERYING... ]" : "[ RUN QUERY ]"}
        </button>
      </form>

      {error && (
        <div className="border border-dashed border-accent p-4 mt-6 text-accent text-xs before:content-['[ERR]_'] before:font-bold">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <div className="text-[11px] text-fg-dim uppercase tracking-widest mb-4">
            {result.total_projects_analyzed} projects analyzed &middot;{" "}
            {result.death_modes.length} death modes returned
          </div>

          <ul className="list-none my-4">
            {result.death_modes.map((mode, i) => (
              <li
                key={mode.id}
                className="py-3 pl-6 border-b border-dashed border-fg-dim relative text-[13px]"
              >
                <span className="absolute left-0 text-accent">[&dagger;]</span>
                <span className="text-fg-bright font-bold">{mode.label}</span>
                <span className="text-amber font-bold ml-2">
                  {Math.round(mode.probability * 100)}%
                </span>
                <span className="text-fg-dim text-[11px] ml-2">
                  median TTL: {mode.median_ttl_months ?? "?"}mo &middot; n=
                  {mode.frequency}
                </span>
                <div className="text-fg text-[12px] mt-1 ml-0">
                  {mode.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
