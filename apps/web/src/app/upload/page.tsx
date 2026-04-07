"use client";

import { useState } from "react";
import { createProject } from "@/lib/api";
import type { Project } from "@/lib/api";

export default function UploadPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    narrative: "",
    stage: "",
    vertical: "",
    model: "",
    contributor_name: "",
    contributor_email: "",
  });
  const [result, setResult] = useState<Project | null>(null);
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
      const project = await createProject({
        name: form.name,
        description: form.description,
        narrative: form.narrative,
        stage: form.stage || undefined,
        vertical: form.vertical || undefined,
        model: form.model || undefined,
        contributor_name: form.contributor_name || undefined,
        contributor_email: form.contributor_email || undefined,
      });
      setResult(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h2 className="text-[15px] font-bold text-fg-bright uppercase tracking-[0.15em] mb-4 pb-1 border-b border-fg-dim before:content-['>>_'] before:text-accent">
        Upload a Dead Project
      </h2>

      <p className="text-fg-dim text-[13px] mb-6 max-w-[72ch]">
        Contribute your failure to the protocol. Your post-mortem will be
        processed by the extraction pipeline, distilled into death modes, and
        used to price risk for the next generation of founders.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[640px]">
        <div>
          <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
            Project Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g., AI Customer Support for Pet Stores"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
            Short Description *
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="One-line summary of the project"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
            Failure Narrative *
          </label>
          <textarea
            value={form.narrative}
            onChange={(e) => updateField("narrative", e.target.value)}
            placeholder="Tell the full story. What happened, when, why. Be honest—the more detail, the better the extraction."
            required
            rows={10}
            className="w-full resize-y"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
              Your Name (optional)
            </label>
            <input
              type="text"
              value={form.contributor_name}
              onChange={(e) => updateField("contributor_name", e.target.value)}
              placeholder="Anonymous contributor"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] text-fg-dim uppercase tracking-widest mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              value={form.contributor_email}
              onChange={(e) => updateField("contributor_email", e.target.value)}
              placeholder="For Shapley payouts"
              className="w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="self-start px-6 py-3 bg-fg-bright text-bg font-mono text-[13px] font-bold uppercase tracking-widest border border-fg-bright hover:bg-fg hover:shadow-[0_0_24px_var(--fg-bright)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "[ UPLOADING... ]" : "[ SUBMIT FAILURE ]"}
        </button>
      </form>

      {error && (
        <div className="border border-dashed border-accent p-4 mt-6 text-accent text-xs before:content-['[ERR]_'] before:font-bold">
          {error}
        </div>
      )}

      {result && (
        <div className="border border-fg-bright p-6 mt-6 bg-bg-alt">
          <div className="text-[11px] text-fg-dim uppercase tracking-widest mb-2">
            Project Uploaded Successfully
          </div>
          <div className="text-fg-bright font-bold mb-1">{result.name}</div>
          <div className="text-[12px] text-fg-dim font-mono">
            ID: {result.id}
          </div>
          <div className="text-[12px] text-fg-dim font-mono">
            Status: {result.status}
          </div>
          <div className="text-[12px] text-amber mt-2">
            Queued for extraction. Death modes will be generated once the
            pipeline processes this project.
          </div>
        </div>
      )}
    </main>
  );
}
