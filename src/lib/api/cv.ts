import { apiFetch } from "./base";
import type { CVProfile, ATSResult } from "../../types/cv";

export async function getCVProfiles(): Promise<CVProfile[]> {
  try { return await apiFetch<CVProfile[]>("/api/cv"); } catch { return []; }
}

export async function upsertCVProfile(cv: Partial<CVProfile>): Promise<CVProfile> {
  return apiFetch<CVProfile>("/api/cv", { method: "POST", body: JSON.stringify(cv) });
}

export async function deleteCVProfile(id: string): Promise<void> {
  await apiFetch<void>(`/api/cv/${id}`, { method: "DELETE" });
}

export async function checkATS(cvProfile: CVProfile, jobDescription: string): Promise<ATSResult> {
  return apiFetch<ATSResult>("/api/cv/ats-check", {
    method: "POST",
    body: JSON.stringify({ cvProfile, jobDescription }),
  });
}

export async function parsePDFText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/cv/parse-pdf", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Failed to parse PDF");
  }
  const data = await response.json();
  return data.text as string;
}
