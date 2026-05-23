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
    "a",
    "an",
  ]);
  const meaningful = words.filter((w) => w.length > 3 && !skip.has(w));
  const tag = meaningful[0] ?? words.find((w) => w.length > 2) ?? words[0] ?? "javascript";

  const r = await fetch(
    `https://remoteok.com/api?tag=${encodeURIComponent(tag)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
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
    .slice(0, 20)
    .map((j: any) => {
      const epoch = j.epoch ?? j.date;
      let postedAt: string;
      if (typeof epoch === "number") {
        postedAt = new Date(epoch * 1000).toISOString();
      } else if (typeof epoch === "string" && /^\d{9,11}$/.test(epoch)) {
        postedAt = new Date(Number(epoch) * 1000).toISOString();
      } else {
        postedAt = epoch ?? new Date().toISOString();
      }
      return {
        id: `remoteok_${j.id}`,
        title: j.title ?? "",
        company: j.company ?? "",
        location: j.location || "Remote",
        url: j.url ?? `https://remoteok.com/remote-jobs/${j.id}`,
        source: "remoteok",
        postedAt,
        tags: j.tags ?? [],
        salary: j.salary_min
          ? `$${Number(j.salary_min).toLocaleString()} – $${Number(j.salary_max ?? j.salary_min).toLocaleString()}`
          : "",
        logo: j.company_logo ?? "",
      };
    });
}
