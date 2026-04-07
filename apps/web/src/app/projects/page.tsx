"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import type { Project } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjects(0, 50);
        setProjects(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main>
      <h2 className="text-[15px] font-bold text-fg-bright uppercase tracking-[0.15em] mb-4 pb-1 border-b border-fg-dim before:content-['>>_'] before:text-accent">
        Buried Projects
      </h2>

      <p className="text-fg-dim text-[13px] mb-6 max-w-[72ch]">
        Every project here died so the next one might live. {total} projects in
        the graveyard.
      </p>

      {loading && (
        <div className="text-fg-dim text-[13px]">
          Loading<span className="animate-blink">...</span>
        </div>
      )}

      {error && (
        <div className="border border-dashed border-accent p-4 mt-4 text-accent text-xs before:content-['[ERR]_'] before:font-bold">
          {error}
        </div>
      )}

      {!loading && projects.length === 0 && !error && (
        <div className="border border-fg-dim p-8 text-center bg-bg-alt my-6">
          <div className="font-vt text-[24px] text-fg-bright [text-shadow:0_0_6px_var(--fg)] mb-2">
            EMPTY GRAVEYARD
          </div>
          <p className="text-fg-dim text-[12px]">
            No projects uploaded yet. Be the first to{" "}
            <a href="/upload" className="text-amber">
              contribute a failure
            </a>
            .
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="flex flex-col gap-px">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-fg-dim bg-bg-alt p-5 hover:border-fg-bright hover:shadow-[0_0_12px_rgba(127,255,127,0.2)] transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-fg-bright font-bold text-[14px]">
                  {project.name}
                </div>
                <div className="text-[10px] text-fg-dim uppercase tracking-widest">
                  {project.status}
                </div>
              </div>
              <div className="text-fg text-[12px] mb-2">
                {project.description}
              </div>
              <div className="flex gap-4 text-[10px] text-fg-dim uppercase tracking-widest">
                {project.stage && <span>Stage: {project.stage}</span>}
                {project.vertical && <span>Vertical: {project.vertical}</span>}
                {project.model && <span>Model: {project.model}</span>}
                <span>
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
