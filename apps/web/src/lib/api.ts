const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ProjectCreate {
  name: string;
  description: string;
  narrative: string;
  stage?: string;
  vertical?: string;
  model?: string;
  contributor_name?: string;
  contributor_email?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  narrative: string;
  stage: string | null;
  vertical: string | null;
  model: string | null;
  status: string;
  contributor_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectListResponse {
  items: Project[];
  total: number;
}

interface QueryRequest {
  vertical?: string;
  model?: string;
  stage?: string;
  description?: string;
  top_k?: number;
}

interface DeathModeResult {
  id: string;
  label: string;
  description: string;
  probability: number;
  median_ttl_months: number | null;
  frequency: number;
}

interface QueryResponse {
  query: QueryRequest;
  death_modes: DeathModeResult[];
  total_projects_analyzed: number;
}

export type {
  ProjectCreate,
  Project,
  ProjectListResponse,
  QueryRequest,
  QueryResponse,
  DeathModeResult,
};

export async function createProject(data: ProjectCreate): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create project: ${res.status}`);
  return res.json();
}

export async function getProjects(
  skip = 0,
  limit = 20
): Promise<ProjectListResponse> {
  const res = await fetch(
    `${API_BASE}/projects?skip=${skip}&limit=${limit}`
  );
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  return res.json();
}

export async function getProject(id: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);
  return res.json();
}

export async function queryDeathModes(
  data: QueryRequest
): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to query: ${res.status}`);
  return res.json();
}
