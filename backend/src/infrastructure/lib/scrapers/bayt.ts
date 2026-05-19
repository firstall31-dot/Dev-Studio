export async function scrapeBayt(
  query: string,
  location: string,
  days: number,
): Promise<any[]> {
  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const safeSlug = encodeURIComponent(slug || "all");
  const url = new URL(
    `/en/international/jobs/${safeSlug}-jobs/`,
    "https://www.bayt.com",
  ).toString();
  const r = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error(`Bayt ${r.status}`);
  const html = await r.text();
  const jobs: any[] = [];
  const ldRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  const cutoff = Date.now() - days * 86400000;
  while ((m = ldRe.exec(html)) !== null && jobs.length < 20) {
    try {
      const obj = JSON.parse(m[1]);
      if (obj["@type"] === "JobPosting" && obj.title) {
        const posted = obj.datePosted
          ? new Date(obj.datePosted).getTime()
          : Date.now();
        if (posted >= cutoff) {
          jobs.push({
            id: `bayt_${Buffer.from(obj.url ?? obj.title)
              .toString("base64")
              .replace(/\W/g, "")
              .slice(0, 16)}`,
            title: obj.title,
            company: obj.hiringOrganization?.name ?? "",
            location:
              [
                obj.jobLocation?.address?.addressLocality,
                obj.jobLocation?.address?.addressCountry,
              ]
                .filter(Boolean)
                .join(", ") ||
              location ||
              "Middle East",
            url: obj.url ?? url,
            source: "bayt",
            postedAt: obj.datePosted ?? new Date().toISOString(),
            tags: [],
          });
        }
      }
    } catch (err) {
      console.warn("[bayt] Failed to parse JSON-LD script:", err);
    }
  }
  return jobs;
}
