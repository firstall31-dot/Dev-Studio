export async function scrapeKhamsat(query: string, days: number): Promise<any[]> {
  const url = `https://khamsat.com/community/requests?q=${encodeURIComponent(query)}&sort=latest`;
  const r = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
      Referer: "https://khamsat.com/",
    },
    signal: AbortSignal.timeout(12000),
  });

  if (r.status === 403 || r.status === 429 || r.status === 503 || r.status === 401) {
    console.warn(`[khamsat] Blocked (${r.status}) — returning empty`);
    return [];
  }
  if (!r.ok) throw new Error(`Khamsat ${r.status}`);

  const html = await r.text();
  const cutoff = Date.now() - days * 86400000;
  const jobs: any[] = [];
  const seen = new Set<string>();

  const linkRe = /<a[^>]+href="(\/community\/requests\/[^"?#]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(html)) !== null) {
    const href = m[1];
    const rawTitle = m[2].replace(/<[^>]+>/g, "").trim();
    if (!rawTitle || rawTitle.length < 5) continue;
    if (seen.has(href)) continue;

    const slug = href.split("/").filter(Boolean).pop() ?? "";
    const id = `khamsat_${slug}`;
    if (seen.has(id)) continue;
    seen.add(href);
    seen.add(id);

    const blockStart = html.indexOf(href);
    const blockSnippet = blockStart >= 0 ? html.slice(Math.max(0, blockStart - 200), blockStart + 800) : "";

    const dateM = blockSnippet.match(/datetime="([^"]+)"/i);
    const postedAt = dateM ? new Date(dateM[1]).toISOString() : new Date().toISOString();
    if (dateM && new Date(dateM[1]).getTime() < cutoff) continue;

    const budgetM = blockSnippet.match(/(\d[\d,.]+)\s*(?:ريال|SAR|\$)/i);
    const salary = budgetM
      ? `${budgetM[1].replace(/,/g, "")} ${budgetM[0].includes("$") ? "USD" : "SAR"}`
      : "";

    const tags = extractKhamsatTags(blockSnippet);

    jobs.push({
      id,
      title: rawTitle,
      company: "Client",
      location: "Remote · Arab World",
      url: `https://khamsat.com${href}`,
      source: "khamsat",
      postedAt,
      tags,
      salary,
    });

    if (jobs.length >= 20) break;
  }

  return jobs;
}

function extractKhamsatTags(block: string): string[] {
  const tags: string[] = [];
  const re = /<span[^>]+class="[^"]*tag[^"]*"[^>]*>([^<]+)<\/span>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    const t = m[1].trim();
    if (t) tags.push(t);
  }
  return tags.slice(0, 6);
}
