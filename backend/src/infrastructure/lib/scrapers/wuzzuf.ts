export async function scrapeWuzzuf(
  query: string,
  location: string,
  days: number,
): Promise<any[]> {
  const locParam = location
    ? `&filters[city][]=${encodeURIComponent(location)}`
    : "";
  const url = `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(query)}${locParam}&a=hpb`;
  const r = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error(`Wuzzuf ${r.status}`);
  const html = await r.text();
  const nd = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!nd) throw new Error("Wuzzuf: no __NEXT_DATA__");
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
