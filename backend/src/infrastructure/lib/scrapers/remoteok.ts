export async function scrapeRemoteOKTagged(query: string): Promise<any[]> {
  const words = query.toLowerCase().split(/\s+/);
  const skip = new Set([
    "developer",
    "engineer",
    "senior",
    "junior",
    "full",
    "stack",
    "and",
    "the",
  ]);
  const tag = words.find((w) => w.length > 3 && !skip.has(w)) ?? words[0];
  const r = await fetch(
    `https://remoteok.com/api?tag=${encodeURIComponent(tag)}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 DevStudio/1.0",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!r.ok) throw new Error(`RemoteOK ${r.status}`);
  const data = (await r.json()) as any[];
  return data
    .slice(1)
    .filter((j: any) => j.id && j.title)
    .slice(0, 15)
    .map((j: any) => ({
      id: `remoteok_${j.id}`,
      title: j.title ?? "",
      company: j.company ?? "",
      location: j.location || "Remote",
      url: j.url ?? "",
      source: "remoteok",
      postedAt: j.date ?? new Date().toISOString(),
      tags: j.tags ?? [],
      salary: j.salary_min
        ? `$${Number(j.salary_min).toLocaleString()} – $${Number(j.salary_max ?? j.salary_min).toLocaleString()}`
        : "",
      logo: j.company_logo ?? "",
    }));
}
