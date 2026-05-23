import { apiFetch } from "./base";
import type { SavedJob, FreelanceOffer, MyService, RemoteJob } from "@/types/jobs";

// ─── Mappers ─────────────────────────────────────────────────────────────────

export function mapJob(x: any): SavedJob {
  return {
    id: x.id,
    title: x.title,
    company: x.company ?? "",
    location: x.location ?? "",
    url: x.url ?? "",
    platform: x.platform ?? "",
    status: x.status ?? "saved",
    salary: x.salary ?? "",
    remote: x.remote ?? false,
    category: x.category ?? "",
    tags: x.tags ?? [],
    notes: x.notes ?? "",
    createdAt: x.created_at ? new Date(x.created_at).getTime() : (x.createdAt ?? Date.now()),
    updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : (x.updatedAt ?? Date.now()),
  };
}

export function mapOffer(x: any): FreelanceOffer {
  return {
    id: x.id,
    title: x.title,
    client: x.client ?? "",
    platform: x.platform ?? "",
    budget: x.budget ?? "",
    currency: x.currency ?? "USD",
    status: x.status ?? "new",
    description: x.description ?? "",
    url: x.url ?? "",
    deadline: x.deadline ?? "",
    category: x.category ?? "",
    tags: x.tags ?? [],
    notes: x.notes ?? "",
    createdAt: x.created_at ? new Date(x.created_at).getTime() : (x.createdAt ?? Date.now()),
    updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : (x.updatedAt ?? Date.now()),
  };
}

export function mapService(x: any): MyService {
  return {
    id: x.id,
    title: x.title,
    platform: x.platform ?? "",
    url: x.url ?? "",
    category: x.category ?? "",
    price: x.price ?? "",
    currency: x.currency ?? "USD",
    status: x.status ?? "active",
    description: x.description ?? "",
    deliveryDays: x.delivery_days ?? x.deliveryDays ?? 3,
    tags: x.tags ?? [],
    notes: x.notes ?? "",
    createdAt: x.created_at ? new Date(x.created_at).getTime() : (x.createdAt ?? Date.now()),
    updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : (x.updatedAt ?? Date.now()),
  };
}

// ─── Saved Jobs ──────────────────────────────────────────────────────────────

export async function getSavedJobs(): Promise<SavedJob[]> {
  try {
    const rows = await apiFetch<any[]>("/api/jobs/saved");
    return rows.map(mapJob);
  } catch {
    return [];
  }
}

export async function saveJob(data: Partial<SavedJob>): Promise<SavedJob> {
  const row = await apiFetch<any>("/api/jobs/saved", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapJob(row);
}

export async function deleteSavedJob(id: string): Promise<void> {
  await apiFetch<void>(`/api/jobs/saved/${id}`, { method: "DELETE" });
}

// ─── Freelance Offers ────────────────────────────────────────────────────────

export async function getFreelanceOffers(): Promise<FreelanceOffer[]> {
  try {
    const rows = await apiFetch<any[]>("/api/jobs/offers");
    return rows.map(mapOffer);
  } catch {
    return [];
  }
}

export async function saveOffer(data: Partial<FreelanceOffer>): Promise<FreelanceOffer> {
  const row = await apiFetch<any>("/api/jobs/offers", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapOffer(row);
}

export async function deleteFreelanceOffer(id: string): Promise<void> {
  await apiFetch<void>(`/api/jobs/offers/${id}`, { method: "DELETE" });
}

// ─── My Services ─────────────────────────────────────────────────────────────

export async function getMyServices(): Promise<MyService[]> {
  try {
    const rows = await apiFetch<any[]>("/api/jobs/services");
    return rows.map(mapService);
  } catch {
    return [];
  }
}

export async function saveMyService(data: Partial<MyService>): Promise<MyService> {
  const row = await apiFetch<any>("/api/jobs/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapService(row);
}

export async function deleteMyService(id: string): Promise<void> {
  await apiFetch<void>(`/api/jobs/services/${id}`, { method: "DELETE" });
}

// ─── Remote Jobs (scraped) ───────────────────────────────────────────────────

export async function getRemoteJobs(tag: string): Promise<RemoteJob[]> {
  try {
    return await apiFetch<RemoteJob[]>(`/api/jobs/remote?tag=${encodeURIComponent(tag)}`);
  } catch {
    return [];
  }
}

export async function scrapeJobs(params: {
  query: string;
  location: string;
  days: number;
  sources: string[];
}): Promise<any[]> {
  try {
    return await apiFetch<any[]>("/api/jobs/scrape", {
      method: "POST",
      body: JSON.stringify(params),
    });
  } catch {
    return [];
  }
}
