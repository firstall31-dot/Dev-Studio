import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerTask, TaskPriority, TaskStatus, TaskCategory } from "@/types/planner";
import { TASK_PRIORITIES as PRIORITIES, TASK_STATUSES as STATUSES, TASK_CATEGORIES as CATEGORIES, PRIORITY_CLASSES, STATUS_CLASSES, CATEGORY_LABELS } from "@/constants/planner";

interface EditTaskDialogProps {
  task: PlannerTask | null;
  onSave: (task: PlannerTask) => void;
  onClose: () => void;
}


export function EditTaskDialog({ task, onSave, onClose }: EditTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [category, setCategory] = useState<TaskCategory>("general");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setCategory(task.category);
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      category,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-background border border-border shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-semibold">Edit Task</h2>
          <button onClick={onClose} className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full bg-background border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full bg-background border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 resize-none"
              placeholder="Optional notes…"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={cn("px-2.5 py-1 rounded-lg text-xs font-medium border capitalize transition-all",
                    status === s ? STATUS_CLASSES[s] : "bg-muted/40 text-muted-foreground border-transparent hover:border-border"
                  )}>
                  {s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priority</label>
            <div className="flex gap-1.5">
              {PRIORITIES.map((p) => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className={cn("px-2.5 py-1 rounded-lg text-xs font-medium border capitalize transition-all",
                    priority === p ? PRIORITY_CLASSES[p] : "bg-muted/40 text-muted-foreground border-transparent hover:border-border"
                  )}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="mt-1 w-full bg-background border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!title.trim()}
              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
