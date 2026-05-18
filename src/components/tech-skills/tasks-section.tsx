import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, ClipboardList } from "lucide-react";
import type { SkillAreaData } from "@/types/skills";
import { cn } from "@/lib/utils";

interface SkillTask {
  id: string;
  title: string;
  notes: string;
  done: boolean;
  createdAt: number;
}

function loadTasks(areaId: string): SkillTask[] {
  try { return JSON.parse(localStorage.getItem(`ds-skill-tasks-${areaId}`) ?? "[]"); }
  catch { return []; }
}
function saveTasks(areaId: string, tasks: SkillTask[]) {
  try {
    localStorage.setItem(`ds-skill-tasks-${areaId}`, JSON.stringify(tasks));
  } catch (err) {
    console.warn("[tasks-section] Failed to save tasks:", err);
  }
}

interface Props {
  data: SkillAreaData;
  triggerAdd?: number;
}

export function TasksSection({ data, triggerAdd }: Props) {
  const [tasks, setTasks] = useState<SkillTask[]>(() => loadTasks(data.id));
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setTasks(loadTasks(data.id));
  }, [data.id]);

  useEffect(() => {
    if (triggerAdd) { setShowForm(true); }
  }, [triggerAdd]);

  const persist = (next: SkillTask[]) => { setTasks(next); saveTasks(data.id, next); };

  const add = () => {
    if (!title.trim()) return;
    persist([
      ...tasks,
      { id: crypto.randomUUID(), title: title.trim(), notes: notes.trim(), done: false, createdAt: Date.now() },
    ]);
    setTitle(""); setNotes(""); setShowForm(false);
  };

  const toggle = (id: string) => persist(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => persist(tasks.filter(t => t.id !== id));

  const filtered = tasks.filter(t =>
    filter === "all" ? true : filter === "todo" ? !t.done : t.done
  );
  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">{data.label} Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {doneCount}/{tasks.length} completed
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 shadow-sm"
          >
            <Plus className="size-4" /> Add Task
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {(["all", "todo", "done"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border transition-all capitalize",
              filter === f
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") { setShowForm(false); setTitle(""); setNotes(""); } }}
            placeholder="Task title…"
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (optional)…"
            rows={2}
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={add}
              className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90"
            >
              Add
            </button>
            <button
              onClick={() => { setShowForm(false); setTitle(""); setNotes(""); }}
              className="px-4 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-sm">
          {filtered.map(task => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-4 group hover:bg-muted/30 transition-colors"
            >
              <button onClick={() => toggle(task.id)} className="mt-0.5 shrink-0">
                {task.done
                  ? <CheckCircle2 className="size-5 text-primary" />
                  : <Circle className="size-5 text-muted-foreground/40 hover:text-primary/60 transition-colors" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium leading-snug",
                  task.done && "line-through text-muted-foreground/60"
                )}>
                  {task.title}
                </p>
                {task.notes && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{task.notes}</p>
                )}
              </div>
              <button
                onClick={() => remove(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/10">
          <ClipboardList className="size-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {filter !== "all" ? `No ${filter} tasks` : "No tasks yet — add your first one"}
          </p>
          {filter === "all" && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Add a task
            </button>
          )}
        </div>
      )}
    </div>
  );
}
