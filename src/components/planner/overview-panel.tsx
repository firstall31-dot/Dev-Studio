import { CheckCircle2, Circle, Clock, TrendingUp, Flame, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerTask } from "@/types/planner";
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/planner";

interface OverviewPanelProps {
  tasks: PlannerTask[];
  weekStart: Date;
}

const DAY_NAMES = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function OverviewPanel({ tasks, weekStart }: OverviewPanelProps) {
  const today = toDateStr(new Date());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    const dateStr = toDateStr(d);
    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const done = dayTasks.filter((t) => t.status === "done").length;
    const inProgress = dayTasks.filter((t) => t.status === "in-progress").length;
    return { d, dateStr, dayTasks, done, inProgress, name: DAY_NAMES[i] };
  });

  const totalTasks = tasks.length;
  const totalDone = tasks.filter((t) => t.status === "done").length;
  const totalInProgress = tasks.filter((t) => t.status === "in-progress").length;
  const totalTodo = tasks.filter((t) => t.status === "todo").length;
  const completionRate = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "done").length;
  const todayTasks = tasks.filter((t) => t.date === today);
  const todayDone = todayTasks.filter((t) => t.status === "done").length;

  const categoryBreakdown = (Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const catDone = catTasks.filter((t) => t.status === "done").length;
    return { cat, total: catTasks.length, done: catDone };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const stats = [
    { label: "Total", value: totalTasks, icon: Circle, color: "text-foreground", bg: "bg-muted/60" },
    { label: "Done", value: totalDone, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active", value: totalInProgress, icon: Clock, color: "text-primary", bg: "bg-primary/10" },
    { label: "Todo", value: totalTodo, icon: Target, color: "text-muted-foreground", bg: "bg-muted/60" },
  ];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6">
      <div className="space-y-5">

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border/60 p-4 flex flex-col items-center gap-1.5">
              <div className={cn("size-9 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("size-4.5", s.color)} />
              </div>
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Completion bar */}
        <div className="rounded-2xl bg-card border border-border/60 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <p className="text-sm font-semibold">Week Completion</p>
            </div>
            <span className="text-sm font-mono font-bold text-primary">{completionRate}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-xs text-muted-foreground">{totalDone} of {totalTasks} tasks completed</p>
            {highPriority > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                <Flame className="size-3" />
                {highPriority} high priority
              </div>
            )}
          </div>
        </div>

        {/* Today spotlight */}
        {todayTasks.length > 0 && (
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Today</p>
              <span className="text-xs font-mono font-semibold text-primary">{todayDone}/{todayTasks.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-primary/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${todayTasks.length > 0 ? Math.round((todayDone / todayTasks.length) * 100) : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Daily bars */}
        <div className="rounded-2xl bg-card border border-border/60 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Daily Breakdown
          </p>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(({ d, dateStr, dayTasks, done, name }) => {
              const total = dayTasks.length;
              const pct = total > 0 ? done / total : 0;
              const isToday = dateStr === today;

              return (
                <div key={dateStr} className="flex flex-col items-center gap-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground">{name}</p>
                  <div className="w-full h-20 rounded-xl bg-muted/50 relative overflow-hidden">
                    {total > 0 && (
                      <div
                        className={cn(
                          "absolute bottom-0 left-0 right-0 rounded-xl transition-all duration-500",
                          isToday ? "bg-primary" : "bg-primary/50"
                        )}
                        style={{ height: `${Math.max(pct * 100, 8)}%` }}
                      />
                    )}
                    {isToday && (
                      <div className="absolute inset-0 border-2 border-primary rounded-xl" />
                    )}
                    {total === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] text-muted-foreground/40 font-medium">–</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">{done}/{total}</p>
                  <p className={cn(
                    "text-[10px] font-bold",
                    isToday ? "text-primary" : "text-muted-foreground"
                  )}>
                    {d.getDate()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="rounded-2xl bg-card border border-border/60 p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              By Category
            </p>
            <div className="space-y-3">
              {categoryBreakdown.map(({ cat, total, done }) => {
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <div className={cn(
                      "text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 shrink-0 w-28",
                      CATEGORY_COLORS[cat]
                    )}>
                      <span className="text-[12px]">{CATEGORY_ICONS[cat]}</span>
                      {CATEGORY_LABELS[cat]}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-10 text-right shrink-0">
                      {done}/{total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {totalTasks === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <TrendingUp className="size-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No tasks this week yet</p>
            <p className="text-xs mt-1 opacity-60">Add tasks from the Schedule tab to track your progress here</p>
          </div>
        )}
      </div>
    </div>
  );
}
