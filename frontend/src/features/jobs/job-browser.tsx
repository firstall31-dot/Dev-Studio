import { useState } from "react";
import {
  Search,
  Loader2,
  RefreshCw,
  Bookmark,
  ExternalLink,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import type { SavedJob } from "./types";

interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  postedAt: string;
  tags?: string[];
  salary?: string;
  logo?: string;
}

interface Props {
  onSaveJob: (job: Partial<SavedJob>) => Promise<void>;
}
import { CATEGORIES, TIME_OPTIONS, SOURCES, SOURCE_BADGE, SOURCE_PLATFORM_NAME } from "@/data/jobs/jobs";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

export function JobBrowser({ onSaveJob }: Props) {
  const [category, setCategory] = useState("fullstack");
  const [query, setQuery] = useState("full stack developer");
  const [location, setLocation] = useState("");
  const [days, setDays] = useState(1);
  const [sources, setSources] = useState(["indeed", "wuzzuf", "bayt", "remoteok", "mostaql", "khamsat"]);

  const [results, setResults] = useState<ScrapedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fetched, setFetched] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const pickCategory = (cat: (typeof CATEGORIES)[0]) => {
    setCategory(cat.id);
    setQuery(cat.query);
  };

  const toggleSource = (id: string) =>
    setSources((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const handleSearch = async () => {
    if (!sources.length) {
      toast.error("Select at least one source.");
      return;
    }
    setLoading(true);
    setFetched(true);
    setErrors([]);
    try {
      const params = new URLSearchParams({
        q: query,
        location,
        days: String(days),
        sources: sources.join(","),
      });
      const r = await fetch(`/api/jobs/scrape?${params}`);
      const data = await r.json();
      setResults(data.jobs ?? []);
      setErrors(data.errors ?? []);
      if ((data.jobs ?? []).length === 0 && (data.errors ?? []).length === sources.length) {
        toast.error("All sources failed. Check your connection or try fewer sources.");
      }
    } catch {
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (job: ScrapedJob) => {
    setSavingId(job.id);
    try {
      await onSaveJob({
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        status: "saved",
        platform: SOURCE_PLATFORM_NAME[job.source] ?? job.source,
        remote: job.source === "remoteok" || job.location?.toLowerCase().includes("remote"),
        tags: job.tags ?? [],
        salary: job.salary ?? "",
      });
    } finally {
      setSavingId(null);
    }
  };

  const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${location ? `&location=${encodeURIComponent(location)}` : ""}&f_TPR=r${days * 86400}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Controls ── */}
      <div className="shrink-0 border-b border-border bg-background p-4 space-y-3">
        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => pickCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Query + location row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCategory("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Job title or skills…"
              className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Location"
              className="w-32 pl-7 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Time + sources + LinkedIn + Search button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time segment */}
          <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5 shrink-0">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => setDays(t.value)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  days === t.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Source toggles */}
          <div className="flex items-center gap-1 flex-wrap">
            {SOURCES.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSource(s.id)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md border transition-all ${
                  sources.includes(s.id)
                    ? s.color
                    : "bg-transparent text-muted-foreground/40 border-border"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* LinkedIn link */}
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
          >
            <ExternalLink className="size-3" /> LinkedIn
          </a>

          {/* Search */}
          <button
            onClick={handleSearch}
            disabled={loading || !sources.length}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            {fetched ? "Refresh" : "Search Jobs"}
          </button>
        </div>

        {/* Source error notice */}
        {errors.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-md px-2.5 py-1.5">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>
              Could not reach: <strong>{errors.join(", ")}</strong>. Results shown from other
              sources.
            </span>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex-1 overflow-y-auto p-4">
        {!fetched && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="size-14 rounded-2xl bg-primary/10 grid place-items-center">
              <Search className="size-6 text-primary" />
            </div>
            <p className="text-sm font-semibold">Browse Jobs from Top Sites</p>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Search across <strong>Indeed</strong>, <strong>Wuzzuf</strong>, <strong>Bayt</strong>,
              <strong>RemoteOK</strong>, <strong>Mostaql</strong>, and <strong>Khamsat</strong> at
              once. Default: <em>Full Stack Developer</em> — last 24 hours.
            </p>
            <button
              onClick={handleSearch}
              className="mt-2 px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              Load Jobs Now
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Searching {sources.join(", ")}…</span>
          </div>
        )}

        {!loading && fetched && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No jobs found.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Try different keywords, a wider time range, or more sources.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-muted-foreground">
              {results.length} job{results.length !== 1 ? "s" : ""} found
              {errors.length > 0 && (
                <span className="ml-1 text-yellow-400/80">({errors.join(", ")} unavailable)</span>
              )}
            </p>

            {results.map((job) => (
              <div
                key={job.id}
                className="rounded-lg border border-border bg-card p-3.5 hover:border-ring/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="size-8 rounded-md object-contain bg-muted border border-border shrink-0"
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).style.display = "none")
                      }
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug line-clamp-1">{job.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {job.company}
                          {job.company && job.location ? " · " : ""}
                          {job.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_BADGE[job.source] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {job.source}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {timeAgo(job.postedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 flex-1">
                          {job.tags.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {job.salary && (
                        <span className="text-[11px] text-green-400 font-medium whitespace-nowrap">
                          {job.salary}
                        </span>
                      )}
                      <div className="flex items-center gap-1 ml-auto shrink-0">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-6 grid place-items-center rounded border border-border hover:bg-sidebar-accent/40 text-muted-foreground hover:text-foreground transition-colors"
                          title="Open job listing"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                        <button
                          onClick={() => handleSave(job)}
                          disabled={savingId === job.id}
                          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors disabled:opacity-50"
                        >
                          {savingId === job.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Bookmark className="size-3" />
                          )}
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
