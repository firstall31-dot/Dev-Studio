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
  if (!r.ok) throw new Error(`Khamsat ${r.status}`);
  const html = await r.text();

  const cutoff = Date.now() - days * 86400000;
  const jobs: any[] = [];

  const cardRe =
    /<div[^>]+class="[^"]*request[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div[^>]+class="[^"]*request|$)/gi;
  let m: RegExpExecArray | null;

  while ((m = cardRe.exec(html)) !== null && jobs.length < 20) {
    const block = m[1];
    const titleM = block.match(/<a[^>]+href="(\/community\/requests\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!titleM) continue;
    const title = titleM[2].replace(/<[^>]+>/g, "").trim();
    const href = titleM[1];
    if (!title || title.length < 5) continue;

    const dateM = block.match(/datetime="([^"]+)"/i);
    const postedAt = dateM ? new Date(dateM[1]).toISOString() : new Date().toISOString();
    if (dateM && new Date(dateM[1]).getTime() < cutoff) continue;

    const budgetM = block.match(/(\d[\d,]+)\s*ريال|(\d[\d,]+)\s*\$/i);
    const salary = budgetM
      ? `${(budgetM[1] ?? budgetM[2]).replace(/,/g, "")} ${budgetM[1] ? "SAR" : "USD"}`
      : "";

    jobs.push({
      id: `khamsat_${href.split("/").filter(Boolean).pop() ?? Math.random().toString(36).slice(2)}`,
      title,
      company: "Client",
      location: "Remote · Arab World",
      url: `https://khamsat.com${href}`,
      source: "khamsat",
      postedAt,
      tags: extractKhamsatTags(block),
      salary,
    });
  }

  if (jobs.length === 0) {
    const links = [
      ...html.matchAll(/<a[^>]+href="(\/community\/requests\/[^"?]+)"[^>]*>([\s\S]*?)<\/a>/gi),
    ];
    for (const lm of links.slice(0, 15)) {
      const href = lm[1];
      const title = lm[2].replace(/<[^>]+>/g, "").trim();
      if (!title || title.length < 5) continue;
      const slug = href.split("/").filter(Boolean).pop() ?? "";
      jobs.push({
        id: `khamsat_${slug}`,
        title,
        company: "Client",
        location: "Remote · Arab World",
        url: `https://khamsat.com${href}`,
        source: "khamsat",
        postedAt: new Date().toISOString(),
        tags: [],
        salary: "",
      });
    }
  }

  return jobs;
}

function extractKhamsatTags(block: string): string[] {
  const tags: string[] = [];
  const re = /<span[^>]+class="[^"]*tag[^"]*"[^>]*>([^<]+)<\/span>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) tags.push(m[1].trim());
  return tags.slice(0, 6);
}
