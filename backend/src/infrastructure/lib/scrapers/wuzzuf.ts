export async function scrapeWuzzuf(
  query: string,
  location: string,
  days: number,
): Promise<any[]> {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };

  const locParam = location
    ? `&filters[city][]=${encodeURIComponent(location)}`
    : "";
  const searchUrl = `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(query)}${locParam}&a=hpb`;

  const r = await fetch(searchUrl, {
    headers,
    signal: AbortSignal.timeout(10000),
  });

  if (r.status === 403 || r.status === 429 || r.status === 503) {
    console.warn(`[wuzzuf] Blocked (${r.status}) — returning empty`);
    return [];
  }
  if (!r.ok) throw new Error(`Wuzzuf ${r.status}`);

  const html = await r.text();

  const isChallenge =
    html.includes("Just a moment") ||
    (html.includes("cloudflare") && !html.includes("__NEXT_DATA__") && html.length < 50000);

  if (isChallenge) {
    console.warn("[wuzzuf] Cloudflare challenge detected — returning empty");
    return [];
  }

  const nd = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!nd) {
    console.warn("[wuzzuf] No __NEXT_DATA__ found — page may have changed");
    return [];
  }

  const data = JSON.parse(nd[1]);
  const raw: any[] = data?.props?.pageProps?.jobs ?? [];
  const cutoff = Date.now() - days * 86400000;
  return raw
    .filter(
      (j: any) => !j.created_at || new Date(j.created_at).getTime() >= cutoff,
    )
    .slice(0, 20)
    .map((j: any) => ({
      id: `wuzzuf_${j.id ?? j.slug}`,
      title: j.title ?? "",
      company: j.company?.name ?? "",
      location:
        [j.city?.name, j.country?.name].filter(Boolean).join(", ") || "Egypt",
      url: `https://wuzzuf.net/jobs/p/${j.slug ?? j.id}`,
      source: "wuzzuf",
      postedAt: j.created_at ?? new Date().toISOString(),
      tags: (j.required_skills ?? []).map((s: any) => s.name ?? s),
    }));
}
