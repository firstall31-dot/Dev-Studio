function extractXmlField(block: string, tag: string): string {
  const m = block.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`),
  );
  return m?.[1]?.trim() ?? "";
}

export async function scrapeIndeedRSS(
  query: string,
  location: string,
  days: number,
): Promise<any[]> {
  const url = `https://www.indeed.com/rss?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}&sort=date&fromage=${days}`;
  const r = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/xml,application/xml,application/rss+xml,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
    },
    signal: AbortSignal.timeout(8000),
  });

  if (r.status === 403 || r.status === 429 || r.status === 503 || r.status === 401) {
    console.warn(`[indeed] Blocked (${r.status}) — returning empty`);
    return [];
  }
  if (!r.ok) throw new Error(`Indeed ${r.status}`);

  const xml = await r.text();

  if (!xml.trim().startsWith("<") || xml.includes("Security Check") || xml.includes("captcha")) {
    console.warn("[indeed] Non-XML response (bot check) — returning empty");
    return [];
  }

  const jobs: any[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const title = extractXmlField(block, "title")
      .replace(/ - [^-]+$/, "")
      .trim();
    const link = extractXmlField(block, "link");
    const company = extractXmlField(block, "source");
    const pubDate = extractXmlField(block, "pubDate");
    const guid = extractXmlField(block, "guid") || link;
    const desc = extractXmlField(block, "description");
    const locM = desc
      .replace(/<[^>]+>/g, " ")
      .match(/([A-Za-z ]+,\s*[A-Z]{2}(?:\s+\d{5})?)/);
    if (title && link) {
      jobs.push({
        id: `indeed_${Buffer.from(guid).toString("base64").replace(/\W/g, "").slice(0, 20)}`,
        title,
        company,
        source: "indeed",
        location: locM?.[1]?.trim() || location || "Not specified",
        url: link,
        postedAt: pubDate
          ? new Date(pubDate).toISOString()
          : new Date().toISOString(),
        tags: [],
      });
    }
  }
  return jobs;
}
