import { Plus, Briefcase, Search } from "lucide-react";
import { useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import type { SavedJob } from "./types";
import { STATUS_COLORS, JOB_STATUSES } from "./types";

interface Props {
  jobs: SavedJob[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

const statusLabel: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

type JobFilter = "all" | "applied" | "interview";

const FILTERS: { label: string; value: JobFilter }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interview" },
];

export function JobsSidebar({ jobs, activeId, onSelect, onAdd }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<JobFilter>("all");

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      (j.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.company ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || j.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 20);

  const grouped = JOB_STATUSES.reduce<Record<string, SavedJob[]>>(
    (acc, s) => {
      acc[s] = paged.filter((j) => j.status === s);
      return acc;
    },
    {} as Record<string, SavedJob[]>,
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
            <Briefcase className="size-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Jobs ({jobs.length})
          </span>
        </div>
        <button
          onClick={onAdd}
          className="size-6 rounded-lg bg-primary/10 grid place-items-center text-primary hover:bg-primary/20 transition-colors shrink-0"
          title="Add Job"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-2 pt-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-2 pt-1.5 pb-1.5 flex items-center gap-1 shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`text-[10px] px-2 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === f.value
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-2 border-t border-border/60 shrink-0" />

      {/* List */}
      <div className="overflow-y-auto p-2 space-y-3 flex-1">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
            <Briefcase className="size-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              {searchQuery || activeFilter !== "all" ? "No matching jobs" : "No jobs tracked yet."}
            </p>
            {!searchQuery && activeFilter === "all" && (
              <p className="text-[10px] text-muted-foreground/60">
                Browse live jobs or add one manually.
              </p>
            )}
          </div>
        )}
        {JOB_STATUSES.map((status) => {
          const items = grouped[status];
          if (!items || items.length === 0) return null;
          return (
            <div key={status}>
              <p className="px-2 mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                {statusLabel[status]} ({items.length})
              </p>
              <ul className="space-y-0.5">
                {items.map((job) => (
                  <li key={job.id}>
                    <button
                      onClick={() => onSelect(job.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                        activeId === job.id
                          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <p className="text-xs font-medium truncate leading-snug">{job.title}</p>
                      {job.company && (
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {job.company}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-medium ${STATUS_COLORS[job.status] ?? ""}`}
                        >
                          {statusLabel[job.status] ?? job.status}
                        </span>
                        {job.platform && (
                          <span className="text-[9px] text-muted-foreground truncate">
                            {job.platform}
                          </span>
                        )}
                        {job.category && (
                          <span className="text-[9px] text-muted-foreground/70 truncate">
                            · {job.category}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <ListPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {/* Bottom Action */}
      <div className="px-2 pb-2 shrink-0">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 text-xs font-semibold transition-colors border border-primary/20"
        >
          <Plus className="size-3.5" /> Add Job
        </button>
      </div>
    </div>
  );
}
