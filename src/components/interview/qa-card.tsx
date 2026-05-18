import { useState } from "react";
import { ChevronDown, ChevronUp, Star, Copy, Pencil, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { InterviewQuestion } from "@/types/skills";

import { DIFF_COLORS, DEPTH_COLORS } from "@/constants";

interface Props {
  item: InterviewQuestion;
  isOpen: boolean;
  onToggle: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  accentBorder?: string;
}

export function QACard({
  item,
  isOpen,
  onToggle,
  onToggleFavorite,
  onEdit,
  onDelete,
  accentBorder = "border-primary/30",
}: Props) {
  const [openDepths, setOpenDepths] = useState<Set<string>>(new Set());
  const depths = item.answerDepths?.filter((d) => d.body.trim()) ?? [];

  const toggleDepth = (id: string) =>
    setOpenDepths((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const copyAll = () => {
    const parts = [`Q: ${item.question}`, `A: ${item.answer}`];
    depths.forEach((d) => parts.push(`\n[${d.label}]\n${d.body}`));
    navigator.clipboard.writeText(parts.join("\n\n"));
    toast.success("Copied Q&A");
  };

  return (
    <div
      className={`rounded-lg border transition-colors ${isOpen ? `${accentBorder} bg-card` : "border-border bg-card/50 hover:border-border/80"}`}
    >
      {/* Header row — always visible */}
      <button onClick={onToggle} className="w-full text-left p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${DIFF_COLORS[item.difficulty]}`}
            >
              {item.difficulty}
            </span>
            {item.category && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                {item.category}
              </span>
            )}
            {item.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] font-mono text-muted-foreground">
                #{t}
              </span>
            ))}
            {depths.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                +{depths.length} perspective{depths.length !== 1 ? "s" : ""}
              </span>
            )}
            {item.favorite && <Star className="size-3 text-accent fill-accent ml-auto" />}
          </div>
          <p className="text-sm font-medium leading-snug">{item.question}</p>
        </div>
        {isOpen ? (
          <ChevronUp className="size-4 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div className="border-t border-border">
          {/* Main answer */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Main answer
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {item.answer}
            </p>
          </div>

          {/* Depth sections */}
          {depths.map((depth, idx) => {
            const colorClass = DEPTH_COLORS[idx % DEPTH_COLORS.length];
            const open = openDepths.has(depth.id);
            return (
              <div
                key={depth.id}
                className={`mx-4 mb-2 rounded-lg border ${colorClass.split(" ").slice(0, 1).join("")} overflow-hidden`}
              >
                <button
                  onClick={() => toggleDepth(depth.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left"
                >
                  <ChevronRight
                    className={`size-3.5 shrink-0 transition-transform ${open ? "rotate-90" : ""} ${colorClass.split(" ")[2]}`}
                  />
                  <span
                    className={`text-[11px] font-mono font-semibold ${colorClass.split(" ")[2]}`}
                  >
                    {depth.label}
                  </span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {open ? "collapse" : "expand"}
                  </span>
                </button>
                {open && (
                  <div
                    className={`px-3 pb-3 border-t ${colorClass.split(" ")[0].replace("border-", "border-t-")}`}
                  >
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap pt-2">
                      {depth.body}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1 text-xs border border-border px-2.5 py-1 rounded hover:bg-muted transition-colors"
            >
              <Pencil className="size-3" /> Edit
            </button>
            <button
              onClick={copyAll}
              className="inline-flex items-center gap-1 text-xs border border-border px-2.5 py-1 rounded hover:bg-muted transition-colors"
            >
              <Copy className="size-3" /> Copy all
            </button>
            <button
              onClick={onToggleFavorite}
              className={`inline-flex items-center gap-1 text-xs border px-2.5 py-1 rounded transition-colors ${
                item.favorite
                  ? "border-accent/40 text-accent hover:bg-accent/10"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className={`size-3 ${item.favorite ? "fill-accent" : ""}`} />
              {item.favorite ? "Unstar" : "Star"}
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="ml-auto inline-flex items-center gap-1 text-xs border border-border px-2.5 py-1 rounded hover:bg-destructive/10 hover:border-destructive/30 text-muted-foreground transition-colors"
              >
                <Trash2 className="size-3" /> Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
