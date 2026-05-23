export async function scrapeMostaql(query: string, days: number): Promise<any[]> {
  const url = `https://mostaql.com/projects?q=${encodeURIComponent(query)}&sort=latest`;
  const r = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
      Referer: "https://mostaql.com/",
    },
    signal: AbortSignal.timeout(12000),
  });

  if (r.status === 403 || r.status === 429 || r.status === 503 || r.status === 401) {
    console.warn(`[mostaql] Blocked (${r.status}) — returning empty`);
    return [];
  }
  if (!r.ok) throw new Error(`Mostaql ${r.status}`);

  const html = await r.text();
  const cutoff = Date.now() - days * 86400000;
  const jobs: any[] = [];

  const rowRe = /<tr class="project-row">([\s\S]*?)<\/tr>/gi;
  let m: RegExpExecArray | null;

  while ((m = rowRe.exec(html)) !== null) {
    const block = m[1];

    const titleM = block.match(
      /<h2[^>]*>[\s\S]*?<a\s+href="(https:\/\/mostaql\.com\/project\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i,
    );
    if (!titleM) continue;

    const url_ = titleM[1];
    const title = titleM[2].replace(/<[^>]+>/g, "").trim();
    if (!title) continue;

    const dateM = block.match(/datetime="([^"]+)"/i);
    const postedAt = dateM ? new Date(dateM[1]).toISOString() : new Date().toISOString();
    if (dateM && new Date(dateM[1]).getTime() < cutoff) continue;

    const clientM = block.match(/<bdi>([^<]+)<\/bdi>/i);
    const client = clientM?.[1]?.trim() ?? "Client";

    const briefM = block.match(/<p[^>]+class="[^"]*project__brief[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
    const brief = briefM
      ? briefM[1].replace(/<[^>]+>/g, "").trim().slice(0, 200)
      : "";

    const idM = url_.match(/\/project\/(\d+)/);
    const id = idM ? `mostaql_${idM[1]}` : `mostaql_${Buffer.from(url_).toString("base64").slice(0, 12)}`;

    jobs.push({
      id,
      title,
      company: client,
      location: "Remote · Arab World",
      url: url_,
      source: "mostaql",
      postedAt,
      tags: extractSkills(block),
      salary: extractBudget(block),
      description: brief,
    });

    if (jobs.length >= 20) break;
  }

  return jobs;
}

function extractSkills(block: string): string[] {
  const tags: string[] = [];
  const re = /<a[^>]+class="[^"]*skill[^"]*"[^>]*>([^<]+)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) tags.push(m[1].trim());
  return tags.slice(0, 6);
}

function extractBudget(block: string): string {
  const m =
    block.match(/class="[^"]*budget[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i) ??
    block.match(/(\d[\d,.]+)\s*[-–]\s*(\d[\d,.]+)\s*(?:\$|SAR|ريال)/i) ??
    block.match(/\$\s*(\d[\d,.]+)/i);
  if (!m) return "";
  return m[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
}
