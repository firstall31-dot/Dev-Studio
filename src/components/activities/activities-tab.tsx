import { useState } from "react";
import {
  MapPin, RefreshCw, Clock, Dumbbell, Utensils,
  Sparkles, Plus, Check, ChevronDown, Flame, Bath,
  Timer, AlertCircle, Activity, Moon,
  Coffee, Salad, Footprints, HeartPulse,
  Droplets, BedDouble, UtensilsCrossed,
  Briefcase, BookOpen, LucideIcon, Monitor, FileCode2,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { usePrayerTimes, type PrayerTime } from "@/hooks/use-prayer-times";
import { toDateStr, to24hMin, formatCountdown, formatTime12, formatMinutesLabel } from "@/lib/planner-utils";

/* ── Types ─────────────────────────────────────────── */
interface ActivityItem {
  id: string;
  title: string;
  done: boolean;
  time?: string;
}

interface ActivitySuggestion {
  Icon: LucideIcon;
  label: string;
  bestTime: string;
  reason: string;
}

type InnerTab = "prayer" | "sports" | "care" | "food";

const INNER_TABS: { id: InnerTab; label: string; icon: LucideIcon; color: string }[] = [
  { id: "prayer",  label: "Prayer",  icon: Moon,     color: "text-indigo-500" },
  { id: "sports",  label: "Sports",  icon: Dumbbell, color: "text-blue-500"   },
  { id: "care",    label: "Care",    icon: Bath,     color: "text-rose-500"   },
  { id: "food",    label: "Food",    icon: Utensils, color: "text-amber-500"  },
];

/* ── Static suggestions ─────────────────────────── */
const WORKING_SUGGESTIONS: ActivitySuggestion[] = [
  { Icon: Briefcase,    label: "Deep work block",  bestTime: "09:00 – 11:00", reason: "Peak focus window" },
  { Icon: Timer,        label: "Pomodoro × 4",     bestTime: "10:00 – 12:00", reason: "4 × 25-min sprints" },
  { Icon: Coffee,       label: "Morning standup",  bestTime: "09:00 – 09:15", reason: "Quick daily sync" },
  { Icon: MessageSquare,label: "Email & Slack",    bestTime: "12:30 – 13:00", reason: "Batch check after lunch" },
];

const LEARNING_SUGGESTIONS: ActivitySuggestion[] = [
  { Icon: BookOpen,  label: "Read docs",        bestTime: "08:00 – 09:00", reason: "Fresh morning mind" },
  { Icon: Monitor,   label: "Watch tutorial",   bestTime: "14:00 – 15:00", reason: "Post-lunch learning" },
  { Icon: FileCode2, label: "Practice / build", bestTime: "15:00 – 17:00", reason: "Apply what you learned" },
  { Icon: BedDouble, label: "Review notes",     bestTime: "21:00 – 21:30", reason: "Before sleep — boosts retention" },
];

/* ── Prayer-aware suggestions ───────────────────── */
function getPrayerSuggestions(prayers: PrayerTime[]): {
  food: ActivitySuggestion[];
  sports: ActivitySuggestion[];
  care: ActivitySuggestion[];
} {
  if (prayers.length === 0) {
    return {
      food: [
        { Icon: Coffee,          label: "Breakfast",  bestTime: "06:30 – 08:00", reason: "After Fajr prayer" },
        { Icon: Salad,           label: "Lunch",      bestTime: "12:30 – 13:30", reason: "After Dhuhr prayer" },
        { Icon: UtensilsCrossed, label: "Dinner",     bestTime: "19:30 – 20:30", reason: "After Maghrib prayer" },
      ],
      sports: [
        { Icon: Dumbbell,   label: "Morning workout",    bestTime: "08:00 – 10:00", reason: "After breakfast, high energy" },
        { Icon: Footprints, label: "Afternoon walk",     bestTime: "15:30 – 17:00", reason: "Before Maghrib, cooler air" },
        { Icon: HeartPulse, label: "Yoga / stretch",     bestTime: "05:30 – 06:00", reason: "Before Fajr, peaceful time" },
      ],
      care: [
        { Icon: Sparkles, label: "Morning grooming", bestTime: "06:00 – 06:30", reason: "Before Fajr, fresh start" },
        { Icon: Droplets, label: "Evening shower",   bestTime: "20:00 – 21:00", reason: "After Maghrib, wind down" },
        { Icon: BedDouble, label: "Sleep prep",      bestTime: "22:00 – 23:00", reason: "After Isha, restful night" },
      ],
    };
  }

  const fajrMin    = to24hMin(prayers.find((p) => p.name === "Fajr")?.time    ?? "05:00");
  const dhuhrMin   = to24hMin(prayers.find((p) => p.name === "Dhuhr")?.time   ?? "12:00");
  const asrMin     = to24hMin(prayers.find((p) => p.name === "Asr")?.time     ?? "15:30");
  const maghribMin = to24hMin(prayers.find((p) => p.name === "Maghrib")?.time ?? "18:30");
  const ishaMin    = to24hMin(prayers.find((p) => p.name === "Isha")?.time    ?? "20:00");
  const f = formatMinutesLabel;

  return {
    food: [
      { Icon: Coffee,          label: "Breakfast", bestTime: `${f(fajrMin + 20)} – ${f(fajrMin + 60)}`,       reason: "20–60 min after Fajr" },
      { Icon: Salad,           label: "Lunch",     bestTime: `${f(dhuhrMin + 15)} – ${f(dhuhrMin + 75)}`,     reason: "After Dhuhr prayer" },
      { Icon: UtensilsCrossed, label: "Dinner",    bestTime: `${f(maghribMin + 15)} – ${f(maghribMin + 75)}`, reason: "After Maghrib prayer" },
    ],
    sports: [
      { Icon: Dumbbell,   label: "Strength training", bestTime: `${f(fajrMin + 70)} – ${f(dhuhrMin - 60)}`,  reason: "Post-breakfast energy peak" },
      { Icon: Footprints, label: "Walk / cardio",     bestTime: `${f(asrMin + 20)} – ${f(maghribMin - 20)}`, reason: "Asr → Maghrib window, cool air" },
      { Icon: HeartPulse, label: "Yoga / stretch",    bestTime: `${f(fajrMin + 5)} – ${f(fajrMin + 35)}`,    reason: "Right after Fajr, peaceful" },
    ],
    care: [
      { Icon: Sparkles,  label: "Morning grooming", bestTime: `${f(fajrMin - 20)} – ${f(fajrMin)}`,           reason: "Before Fajr, fresh start" },
      { Icon: Droplets,  label: "Shower / bath",    bestTime: `${f(maghribMin + 20)} – ${f(maghribMin + 50)}`,reason: "After Maghrib, relax" },
      { Icon: BedDouble, label: "Sleep routine",    bestTime: `${f(ishaMin + 60)} – ${f(ishaMin + 90)}`,      reason: "90 min after Isha, quality sleep" },
    ],
  };
}

/* ── Storage helpers ─────────────────────────────── */
const STORAGE_KEY = "ds-activities";
function loadActivities(key: string): ActivityItem[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${key}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveActivities(key: string, items: ActivityItem[]) {
  try { localStorage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(items)); } catch {}
}

/* ── Presets ─────────────────────────────────────── */
const PRESET_FOOD: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Breakfast",           time: "" },
  { title: "Lunch",               time: "" },
  { title: "Dinner",              time: "" },
  { title: "Morning hydration",   time: "" },
  { title: "Evening supplements", time: "" },
];
const PRESET_SPORTS: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Strength training", time: "" },
  { title: "Morning walk",      time: "" },
  { title: "Cardio / run",      time: "" },
  { title: "Yoga / stretching", time: "" },
  { title: "Sports session",    time: "" },
];
const PRESET_CARE: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Morning grooming", time: "" },
  { title: "Shower / bath",    time: "" },
  { title: "Skincare routine", time: "" },
  { title: "Meditation",       time: "" },
  { title: "Sleep prep",       time: "" },
];
const PRESET_WORKING: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Deep work block",  time: "" },
  { title: "Code review",      time: "" },
  { title: "Planning session", time: "" },
  { title: "Email & Slack",    time: "" },
  { title: "Team standup",     time: "" },
];
const PRESET_LEARNING: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Read documentation", time: "" },
  { title: "Watch tutorial",     time: "" },
  { title: "Practice exercises", time: "" },
  { title: "Review notes",       time: "" },
  { title: "Build a project",    time: "" },
];

