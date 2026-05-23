import { Plus, Star, Search } from "lucide-react";
import { useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import type { MyService } from "./types";
import { STATUS_COLORS, PLATFORM_COLORS } from "./types";

interface Props {
  services: MyService[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

const statusLabel: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
};

type ServiceFilter = "all" | "active" | "paused" | "draft";

const FILTERS: { label: string; value: ServiceFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Draft", value: "draft" },
];

export function ServicesSidebar({ services, activeId, onSelect, onAdd }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>("all");

  const filtered = services.filter((s) => {
    const matchesSearch =
      (s.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.platform ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || s.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 20);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
            <Star className="size-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Services ({services.length})
          </span>
        </div>
        <button
          onClick={onAdd}
          className="size-6 rounded-lg bg-primary/10 grid place-items-center text-primary hover:bg-primary/20 transition-colors shrink-0"
          title="Add Service"
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
            placeholder="Search services…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-2 pt-1.5 pb-1.5 flex items-center gap-1 flex-wrap shrink-0">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? services.length : services.filter((s) => s.status === f.value).length;
          if (f.value !== "all" && count === 0) return null;
          return (
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
              {count > 0 && f.value !== "all" && (
                <span className="ml-1 opacity-60">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-2 border-t border-border/60 shrink-0" />

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
            <Star className="size-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              {searchQuery || activeFilter !== "all"
                ? "No matching services"
                : "No services listed yet."}
            </p>
            {!searchQuery && activeFilter === "all" && (
              <p className="text-[10px] text-muted-foreground/60">
                Add your Fiverr, Mostaql, or Khamsat gigs.
              </p>
            )}
          </div>
        )}
        <ul className="space-y-0.5">
          {paged.map((svc) => (
            <li key={svc.id}>
              <button
                onClick={() => onSelect(svc.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  activeId === svc.id
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <p className="text-xs font-medium truncate leading-snug">{svc.title}</p>
                {svc.category && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {svc.category}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {svc.platform && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-lg font-medium ${PLATFORM_COLORS[svc.platform] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {svc.platform}
                    </span>
                  )}
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-medium ${STATUS_COLORS[svc.status] ?? ""}`}
                  >
                    {statusLabel[svc.status] ?? svc.status}
                  </span>
                  {svc.price && (
                    <span className="text-[9px] text-green-400 font-medium">
                      {svc.price} {svc.currency}
                    </span>
                  )}
                  {svc.deliveryDays && (
                    <span className="text-[9px] text-muted-foreground/60">
                      {svc.deliveryDays}d delivery
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
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
          <Plus className="size-3.5" /> Add Service
        </button>
      </div>
    </div>
  );
}
