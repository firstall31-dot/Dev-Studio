import { Plus, Handshake, Search } from "lucide-react";
import { useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import type { FreelanceOffer } from "./types";
import { STATUS_COLORS, PLATFORM_COLORS } from "./types";

interface Props {
  offers: FreelanceOffer[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

const statusLabel: Record<string, string> = {
  new: "New",
  in_review: "In Review",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Done",
};

type OfferFilter = "all" | "new" | "in_review" | "accepted" | "completed" | "rejected";

const FILTERS: { label: string; value: OfferFilter }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "In Review", value: "in_review" },
  { label: "Accepted", value: "accepted" },
  { label: "Done", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

export function OffersSidebar({ offers, activeId, onSelect, onAdd }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OfferFilter>("all");

  const filtered = offers.filter((o) => {
    const matchesSearch =
      (o.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.client ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.platform ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || o.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 20);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
            <Handshake className="size-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Offers ({offers.length})
          </span>
        </div>
        <button
          onClick={onAdd}
          className="size-6 rounded-lg bg-primary/10 grid place-items-center text-primary hover:bg-primary/20 transition-colors shrink-0"
          title="Add Offer"
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
            placeholder="Search offers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-2 pt-1.5 pb-1.5 flex items-center gap-1 flex-wrap shrink-0">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? offers.length : offers.filter((o) => o.status === f.value).length;
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
            <Handshake className="size-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              {searchQuery || activeFilter !== "all"
                ? "No matching offers"
                : "No offers tracked yet."}
            </p>
            {!searchQuery && activeFilter === "all" && (
              <p className="text-[10px] text-muted-foreground/60">
                Add offers from Mostaql, Upwork, Fiverr, etc.
              </p>
            )}
          </div>
        )}
        <ul className="space-y-0.5">
          {paged.map((offer) => (
            <li key={offer.id}>
              <button
                onClick={() => onSelect(offer.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  activeId === offer.id
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <p className="text-xs font-medium truncate leading-snug">{offer.title}</p>
                {offer.client && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {offer.client}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {offer.platform && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-lg font-medium ${PLATFORM_COLORS[offer.platform] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {offer.platform}
                    </span>
                  )}
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-medium ${STATUS_COLORS[offer.status] ?? ""}`}
                  >
                    {statusLabel[offer.status] ?? offer.status}
                  </span>
                  {offer.budget && (
                    <span className="text-[9px] text-green-400 font-medium">
                      {offer.budget} {offer.currency}
                    </span>
                  )}
                  {offer.category && (
                    <span className="text-[9px] text-muted-foreground/70 truncate">
                      {offer.category}
                    </span>
                  )}
                  {offer.deadline && (
                    <span className="text-[9px] text-muted-foreground/60">
                      Due {offer.deadline}
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
          <Plus className="size-3.5" /> Add Offer
        </button>
      </div>
    </div>
  );
}