/* ── ActivitySection ─────────────────────────────── */
function ActivitySection({
  icon: Icon, title, color, bgColor, borderColor,
  suggestions, items, presets, onToggle, onAdd,
}: {
  icon: LucideIcon;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  suggestions: ActivitySuggestion[];
  items: ActivityItem[];
  presets: Omit<ActivityItem, "id" | "done">[];
  onToggle: (id: string) => void;
  onAdd: (title: string, time?: string) => void;
}) {
  const [showPresets, setShowPresets] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const done  = items.filter((i) => i.done).length;
  const total = items.length;

  return (
    <div className={cn("rounded-2xl border overflow-visible", borderColor)}>
      <div className={cn("px-4 py-3 flex items-center gap-3 rounded-t-2xl", bgColor)}>
        <div className={cn("size-8 rounded-xl flex items-center justify-center border", bgColor, borderColor)}>
          <Icon className={cn("size-4", color)} />
        </div>
        <div className="flex-1">
          <p className={cn("text-sm font-bold", color)}>{title}</p>
          <p className="text-[10px] text-muted-foreground">
            {total > 0 ? `${done}/${total} done` : "No activities yet"}
          </p>
        </div>
        {total > 0 && (
          <div className="w-16 h-1.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", color.replace("text-", "bg-"))}
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3 bg-background rounded-b-2xl">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1 mb-2">
            <Sparkles className="size-3" /> Suggested times
          </p>
          {suggestions.map((s) => {
            const SIcon = s.Icon;
            return (
              <button
                key={s.label}
                onClick={() => onAdd(s.label, s.bestTime)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/60 border border-transparent hover:border-border/40 transition-all text-left group"
              >
                <div className="size-7 rounded-lg flex items-center justify-center shrink-0 bg-muted/50 group-hover:bg-muted transition-colors">
                  <SIcon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.bestTime} · {s.reason}</p>
                </div>
                <Plus className="size-3.5 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>

        {items.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Your activities</p>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                  item.done
                    ? "bg-emerald-500/8 border-emerald-500/20 opacity-70"
                    : "bg-background border-border/40 hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                <div className={cn(
                  "size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                  item.done ? "bg-emerald-500 border-emerald-500" : "border-border"
                )}>
                  {item.done && <Check className="size-3 text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-medium", item.done && "line-through text-muted-foreground")}>
                    {item.title}
                  </p>
                  {item.time && (
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-2.5" /> {item.time}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="pt-1 border-t border-border/40 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add custom activity…"
              className="h-8 text-xs rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter" && customInput.trim()) {
                  onAdd(customInput.trim());
                  setCustomInput("");
                }
              }}
            />
            <button
              onClick={() => setShowPresets((v) => !v)}
              className={cn(
                "shrink-0 h-8 px-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                showPresets
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              Quick add
              <ChevronDown className={cn("size-3 transition-transform", showPresets && "rotate-180")} />
            </button>
          </div>

          {showPresets && (
            <div className="rounded-xl border border-border/50 bg-popover shadow-md overflow-hidden">
              {presets
                .filter((p) => !items.find((i) => i.title === p.title))
                .map((p) => (
                  <button
                    key={p.title}
                    onClick={() => { onAdd(p.title); setShowPresets(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/60 text-left transition-colors border-b border-border/30 last:border-0"
                  >
                    <Plus className="size-3 text-muted-foreground/50 shrink-0" />
                    {p.title}
                  </button>
                ))}
              {presets.filter((p) => !items.find((i) => i.title === p.title)).length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground/50 text-center">All presets added</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── ActivityPanel — state wrapper for one tab ───── */
function ActivityPanel({
  storeKey, presets, suggestions, icon, title, color, bgColor, borderColor,
}: {
  storeKey: string;
  presets: Omit<ActivityItem, "id" | "done">[];
  suggestions: ActivitySuggestion[];
  icon: LucideIcon;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  const today = toDateStr(new Date());
  const [items, setItems] = useState<ActivityItem[]>(() => loadActivities(`${today}-${storeKey}`));

  const handleToggle = (id: string) => {
    const updated = items.map((i) => i.id === id ? { ...i, done: !i.done } : i);
    setItems(updated);
    saveActivities(`${today}-${storeKey}`, updated);
  };

  const handleAdd = (title: string, time?: string) => {
    if (items.find((i) => i.title === title)) return;
    const updated = [...items, { id: crypto.randomUUID(), title, done: false, time }];
    setItems(updated);
    saveActivities(`${today}-${storeKey}`, updated);
    toast.success(`Added "${title}"`);
  };

  const done  = items.filter((i) => i.done).length;
  const total = items.length;

  return (
    <div className="p-4 space-y-3">
      {total > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/40">
          <Activity className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground flex-1">{done} of {total} done today</span>
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}
      <ActivitySection
        icon={icon} title={title}
        color={color} bgColor={bgColor} borderColor={borderColor}
        suggestions={suggestions} items={items} presets={presets}
        onToggle={handleToggle} onAdd={handleAdd}
      />
    </div>
  );
}

/* ── Prayer tracker storage ──────────────────────── */
const PRAYER_TRACKER_KEY = "ds-prayer-tracker";
function loadPrayerTracker(dateKey: string): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(`${PRAYER_TRACKER_KEY}-${dateKey}`) ?? "{}"); } catch { return {}; }
}
function savePrayerTracker(dateKey: string, data: Record<string, boolean>) {
  try { localStorage.setItem(`${PRAYER_TRACKER_KEY}-${dateKey}`, JSON.stringify(data)); } catch {}
}

/* ── PRAYER PANEL ────────────────────────────────── */
function PrayerPanel() {
  const { prayers, loading, error, city, nextIdx, nowMin, refresh } = usePrayerTimes();
  const today = toDateStr(new Date());
  const [prayed, setPrayed] = useState<Record<string, boolean>>(() => loadPrayerTracker(today));

  const nextPrayer   = nextIdx >= 0 ? prayers[nextIdx] : null;
  const diffMin      = nextPrayer ? to24hMin(nextPrayer.time) - nowMin : 0;
  const adjustedDiff = diffMin < 0 ? diffMin + 24 * 60 : diffMin;

  const togglePrayed = (name: string) => {
    const updated = { ...prayed, [name]: !prayed[name] };
    setPrayed(updated);
    savePrayerTracker(today, updated);
  };

  const prayedCount = prayers.filter((p) => prayed[p.name]).length;

  return (
    <div className="p-4 space-y-5">

      {/* ── Timer card ── */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-center space-y-3 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <MapPin className="size-3.5" />
          <span>{city || "Detecting location…"}</span>
        </div>

        {loading && (
          <div className="py-8 flex flex-col items-center gap-3">
            <RefreshCw className="size-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading prayer times…</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && nextPrayer && (
          <>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Next Prayer</p>
              <div className="flex items-center justify-center gap-3">
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center border",
                  nextPrayer.iconColor.replace("text-", "bg-") + "/10",
                  nextPrayer.iconColor.replace("text-", "border-") + "/20",
                )}>
                  <nextPrayer.Icon className={cn("size-6", nextPrayer.iconColor)} />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold">{nextPrayer.name}</p>
                  <p className="text-base text-muted-foreground">{nextPrayer.arabicName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 py-2">
              <p className="text-4xl font-bold font-mono text-primary tabular-nums">
                {formatTime12(nextPrayer.time)}
              </p>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold font-mono tabular-nums">{formatCountdown(adjustedDiff)}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center mt-0.5">
                  <Timer className="size-3" /> remaining
                </p>
              </div>
            </div>
          </>
        )}

        {!loading && !error && prayers.length > 0 && (
          <button
            onClick={refresh}
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg hover:bg-muted/40"
          >
            <RefreshCw className="size-3" /> Refresh location
          </button>
        )}
      </div>

      {/* ── Prayer activity tracker ── */}
      {!loading && !error && prayers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="size-4 text-indigo-500" />
              <span className="text-sm font-semibold">Prayer Tracker</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-indigo-500">{prayedCount}/{prayers.length}</span>
              {/* mini progress bar */}
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${prayers.length > 0 ? (prayedCount / prayers.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {prayers.map((prayer, i) => {
              const isNext    = i === nextIdx;
              const isPast    = to24hMin(prayer.time) < nowMin && !isNext;
              const isDone    = !!prayed[prayer.name];
              const isMissed  = isPast && !isDone;
              const PIcon     = prayer.Icon;

              return (
                <button
                  key={prayer.name}
                  onClick={() => togglePrayed(prayer.name)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all cursor-pointer group",
                    isDone
                      ? "bg-emerald-500/10 border-emerald-500/30 shadow-sm ring-1 ring-emerald-500/20"
                      : isMissed
                      ? "bg-amber-500/5 border-amber-500/20 opacity-70 hover:opacity-100 hover:border-amber-500/40"
                      : isNext
                      ? "bg-primary/8 border-primary/25 shadow-sm hover:bg-primary/12"
                      : "border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border/60"
                  )}
                >
                  {/* Done checkmark badge */}
                  {isDone && (
                    <span className="absolute top-2 right-2 size-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="size-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  {/* Next pulse */}
                  {isNext && !isDone && (
                    <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-primary animate-pulse" />
                  )}

                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                    isDone
                      ? "bg-emerald-500/15"
                      : prayer.iconColor.replace("text-", "bg-") + "/10"
                  )}>
                    <PIcon className={cn(
                      "size-5 transition-all",
                      isDone ? "text-emerald-600" : prayer.iconColor
                    )} />
                  </div>

                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-sm font-bold leading-tight",
                      isDone ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
                    )}>
                      {prayer.name}
                    </p>
                    <p className={cn(
                      "text-[11px] font-medium",
                      isDone ? "text-emerald-600/70" : "text-muted-foreground"
                    )}>
                      {prayer.arabicName}
                    </p>
                  </div>

                  <p className={cn(
                    "text-sm font-bold font-mono tabular-nums",
                    isDone ? "text-emerald-600" : prayer.iconColor
                  )}>
                    {formatTime12(prayer.time)}
                  </p>

                  {/* Status badge */}
                  {isDone ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                      Prayed ✓
                    </span>
                  ) : isNext ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      in {formatCountdown(adjustedDiff)}
                    </span>
                  ) : isMissed ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                      Tap to log
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50 font-medium">
                      upcoming
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {prayedCount === prayers.length && prayers.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                All prayers completed today — ما شاء الله!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── MAIN EXPORT ─────────────────────────────────── */
export function ActivitiesTab() {
  const [innerTab, setInnerTab] = useState<InnerTab>("prayer");
  const { prayers } = usePrayerTimes();
  const suggestions = getPrayerSuggestions(prayers);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Inner tab bar */}
      <div className="shrink-0 px-4 sm:px-5 pt-3.5 pb-0 border-b border-border/50">
        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-3">
          {INNER_TABS.map((t) => {
            const Icon = t.icon;
            const active = innerTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setInnerTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0",
                  active
                    ? "bg-background text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className={cn("size-3.5", active && t.color)} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {innerTab === "prayer" && <PrayerPanel />}

        {innerTab === "sports" && (
          <ActivityPanel
            storeKey="sports"
            icon={Dumbbell} title="Training & Sports"
            color="text-blue-600" bgColor="bg-blue-500/5" borderColor="border-blue-500/20"
            suggestions={suggestions.sports}
            presets={PRESET_SPORTS}
          />
        )}

        {innerTab === "care" && (
          <ActivityPanel
            storeKey="care"
            icon={Bath} title="Self-Care & Hygiene"
            color="text-rose-600" bgColor="bg-rose-500/5" borderColor="border-rose-500/20"
            suggestions={suggestions.care}
            presets={PRESET_CARE}
          />
        )}

        {innerTab === "food" && (
          <ActivityPanel
            storeKey="food"
            icon={Utensils} title="Food & Nutrition"
            color="text-amber-600" bgColor="bg-amber-500/5" borderColor="border-amber-500/20"
            suggestions={suggestions.food}
            presets={PRESET_FOOD}
          />
        )}
      </div>
    </div>
  );
}

/* ── STANDALONE EXPORTS for main tab nav ─────────── */
export function WorkingTab() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <ActivityPanel
        storeKey="working"
        icon={Briefcase} title="Working Sessions"
        color="text-violet-600" bgColor="bg-violet-500/5" borderColor="border-violet-500/20"
        suggestions={WORKING_SUGGESTIONS}
        presets={PRESET_WORKING}
      />
    </div>
  );
}

export function LearningTab() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <ActivityPanel
        storeKey="learning"
        icon={BookOpen} title="Learning & Study"
        color="text-emerald-600" bgColor="bg-emerald-500/5" borderColor="border-emerald-500/20"
        suggestions={LEARNING_SUGGESTIONS}
        presets={PRESET_LEARNING}
      />
    </div>
  );
}
