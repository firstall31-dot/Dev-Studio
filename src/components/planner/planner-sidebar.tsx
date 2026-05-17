import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, TrendingUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerTask } from "@/types/planner";
import { WEEK_THEMES, getWeekTheme, CATEGORY_ICONS, CATEGORY_LABELS } from "@/types/planner";

interface PlannerSidebarProps {
  selectedDate: string;
  weekStart: Date;
  tasks: PlannerTask[];
  onSelectDate: (date: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onAddTask: () => void;
  weekTheme?: ReturnType<typeof getWeekTheme>;
  extraBottom?: ReactNode;
}

function toDateStr(d: Date): string { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

const DAY_NAMES  = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function PlannerSidebar({
  selectedDate,
  weekStart,
  tasks,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onToday,
  weekTheme,
  extraBottom,
}: PlannerSidebarProps) {
  const today   = toDateStr(new Date());
  const weekEnd = addDays(weekStart, 6);
  const [showThemes, setShowThemes] = useState(false);
  const weekLabel = `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} – ${
    weekStart.getMonth() !== weekEnd.getMonth() ? MONTH_NAMES[weekEnd.getMonth()] + " " : ""
  }${weekEnd.getDate()}`;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d   = addDays(weekStart, i);
    const str = toDateStr(d);
    const dayTasks = tasks.filter((t) => t.date === str);
    return {
      str, dayName: DAY_NAMES[i], dayNum: d.getDate(),
      total: dayTasks.length,
      done:  dayTasks.filter((t) => t.status === "done").length,
      isToday: str === today,
      isSelected: str === selectedDate,
      isWeekend: i === 0 || i === 1, // Sat & Sun
    };
  });

  const weekTasks   = tasks.filter((t) => t.date >= toDateStr(weekStart) && t.date <= toDateStr(weekEnd));
  const weekTotal   = weekTasks.length;
  const weekDone    = weekTasks.filter((t) => t.status === "done").length;
  const weekPct     = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const currentTheme = weekTheme ?? getWeekTheme(selectedDate);

  return (
    <div className="flex flex-col h-full bg-muted/20 border-r border-border/50">

      {/* ── Week navigator ── */}
      <div className="px-2.5 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 mb-3">
          <button
            onClick={onToday}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Today
          </button>
          <span className="flex-1 text-center text-[11px] font-semibold text-foreground/70">{weekLabel}</span>
          <div className="flex gap-0.5">
            <button
              onClick={onPrevWeek}
              className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              onClick={onNextWeek}
              className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Week day pills */}
        <div className="grid grid-cols-7 gap-0.5">
          {weekDays.map((d) => (
            <button
              key={d.str}
              onClick={() => onSelectDate(d.str)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all text-center",
                d.isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : d.isToday
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : d.isWeekend
                  ? "text-muted-foreground/60 hover:bg-muted/60"
                  : "text-foreground hover:bg-muted/60"
              )}
            >
              <span className={cn(
                "text-[9px] font-medium uppercase tracking-wide",
                d.isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {d.dayName}
              </span>
              <span className="text-[13px] font-bold leading-none">{d.dayNum}</span>
              {d.total > 0 && (
                <div className={cn(
                  "flex gap-0.5 items-center mt-0.5",
                )}>
                  {d.done > 0 && d.done === d.total ? (
                    <span className={cn(
                      "size-1.5 rounded-full",
                      d.isSelected ? "bg-primary-foreground/60" : "bg-emerald-500"
                    )} />
                  ) : (
                    <span className={cn(
                      "size-1.5 rounded-full",
                      d.isSelected ? "bg-primary-foreground/40" : "bg-muted-foreground/40"
                    )} />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Weekly theme card ── */}
      <div className="px-2.5 py-2 shrink-0">
        <button
          onClick={() => setShowThemes((v) => !v)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all",
            currentTheme.color
          )}
        >
          <span className="text-lg shrink-0">{currentTheme.icon}</span>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[11px] font-bold leading-tight">{currentTheme.title}</p>
            <p className="text-[10px] opacity-70 leading-tight mt-0.5">{currentTheme.subtitle}</p>
          </div>
          <ChevronDown className={cn(
            "size-3.5 shrink-0 opacity-60 transition-transform",
            showThemes && "rotate-180"
          )} />
        </button>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1 px-1 mt-1.5">
          {currentTheme.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "text-[9px] font-semibold px-1.5 py-0.5 rounded-md border opacity-70",
                currentTheme.color
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Month overview of all 4 weeks */}
        {showThemes && (
          <div className="mt-2 space-y-1">
            {WEEK_THEMES.map((theme) => (
              <div
                key={theme.week}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-2 rounded-xl border text-[11px]",
                  theme.week === currentTheme.week
                    ? cn(theme.color, "font-bold")
                    : "border-border/40 text-muted-foreground"
                )}
              >
                <span className="text-sm">{theme.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold leading-tight">W{theme.week}: {theme.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Daily parts legend ── */}
      <div className="px-2.5 py-1 shrink-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 px-1 mb-1.5">
          Daily Structure
        </p>
        <div className="space-y-0.5">
          {(["activities", "work", "learning"] as const).map((cat) => {
            const dayT = tasks.filter((t) => t.date === selectedDate && t.category === cat);
            const done = dayT.filter((t) => t.status === "done").length;
            return (
              <div key={cat} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                <span className="text-sm">{CATEGORY_ICONS[cat]}</span>
                <span className="text-[11px] font-medium text-muted-foreground flex-1">
                  {CATEGORY_LABELS[cat]}
                </span>
                {dayT.length > 0 ? (
                  <span className="text-[10px] font-semibold text-muted-foreground/70">
                    {done}/{dayT.length}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground/30">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1 min-h-0" />

      {/* ── Week progress ── */}
      <div className="px-2.5 py-2 shrink-0">
        <div className="px-3 py-2.5 rounded-xl bg-muted/40 border border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-3.5 text-primary" />
            <span className="text-[11px] font-semibold">Week progress</span>
            <span className="ml-auto text-[10px] font-bold text-primary">{weekPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${weekPct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {weekDone} of {weekTotal} tasks complete
          </p>
        </div>
      </div>

      {/* ── Extra bottom (prayer times, etc.) ── */}
      <div className="px-2.5 pb-2.5 shrink-0 space-y-2">
        {extraBottom}
      </div>

    </div>
  );
}
