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
  if (!r.ok) throw new Error(`Mostaql ${r.status}`);
  const html = await r.text();

  const cutoff = Date.now() - days * 86400000;
  const jobs: any[] = [];

  const rowRe =
    /<tr[^>]*class="[^"]*project[^"]*"[^>]*id="project-(\d+)"[^>]*>([\s\S]*?)<\/tr>/gi;
  let m: RegExpExecArray | null;

  while ((m = rowRe.exec(html)) !== null && jobs.length < 20) {
    const id = m[1];
    const block = m[2];

    const titleM = block.match(
      /<h3[^>]*class="[^"]*project__title[^"]*"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i,
    );
    if (!titleM) {
      const altTitle = block.match(/<a[^>]+href="(\/projects\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      if (!altTitle) continue;
      const title = altTitle[2].replace(/<[^>]+>/g, "").trim();
      const href = altTitle[1];
      if (!title) continue;
      const dateM = block.match(/datetime="([^"]+)"/i);
      const postedAt = dateM ? new Date(dateM[1]).toISOString() : new Date().toISOString();
      if (dateM && new Date(dateM[1]).getTime() < cutoff) continue;
      jobs.push({
        id: `mostaql_${id}`,
        title,
        company: "Client",
        location: "Remote · Arab World",
        url: `https://mostaql.com${href}`,
        source: "mostaql",
        postedAt,
        tags: extractTags(block),
        salary: extractBudget(block),
      });
      continue;
    }

    const title = titleM[2].replace(/<[^>]+>/g, "").trim();
    const href = titleM[1];
    const dateM = block.match(/datetime="([^"]+)"/i);
    const postedAt = dateM ? new Date(dateM[1]).toISOString() : new Date().toISOString();
    if (dateM && new Date(dateM[1]).getTime() < cutoff) continue;

    jobs.push({
      id: `mostaql_${id}`,
      title,
      company: "Client",
      location: "Remote · Arab World",
      url: href.startsWith("http") ? href : `https://mostaql.com${href}`,
      source: "mostaql",
      postedAt,
      tags: extractTags(block),
      salary: extractBudget(block),
    });
  }

  if (jobs.length === 0) {
    const altRows = [...html.matchAll(/<a[^>]+href="(\/projects\/[^"?]+)"[^>]*>([^<]{5,120})<\/a>/gi)];
    for (const row of altRows.slice(0, 15)) {
      const href = row[1];
      const title = row[2].trim();
      if (!title || title.length < 5) continue;
      const slug = href.split("/").filter(Boolean).pop() ?? "";
      jobs.push({
        id: `mostaql_${slug}`,
        title,
        company: "Client",
        location: "Remote · Arab World",
        url: `https://mostaql.com${href}`,
        source: "mostaql",
        postedAt: new Date().toISOString(),
        tags: [],
        salary: "",
      });
    }
  }

  return jobs;
}

function extractTags(block: string): string[] {
  const tags: string[] = [];
  const re = /<a[^>]+class="[^"]*skill[^"]*"[^>]*>([^<]+)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) tags.push(m[1].trim());
  return tags.slice(0, 6);
}

function extractBudget(block: string): string {
  const m =
    block.match(/class="[^"]*budget[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i) ??
    block.match(/(\d[\d,]+)\s*[-–]\s*(\d[\d,]+)\s*\$/) ??
    block.match(/\$\s*(\d[\d,]+)/);
  if (!m) return "";
  return m[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
}
