import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays, Plus, CheckCircle2, Circle, Clock,
  LayoutGrid, Archive, ChevronDown, Sparkles,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { PlannerSidebar } from "@/components/planner/planner-sidebar";
import { TaskCard } from "@/components/planner/task-card";
import { AddTaskForm } from "@/components/planner/add-task-form";
import { EditTaskDialog } from "@/components/planner/edit-task-dialog";
import { AISuggestionsPanel } from "@/components/planner/ai-suggestions-panel";
import { OverviewPanel } from "@/components/planner/overview-panel";
import { getPlannerTasks, upsertPlannerTask, deletePlannerTask } from "@/lib/api/planner";
import type { PlannerTask, TaskStatus, TaskCategory } from "@/types/planner";
import {
  CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_SECTION_STYLES,
  DAILY_PARTS, getWeekTheme, normCategory,
} from "@/types/planner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SplitLayout } from "@/components/layout";
import { PageContainer, PageSection } from "@/components/layout";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
});

type Tab = "schedule" | "overview" | "backlog";

function toDateStr(d: Date) { return d.toISOString().slice(0, 10); }
function getWeekStart(d: Date) {
  const r = new Date(d);
  const day = r.getDay(); // 0=Sun … 6=Sat
  const diff = (day - 6 + 7) % 7; // days since last Saturday
  r.setDate(r.getDate() - diff);
  r.setHours(0, 0, 0, 0);
  return r;
}
function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function formatDayTitle(dateStr: string) {
  const d  = new Date(dateStr + "T00:00:00");
  const today    = toDateStr(new Date());
  const tomorrow = toDateStr(addDays(new Date(), 1));
  const yesterday= toDateStr(addDays(new Date(), -1));
  const label =
    dateStr === today ? "Today" :
    dateStr === tomorrow ? "Tomorrow" :
    dateStr === yesterday ? "Yesterday" : null;
  const weekday  = d.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel= d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return label ? `${label} — ${weekday}, ${dateLabel}` : `${weekday}, ${dateLabel}`;
}

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  todo: "in-progress", "in-progress": "done", done: "todo",
};

const TABS: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "overview", label: "Overview", icon: LayoutGrid  },
  { id: "backlog",  label: "Backlog",  icon: Archive     },
];

/* ─────────────────────────────────────────────────────── */

