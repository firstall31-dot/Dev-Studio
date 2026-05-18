import { useState, useRef, useEffect } from "react";
import { Plus, X, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerTask, TaskPriority, TaskCategory } from "@/types/planner";
import { CATEGORY_LABELS, CATEGORY_ICON_COMPONENTS, CATEGORY_COLORS, DAILY_PARTS, TASK_PRIORITY_OPTIONS as PRIORITIES, TASK_TIME_OPTIONS as TIME_OPTIONS } from "@/constants/planner";
import { formatMinutes } from "@/lib/utils/planner";

interface AddTaskFormProps {
  date: string;
  defaultCategory?: TaskCategory;
  onAdd: (task: Omit<PlannerTask, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
  initialOpen?: boolean;
}


export function AddTaskForm({
  date,
  defaultCategory = "work",
  onAdd,
  onCancel,
  initialOpen = false,
}: AddTaskFormProps) {
  const [open, setOpen] = useState(initialOpen);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<TaskCategory>(defaultCategory);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const catRef  = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && titleRef.current) setTimeout(() => titleRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (catRef.current  && !catRef.current.contains(e.target as Node))  setShowCatPicker(false);
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setShowTimePicker(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const reset = () => {
    setTitle(""); setDescription(""); setPriority("medium");
    setCategory(defaultCategory); setEstimatedMinutes(undefined);
    setOpen(false); setShowCatPicker(false); setShowTimePicker(false);
    onCancel?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      date, title: title.trim(),
      description: description.trim() || undefined,
      priority, status: "todo", category,
      estimatedMinutes,
      order: Date.now(),
    });
    setTitle(""); setDescription("");
    setPriority("medium"); setCategory(defaultCategory);
    setEstimatedMinutes(undefined);
    setOpen(false);
  };

  if (!open) {
    const DefIcon = CATEGORY_ICON_COMPONENTS[defaultCategory];
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all text-sm group"
      >
        <div className="size-5 rounded-full bg-muted/60 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
          <Plus className="size-3 group-hover:text-primary" />
        </div>
        <span className="text-xs">Add a task…</span>
        {defaultCategory !== "general" && (
          <span className={cn("ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1", CATEGORY_COLORS[defaultCategory])}>
            <DefIcon className="size-3" />
            {CATEGORY_LABELS[defaultCategory]}
          </span>
        )}
      </button>
    );
  }

  const SelIcon = CATEGORY_ICON_COMPONENTS[category];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/5 to-transparent p-4 space-y-3 shadow-sm"
    >
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={120}
        onKeyDown={(e) => e.key === "Escape" && reset()}
        className="w-full bg-background/80 border border-input rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 placeholder:text-muted-foreground/40 transition-all"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a note (optional)"
        maxLength={200}
        className="w-full bg-background/60 border border-input/60 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-muted-foreground/35 transition-all"
      />

      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority pills */}
        <div className="flex items-center gap-1 bg-muted/40 rounded-xl p-1">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all",
                priority === p.value
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn("size-1.5 rounded-full shrink-0", p.dot)} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Category picker */}
        <div className="relative" ref={catRef}>
          <button
            type="button"
            onClick={() => { setShowCatPicker((v) => !v); setShowTimePicker(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted/40 border border-border/40 hover:bg-muted/60 text-[11px] font-medium transition-all text-foreground"
          >
            <SelIcon className="size-3.5" />
            <span>{CATEGORY_LABELS[category]}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
          {showCatPicker && (
            <div className="absolute top-full left-0 mt-1.5 z-50 bg-popover border border-border rounded-2xl shadow-lg overflow-hidden p-1 w-44">
              {DAILY_PARTS.map((c) => {
                const CIcon = CATEGORY_ICON_COMPONENTS[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCategory(c); setShowCatPicker(false); }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left",
                      category === c
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/60 text-foreground"
                    )}
                  >
                    <CIcon className="size-4" />
                    <div>
                      <p className="font-semibold">{CATEGORY_LABELS[c]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Time estimate */}
        <div className="relative" ref={timeRef}>
          <button
            type="button"
            onClick={() => { setShowTimePicker((v) => !v); setShowCatPicker(false); }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all",
              estimatedMinutes
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-muted/40 border-border/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="size-3" />
            {estimatedMinutes ? formatMinutes(estimatedMinutes) : "Estimate"}
          </button>
          {showTimePicker && (
            <div className="absolute top-full left-0 mt-1.5 z-50 bg-popover border border-border rounded-2xl shadow-lg overflow-hidden p-1.5 w-36">
              <button
                type="button"
                onClick={() => { setEstimatedMinutes(undefined); setShowTimePicker(false); }}
                className={cn(
                  "w-full px-3 py-1.5 rounded-xl text-xs font-medium transition-colors text-left",
                  !estimatedMinutes ? "bg-primary/10 text-primary" : "hover:bg-muted/60 text-muted-foreground"
                )}
              >
                No estimate
              </button>
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setEstimatedMinutes(t.value); setShowTimePicker(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 rounded-xl text-xs font-medium transition-colors text-left",
                    estimatedMinutes === t.value
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/60 text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={reset}
          className="size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border/40"
        >
          <X className="size-4" />
        </button>
      </div>
    </form>
  );
}
