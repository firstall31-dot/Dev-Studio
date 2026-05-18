import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Scenario } from "@/constants";

interface ScenarioFormProps {
  initial?: Partial<Scenario>;
  onSave: (data: Omit<Scenario, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export function ScenarioForm({ initial, onSave, onCancel }: ScenarioFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    situation: initial?.situation ?? "",
    task: initial?.task ?? "",
    action: initial?.action ?? "",
    result: initial?.result ?? "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.title.trim().length > 0 && form.action.trim().length > 0;

  const FIELDS: { key: keyof typeof form; label: string; abbr: string; placeholder: string; color: string }[] = [
    { key: "situation", abbr: "S", label: "Situation",  color: "text-blue-400",   placeholder: "What was the context? Set the scene briefly." },
    { key: "task",      abbr: "T", label: "Task",       color: "text-amber-400",  placeholder: "What was your responsibility or goal?" },
    { key: "action",    abbr: "A", label: "Action",     color: "text-primary",    placeholder: "What exactly did YOU do? Be specific — this is the most important part." },
    { key: "result",    abbr: "R", label: "Result",     color: "text-emerald-400",placeholder: "What was the measurable or concrete outcome?" },
  ];

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">
          Scenario Title
        </label>
        <input
          autoFocus
          value={form.title}
          onChange={set("title")}
          placeholder="e.g., Led migration to microservices at Acme Co."
          className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all"
        />
      </div>
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest mb-1">
            <span className={cn("font-bold", f.color)}>{f.abbr}</span>
            <span className="text-muted-foreground">{f.label}</span>
          </label>
          <textarea
            rows={2}
            value={form[f.key]}
            onChange={set(f.key)}
            placeholder={f.placeholder}
            className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 resize-none transition-all"
          />
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all">
          <X className="size-3" /> Cancel
        </button>
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
            valid ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          <Check className="size-3" /> Save Scenario
        </button>
      </div>
    </div>
  );
}