function SectionGroup({
  category,
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onAdd,
  date,
  activeId,
}: {
  category: TaskCategory;
  tasks: PlannerTask[];
  onToggle: (t: PlannerTask) => void;
  onDelete: (id: string) => void;
  onEdit: (t: PlannerTask) => void;
  onAdd: (t: Omit<PlannerTask, "id" | "createdAt" | "updatedAt">) => void;
  date: string;
  activeId: string | null;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const styles = CATEGORY_SECTION_STYLES[category];
  const done = tasks.filter((t) => t.status === "done").length;
  const pct  = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className={cn("rounded-2xl border overflow-hidden", styles.border)}>
      {/* Section header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors",
          styles.bg, "hover:brightness-[0.97]"
        )}
      >
        <span className="text-base">{CATEGORY_ICONS[category]}</span>
        <span className={cn("text-xs font-bold flex-1 text-left", styles.label)}>
          {CATEGORY_LABELS[category]}
        </span>
        {tasks.length > 0 && (
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", styles.labelBg, styles.label)}>
            {done}/{tasks.length}
          </span>
        )}
        {tasks.length > 0 && (
          <div className="w-16 h-1.5 rounded-full bg-black/10 overflow-hidden shrink-0">
            <div
              className={cn("h-full rounded-full transition-all", styles.label.replace("text-", "bg-"))}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
        <ChevronDown className={cn(
          "size-3.5 transition-transform shrink-0", styles.label,
          collapsed && "-rotate-90"
        )} />
      </button>

      {!collapsed && (
        <div className="p-2.5 pt-2 space-y-2">
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.length === 0 ? (
              <p className="text-[11px] text-muted-foreground/50 text-center py-3 italic">
                No {CATEGORY_LABELS[category].toLowerCase()} tasks yet
              </p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            )}
          </SortableContext>

          {showAdd ? (
            <AddTaskForm
              date={date}
              defaultCategory={category}
              onAdd={(t) => { onAdd(t); setShowAdd(false); }}
              onCancel={() => setShowAdd(false)}
              initialOpen
            />
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed text-[11px] font-medium transition-all",
                styles.border, styles.label, "opacity-60 hover:opacity-100 hover:brightness-95"
              )}
            >
              <Plus className="size-3.5" />
              Add {CATEGORY_LABELS[category].toLowerCase()} task
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */

export default function PlannerPage() {
  const [tab, setTab] = useState<Tab>("schedule");
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => toDateStr(new Date()));
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);
  const [activeTask, setActiveTask] = useState<PlannerTask | null>(null);

  const weekEnd = addDays(weekStart, 6);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPlannerTasks(toDateStr(weekStart), toDateStr(weekEnd));
      setTasks(data.map((t) => ({ ...t, category: normCategory(t.category) })));
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [weekStart.toISOString()]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAddTask = async (partial: Omit<PlannerTask, "id" | "createdAt" | "updatedAt">) => {
    const safeDate = partial.date && /^\d{4}-\d{2}-\d{2}$/.test(partial.date)
      ? partial.date
      : selectedDate;
    const withDate = { ...partial, date: safeDate };
    const tempId = crypto.randomUUID();
    const optimistic: PlannerTask = { ...withDate, id: tempId, createdAt: Date.now(), updatedAt: Date.now() };
    setTasks((prev) => [...prev, optimistic]);
    try {
      const saved = await upsertPlannerTask(withDate);
      setTasks((prev) => prev.map((t) => t.id === tempId ? { ...saved, category: normCategory(saved.category) } : t));
    } catch (e: any) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      toast.error(`Failed to add: ${e.message}`);
    }
  };

  const handleToggle = async (task: PlannerTask) => {
    const newStatus = STATUS_CYCLE[task.status];
    const updated = { ...task, status: newStatus, updatedAt: Date.now() };
    setTasks((prev) => prev.map((t) => t.id === task.id ? updated : t));
    try { await upsertPlannerTask(updated); }
    catch (e: any) {
      setTasks((prev) => prev.map((t) => t.id === task.id ? task : t));
      toast.error(`Failed to update: ${e.message}`);
    }
  };

  const handleSaveEdit = async (task: PlannerTask) => {
    const previous = tasks.find((t) => t.id === task.id);
    const normalized = { ...task, category: normCategory(task.category) };
    setTasks((prev) => prev.map((t) => t.id === task.id ? normalized : t));
    setEditingTask(null);
    try { await upsertPlannerTask(normalized); toast.success("Task updated"); }
    catch (e: any) {
      if (previous) setTasks((prev) => prev.map((t) => t.id === task.id ? previous : t));
      toast.error(`Failed to save: ${e.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try { await deletePlannerTask(id); toast.success("Task deleted"); }
    catch (e: any) { setTasks(previous); toast.error(`Failed to delete: ${e.message}`); }
  };

  /* ── Seed ── */
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/planner/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ month: selectedDate.slice(0, 7), clear: false }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { count } = await res.json();
      toast.success(`Seeded ${count} sample tasks for this month!`);
      await fetchTasks();
    } catch (e: any) {
      toast.error(`Seed failed: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  /* ── DnD ── */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeT = tasks.find((t) => t.id === active.id);
    const overT   = tasks.find((t) => t.id === over.id);
    if (!activeT || !overT || activeT.category !== overT.category) return;

    const sectionTasks = tasks
      .filter((t) => t.date === selectedDate && t.category === activeT.category)
      .sort((a, b) => a.order - b.order);
    const oldIdx = sectionTasks.findIndex((t) => t.id === active.id);
    const newIdx = sectionTasks.findIndex((t) => t.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(sectionTasks, oldIdx, newIdx).map((t, i) => ({ ...t, order: i }));
    setTasks((prev) => {
      const others = prev.filter((t) => !(t.date === selectedDate && t.category === activeT.category));
      return [...others, ...reordered];
    });
    try { await Promise.all(reordered.map((t) => upsertPlannerTask(t))); }
    catch { toast.error("Failed to save order"); fetchTasks(); }
  };

  const handlePrevWeek  = () => setWeekStart((w) => addDays(w, -7));
  const handleNextWeek  = () => setWeekStart((w) => addDays(w, 7));
  const handleToday     = () => {
    const today = new Date();
    setSelectedDate(toDateStr(today));
    setWeekStart(getWeekStart(today));
  };
  const handleSelectDate = (date: string) => {
    setSelectedDate(date); setTab("schedule");
  };

  /* ── Derived data ── */
  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const bySection = (cat: TaskCategory) =>
    dayTasks.filter((t) => t.category === cat).sort((a, b) => a.order - b.order);

  const backlogTasks = tasks.filter((t) => !t.date || t.date === "");
  const totalCount   = dayTasks.length;
  const doneCount    = dayTasks.filter((t) => t.status === "done").length;
  const completionPct= totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const weekTheme = getWeekTheme(selectedDate);

  /* ── Sidebar ── */
  const plannerSidebar = (
    <PlannerSidebar
      selectedDate={selectedDate}
      weekStart={weekStart}
      tasks={tasks}
      onSelectDate={handleSelectDate}
      onPrevWeek={handlePrevWeek}
      onNextWeek={handleNextWeek}
      onToday={handleToday}
      onAddTask={() => setTab("schedule")}
      weekTheme={weekTheme}
    />
  );

  return (
    <PageContainer>
      {/* ── Header ── */}
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="size-9 sm:size-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <CalendarDays className="size-[18px] sm:size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-0.5">Workspace</p>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight">Planner</h1>
          </div>

          <nav className="hidden sm:flex items-center gap-1 p-1 bg-muted/40 rounded-xl border border-border/50 ml-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              const badge  = t.id === "backlog" ? backlogTasks.length : undefined;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    active
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <Icon className={cn("size-3.5 shrink-0", active && "text-primary")} />
                  {t.label}
                  {badge != null && badge > 0 && (
                    <span className={cn(
                      "min-w-[16px] text-center text-[10px] leading-none px-1 py-0.5 rounded-full",
                      active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    )}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {dayTasks.length === 0 && !loading && tab === "schedule" && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
              >
                <Sparkles className="size-3.5" />
                {seeding ? "Seeding…" : "Seed sample month"}
              </button>
            )}
            <button
              onClick={() => setTab("schedule")}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 active:scale-[0.97] transition-all shadow-sm shrink-0"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden mt-3 flex gap-1 p-1 bg-muted/40 rounded-xl border border-border/50">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                  active
                    ? "bg-background text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-3.5 shrink-0", active && "text-primary")} />
                {t.label}
              </button>
            );
          })}
        </div>
      </PageSection>

      {/* ── Main ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <SplitLayout sidebar={plannerSidebar} sidebarWidth="lg:w-[260px]">

          {/* ── SCHEDULE ── */}
          {tab === "schedule" && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Day header */}
              <div className="shrink-0 px-4 sm:px-5 pt-3.5 pb-3 border-b border-border/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold tracking-tight">{formatDayTitle(selectedDate)}</h2>

                    {/* Week theme badge */}
                    <div className={cn(
                      "inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold",
                      weekTheme.color
                    )}>
                      <span>{weekTheme.icon}</span>
                      <span>W{weekTheme.week}: {weekTheme.title}</span>
                    </div>

                    {/* Progress row */}
                    {totalCount > 0 && (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle2 className="size-3.5" />{doneCount} done
                        </span>
                        {dayTasks.filter((t) => t.status === "in-progress").length > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-primary font-medium">
                            <Clock className="size-3.5" />
                            {dayTasks.filter((t) => t.status === "in-progress").length} active
                          </span>
                        )}
                        {dayTasks.filter((t) => t.status === "todo").length > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Circle className="size-3.5" />
                            {dayTasks.filter((t) => t.status === "todo").length} todo
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {totalCount > 0 && (
                    <div className="shrink-0 relative size-11">
                      <svg className="size-11 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-muted/60" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3.5"
                          strokeDasharray={`${completionPct * 0.879} 87.9`} strokeLinecap="round"
                          className="text-primary transition-all duration-500" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary">
                        {completionPct}%
                      </span>
                    </div>
                  )}
                </div>

                {totalCount > 0 && (
                  <div className="mt-2.5 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${completionPct}%` }} />
                  </div>
                )}
              </div>

              {/* 3-section task list */}
              <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-3 space-y-3">
                {loading ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs text-muted-foreground">Loading tasks…</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    {DAILY_PARTS.map((cat) => (
                      <SectionGroup
                        key={cat}
                        category={cat}
                        tasks={bySection(cat)}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={setEditingTask}
                        onAdd={handleAddTask}
                        date={selectedDate}
                        activeId={activeTask?.id ?? null}
                      />
                    ))}

                    <DragOverlay>
                      {activeTask && (
                        <TaskCard
                          task={activeTask}
                          onToggle={() => {}}
                          onDelete={() => {}}
                          onEdit={() => {}}
                          dragOverlay
                        />
                      )}
                    </DragOverlay>
                  </DndContext>
                )}

                {!loading && totalCount === 0 && (
                  <div className="pt-4 text-center space-y-3">
                    <p className="text-xs text-muted-foreground">No tasks yet for this day.</p>
                    {dayTasks.length === 0 && (
                      <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
                      >
                        <Sparkles className="size-3.5" />
                        {seeding ? "Seeding…" : "Seed sample month data"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pinned bottom AI */}
              <div className="shrink-0 border-t border-border/50 px-4 sm:px-5 py-3">
                {!loading && (
                  <AISuggestionsPanel date={selectedDate} tasks={dayTasks} />
                )}
              </div>
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <OverviewPanel tasks={tasks} weekStart={weekStart} />
          )}

          {/* ── BACKLOG ── */}
          {tab === "backlog" && (
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold">Backlog</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Tasks without a scheduled date</p>
              </div>
              <AddTaskForm key="backlog-add" date={selectedDate} onAdd={handleAddTask} />
              {backlogTasks.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Archive className="size-10 text-muted-foreground/20 mx-auto" />
                  <p className="text-sm font-semibold text-muted-foreground">Backlog is empty</p>
                  <p className="text-xs text-muted-foreground/50">Tasks without a date appear here</p>
                </div>
              ) : (
                backlogTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={setEditingTask} />
                ))
              )}
            </div>
          )}

        </SplitLayout>
      </div>

      <EditTaskDialog task={editingTask} onSave={handleSaveEdit} onClose={() => setEditingTask(null)} />
    </PageContainer>
  );
}
