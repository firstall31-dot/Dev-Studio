import { useState } from "react";
import { Edit3, Trash2, ChevronUp, ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Scenario } from "@/constants";

interface ScenarioCardProps {
  scenario: Scenario;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScenarioCard({ scenario, onEdit, onDelete }: ScenarioCardProps) {
  const [expanded, setExpanded] = useState(false);

  const ROWS: { abbr: string; label: string; value: string; color: string }[] = [
    { abbr: "S", label: "Situation", value: scenario.situation, color: "text-blue-400" },
    { abbr: "T", label: "Task",      value: scenario.task,      color: "text-amber-400" },
    { abbr: "A", label: "Action",    value: scenario.action,    color: "text-primary" },
    { abbr: "R", label: "Result",    value: scenario.result,    color: "text-emerald-400" },
  ].filter((r) => r.value.trim());

  return (
    <div className="rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between gap-2 p-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0 mt-0.5">
            <Star className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug truncate">{scenario.title}</p>
            {!expanded && scenario.action && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{scenario.action}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all" title="Edit">
            <Edit3 className="size-3" />
          </button>
          <button onClick={onDelete} className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all" title="Delete">
            <Trash2 className="size-3" />
          </button>
          <button onClick={() => setExpanded((e) => !e)} className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all">
            {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
          {ROWS.map((r) => (
            <div key={r.abbr}>
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest mb-1">
                <span className={cn("font-bold", r.color)}>{r.abbr}</span>
                <span className="text-muted-foreground">{r.label}</span>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
