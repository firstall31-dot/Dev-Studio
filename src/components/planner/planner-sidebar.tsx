import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, TrendingUp, ChevronDown,
  Search, X, Pencil, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerTask } from "@/types/planner";
import { WEEK_THEMES, getWeekTheme, CATEGORY_ICON_COMPONENTS, CATEGORY_LABELS } from "@/types/planner";
import { toDateStr, addDays } from "@/lib/planner-utils";

type StatusFilter = "all" | "todo" | "in-progress" | "done";

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
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (f: StatusFilter) => void;
  extraBottom?: ReactNode;
}

const DAY_NAMES   = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ACHV_KEY = "ds-week-achievements";
function loadAchievements(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(ACHV_KEY) ?? "{}"); } catch { return {}; }
}
function saveAchievements(map: Record<string, string>) {
  try { localStorage.setItem(ACHV_KEY, JSON.stringify(map)); } catch {}
}

const STATUS_FILTERS: { id: StatusFilter; label: string; color: string }[] = [
  { id: "all",         label: "All",    color: "text-foreground" },
  { id: "todo",        label: "Todo",   color: "text-muted-foreground" },
  { id: "in-progress", label: "Active", color: "text-primary" },
  { id: "done",        label: "Done",   color: "text-emerald-600" },
];

export function PlannerSidebar({
  selectedDate,
  weekStart,
  tasks,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onToday,
  weekTheme,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  extraBottom,
}: PlannerSidebarProps) {
  const today   = toDateStr(new Date());
  const weekEnd = addDays(weekStart, 6);
  const [showThemes,      setShowThemes]      = useState(false);
  const [editingAchv,     setEditingAchv]     = useState(false);
  const [achievements,    setAchievements]    = useState<Record<string, string>>(loadAchievements);
  const achvRef = useRef<HTMLTextAreaElement>(null);

  const weekKey   = toDateStr(weekStart);
  const achvText  = achievements[weekKey] ?? "";

  const weekLabel = `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} – ${
    weekStart.getMonth() !== weekEnd.getMonth() ? MONTH_NAMES[weekEnd.getMonth()] + " " : ""
  }${weekEnd.getDate()}`;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d       = addDays(weekStart, i);
    const str     = toDateStr(d);
    const dayTasks = tasks.filter((t) => t.date === str);
    return {
      str, dayName: DAY_NAMES[i], dayNum: d.getDate(),
      total: dayTasks.length,
      done:  dayTasks.filter((t) => t.status === "done").length,
      isToday:    str === today,
      isSelected: str === selectedDate,
      isWeekend:  i === 0 || i === 1,
    };
  });

  const weekTasks = tasks.filter((t) => t.date >= toDateStr(weekStart) && t.date <= toDateStr(weekEnd));
  const weekTotal = weekTasks.length;
  const weekDone  = weekTasks.filter((t) => t.status === "done").length;
  const weekPct   = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const currentTheme = weekTheme ?? getWeekTheme(selectedDate);

  const handleAchvChange = (val: string) => {
    const updated = { ...achievements, [weekKey]: val };
    setAchievements(updated);
    saveAchievements(updated);
  };

  useEffect(() => {
    if (editingAchv) achvRef.current?.focus();
  }, [editingAchv]);

  return (
    <div className="flex flex-col h-full bg-muted/20 border-r border-border/50 overflow-hidden">

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">

      {/* ── Search + filter ── */}
      <div className="px-2.5 pt-3 pb-1 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks…"
            className="w-full h-8 pl-8 pr-7 text-xs rounded-xl bg-background border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onStatusFilterChange(f.id)}
              className={cn(
                "flex-1 text-[10px] font-semibold py-1 rounded-lg border transition-all",
                statusFilter === f.id
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "border-border/40 text-muted-foreground hover:border-border/60 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Week navigator ── */}
      <div className="px-2.5 pt-2 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 mb-2.5">
          <button
            onClick={onToday}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Today
          </button>
          <span className="flex-1 text-center text-[11px] font-semibold text-foreground/70">{weekLabel}</span>
          <div className="flex gap-0.5">
            <button onClick={onPrevWeek} className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ChevronLeft className="size-3.5" />
            </button>
            <button onClick={onNextWeek} className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Day pills */}
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
              <span className={cn("text-[9px] font-medium uppercase tracking-wide", d.isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {d.dayName}
              </span>
              <span className="text-[13px] font-bold leading-none">{d.dayNum}</span>
              {d.total > 0 && (
                <span className={cn(
                  "size-1.5 rounded-full mt-0.5",
                  d.done === d.total
                    ? d.isSelected ? "bg-primary-foreground/60" : "bg-emerald-500"
                    : d.isSelected ? "bg-primary-foreground/40" : "bg-muted-foreground/40"
                )} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Weekly theme card ── */}
      <div className="px-2.5 py-1.5 shrink-0">
        <button
          onClick={() => setShowThemes((v) => !v)}
          className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all", currentTheme.color)}
        >
          <currentTheme.icon className="size-5 shrink-0" />
          <div className="flex-1 text-left min-w-0">
            <p className="text-[11px] font-bold leading-tight">{currentTheme.title}</p>
            <p className="text-[10px] opacity-70 leading-tight mt-0.5">{currentTheme.subtitle}</p>
          </div>
          <ChevronDown className={cn("size-3.5 shrink-0 opacity-60 transition-transform", showThemes && "rotate-180")} />
        </button>

        <div className="flex flex-wrap gap-1 px-1 mt-1.5">
          {currentTheme.tags.map((tag) => (
            <span key={tag} className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-md border opacity-70", currentTheme.color)}>
              {tag}
            </span>
          ))}
        </div>

        {showThemes && (
          <div className="mt-2 space-y-1">
            {WEEK_THEMES.map((theme) => (
              <div
                key={theme.week}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-2 rounded-xl border text-[11px]",
                  theme.week === currentTheme.week ? cn(theme.color, "font-bold") : "border-border/40 text-muted-foreground"
                )}
              >
                <theme.icon className="size-4 shrink-0" />
                <p className="font-semibold leading-tight">W{theme.week}: {theme.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Week achievements ── */}
      <div className="px-2.5 py-1.5 shrink-0">
        <div className="rounded-xl border border-border/40 bg-background overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
            <TrendingUp className="size-3.5 text-primary shrink-0" />
            <span className="text-[11px] font-semibold flex-1">Week Achievements</span>
            <button
              onClick={() => setEditingAchv((v) => !v)}
              className="size-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              {editingAchv ? <Check className="size-3" /> : <Pencil className="size-3" />}
            </button>
          </div>
          {editingAchv ? (
            <textarea
              ref={achvRef}
              value={achvText}
              onChange={(e) => handleAchvChange(e.target.value)}
              onBlur={() => setEditingAchv(false)}
              placeholder={`e.g. DevOps 3d, Security 2d, AI 1d…`}
              rows={3}
              className="w-full px-3 py-2 text-[11px] bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground/40 text-foreground"
            />
          ) : (
            <div
              onClick={() => setEditingAchv(true)}
              className="px-3 py-2 min-h-[52px] cursor-text"
            >
              {achvText ? (
                <p className="text-[11px] text-foreground/80 whitespace-pre-wrap leading-relaxed">{achvText}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground/40 italic">Tap to add achievements…</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Daily structure ── */}
      <div className="px-2.5 py-1 shrink-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 px-1 mb-1.5">
          Daily Structure
        </p>
        <div className="space-y-0.5">
          {(["activities", "work", "learning"] as const).map((cat) => {
            const CatIcon = CATEGORY_ICON_COMPONENTS[cat];
            const dayT = tasks.filter((t) => t.date === selectedDate && t.category === cat);
            const done = dayT.filter((t) => t.status === "done").length;
            return (
              <div key={cat} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                <CatIcon className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-[11px] font-medium text-muted-foreground flex-1">{CATEGORY_LABELS[cat]}</span>
                {dayT.length > 0 ? (
                  <span className="text-[10px] font-semibold text-muted-foreground/70">{done}/{dayT.length}</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground/30">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      </div>{/* end scrollable */}

      {/* ── Week progress (fixed bottom) ── */}
      <div className="px-2.5 py-2 shrink-0">
        <div className="px-3 py-2.5 rounded-xl bg-muted/40 border border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-3.5 text-primary" />
            <span className="text-[11px] font-semibold">Week progress</span>
            <span className="ml-auto text-[10px] font-bold text-primary">{weekPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${weekPct}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">{weekDone} of {weekTotal} tasks complete</p>
        </div>
      </div>

      {extraBottom && (
        <div className="px-2.5 pb-2.5 shrink-0 space-y-2">{extraBottom}</div>
      )}
    </div>
  );
}
