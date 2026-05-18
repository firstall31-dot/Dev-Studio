import { Check, Trash2, ChevronRight, Clock, Pencil, GripVertical } from "lucide-react";
import type { PlannerTask } from "@/types/planner";
import { PRIORITY_COLORS, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICON_COMPONENTS } from "@/constants/planner";
import { formatMinutes } from "@/lib/utils/planner";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: PlannerTask;
  onToggle: (task: PlannerTask) => void;
  onDelete: (id: string) => void;
  onEdit: (task: PlannerTask) => void;
  dragOverlay?: boolean;
}

const STATUS_CONFIG = {
  todo: {
    ring: "border-border hover:border-primary/50",
    bg: "hover:bg-muted/50 border-border/60",
    check: null,
    label: null,
  },
  "in-progress": {
    ring: "border-primary/60 bg-primary/10",
    bg: "bg-primary/5 border-primary/20",
    check: <ChevronRight className="size-3 text-primary" strokeWidth={3} />,
    label: "In progress",
  },
  done: {
    ring: "bg-primary border-primary",
    bg: "bg-muted/20 border-border/40",
    check: <Check className="size-3 text-primary-foreground" strokeWidth={3} />,
    label: null,
  },
};

export function TaskCard({ task, onToggle, onDelete, onEdit, dragOverlay }: TaskCardProps) {
  const isDone = task.status === "done";
  const isInProgress = task.status === "in-progress";
  const cfg = STATUS_CONFIG[task.status];
  const CatIcon = CATEGORY_ICON_COMPONENTS[task.category];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200",
        cfg.bg,
        isDone && "opacity-55",
        isDragging && "opacity-40 scale-[0.98]",
        dragOverlay && "shadow-xl ring-2 ring-primary/20 rotate-1 opacity-100"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 shrink-0 size-5 flex items-center justify-center text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors touch-none"
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-3.5" />
      </button>

      {/* Status toggle button */}
      <button
        onClick={() => onToggle(task)}
        title="Cycle status"
        className={cn(
          "mt-0.5 shrink-0 size-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
          cfg.ring
        )}
      >
        {cfg.check}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <button onClick={() => onEdit(task)} className="w-full text-left group/title">
          <p className={cn(
            "text-sm font-medium leading-snug group-hover/title:text-primary transition-colors",
            isDone && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          {task.description && !isDone && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">
              {task.description}
            </p>
          )}
        </button>

        {/* Meta row */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-md border capitalize",
            PRIORITY_COLORS[task.priority]
          )}>
            {task.priority}
          </span>

          <span className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1",
            CATEGORY_COLORS[task.category]
          )}>
            <CatIcon className="size-3" />
            {CATEGORY_LABELS[task.category]}
          </span>

          {task.estimatedMinutes && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="size-3" />
              {formatMinutes(task.estimatedMinutes)}
            </span>
          )}

          {isInProgress && (
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
              ● In progress
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="size-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="size-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
