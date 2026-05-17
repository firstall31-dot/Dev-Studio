import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Moon, MapPin, RefreshCw, Clock, Dumbbell, Utensils,
  Sparkles, Plus, Check, ChevronRight, Flame, Bath,
  Timer, Sun, Star, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageContainer, PageSection } from "@/components/layout";
import { toast } from "sonner";

export const Route = createFileRoute("/activities")({
  component: ActivitiesPage,
});

/* ── Types ─────────────────────────────────────────── */
interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  emoji: string;
}

interface ActivityItem {
  id: string;
  title: string;
  done: boolean;
  time?: string;
}

type Tab = "prayer" | "activities";

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_META: Record<string, { arabic: string; emoji: string; color: string }> = {
  Fajr:    { arabic: "الفجر",  emoji: "🌙", color: "text-indigo-400" },
  Dhuhr:   { arabic: "الظهر",  emoji: "☀️", color: "text-amber-500"  },
  Asr:     { arabic: "العصر",  emoji: "🌤", color: "text-orange-400" },
  Maghrib: { arabic: "المغرب", emoji: "🌅", color: "text-rose-400"   },
  Isha:    { arabic: "العشاء", emoji: "🌃", color: "text-violet-400" },
};

function to24hMin(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
function formatCountdown(diffMin: number): string {
  if (diffMin <= 0) return "Now";
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}
function toDateStr(d: Date) { return d.toISOString().slice(0, 10); }

/* ── Activity suggestions based on prayer times ───── */
interface ActivitySuggestion {
  icon: string;
  label: string;
  bestTime: string;
  reason: string;
}

function getActivitySuggestions(prayers: PrayerTime[]): {
  food: ActivitySuggestion[];
  training: ActivitySuggestion[];
  selfCare: ActivitySuggestion[];
} {
  if (prayers.length === 0) {
    return {
      food: [
        { icon: "🍳", label: "Breakfast",     bestTime: "06:30 – 08:00", reason: "After Fajr prayer" },
        { icon: "🥗", label: "Lunch",          bestTime: "12:30 – 13:30", reason: "After Dhuhr prayer" },
        { icon: "🍽️", label: "Dinner",         bestTime: "19:30 – 20:30", reason: "After Maghrib prayer" },
      ],
      training: [
        { icon: "🏋️", label: "Morning workout", bestTime: "08:00 – 10:00", reason: "After breakfast, high energy" },
        { icon: "🚶", label: "Afternoon walk",   bestTime: "15:30 – 17:00", reason: "Before Maghrib, cooler air" },
      ],
      selfCare: [
        { icon: "🧴", label: "Morning routine",  bestTime: "06:00 – 06:30", reason: "Before Fajr, fresh start" },
        { icon: "🛁", label: "Evening shower",   bestTime: "20:00 – 21:00", reason: "After Maghrib, wind down" },
        { icon: "😴", label: "Sleep prep",        bestTime: "22:00 – 23:00", reason: "After Isha, restful night" },
      ],
    };
  }

  const fajrMin    = to24hMin(prayers.find((p) => p.name === "Fajr")?.time    ?? "05:00");
  const dhuhrMin   = to24hMin(prayers.find((p) => p.name === "Dhuhr")?.time   ?? "12:00");
  const asrMin     = to24hMin(prayers.find((p) => p.name === "Asr")?.time     ?? "15:30");
  const maghribMin = to24hMin(prayers.find((p) => p.name === "Maghrib")?.time ?? "18:30");
  const ishaMin    = to24hMin(prayers.find((p) => p.name === "Isha")?.time    ?? "20:00");

  const fmt = (m: number) => {
    const h   = Math.floor(m / 60) % 24;
    const min = m % 60;
    const ap  = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(min).padStart(2, "0")} ${ap}`;
  };

  return {
    food: [
      {
        icon: "🍳", label: "Breakfast",
        bestTime: `${fmt(fajrMin + 20)} – ${fmt(fajrMin + 60)}`,
        reason: "20–60 min after Fajr",
      },
      {
        icon: "🥗", label: "Lunch",
        bestTime: `${fmt(dhuhrMin + 15)} – ${fmt(dhuhrMin + 75)}`,
        reason: "After Dhuhr prayer",
      },
      {
        icon: "🍽️", label: "Dinner",
        bestTime: `${fmt(maghribMin + 15)} – ${fmt(maghribMin + 75)}`,
        reason: "After Maghrib prayer",
      },
    ],
    training: [
      {
        icon: "🏋️", label: "Strength training",
        bestTime: `${fmt(fajrMin + 70)} – ${fmt(dhuhrMin - 60)}`,
        reason: "Post-breakfast energy peak",
      },
      {
        icon: "🚶", label: "Walk / cardio",
        bestTime: `${fmt(asrMin + 20)} – ${fmt(maghribMin - 20)}`,
        reason: "Asr → Maghrib window, cooler air",
      },
      {
        icon: "🧘", label: "Yoga / stretch",
        bestTime: `${fmt(fajrMin + 5)} – ${fmt(fajrMin + 35)}`,
        reason: "Right after Fajr, peaceful time",
      },
    ],
    selfCare: [
      {
        icon: "🧴", label: "Morning grooming",
        bestTime: `${fmt(fajrMin - 20)} – ${fmt(fajrMin)}`,
        reason: "Before Fajr, fresh start",
      },
      {
        icon: "🛁", label: "Shower / bath",
        bestTime: `${fmt(maghribMin + 20)} – ${fmt(maghribMin + 50)}`,
        reason: "After Maghrib, relax",
      },
      {
        icon: "😴", label: "Sleep routine",
        bestTime: `${fmt(ishaMin + 60)} – ${fmt(ishaMin + 90)}`,
        reason: "90 min after Isha, quality sleep",
      },
    ],
  };
}

/* ── PRAYER PAGE ─────────────────────────────────── */
function PrayerPage() {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [now, setNow] = useState(() => new Date());
  const fetchRef = useRef<((lat: number, lng: number, label: string) => Promise<void>) | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);

  const fetchByCoords = useCallback(async (lat: number, lng: number, label: string) => {
    setLoading(true); setError(null); setCity(label);
    try {
      const today = toDateStr(new Date());
      const [day, month, year] = [today.slice(8, 10), today.slice(5, 7), today.slice(0, 4)];
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=4`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const timings = json.data?.timings;
      if (!timings) throw new Error("Invalid response");
      setPrayers(PRAYER_KEYS.map((key) => ({
        name: key, arabicName: PRAYER_META[key].arabic,
        time: timings[key], emoji: PRAYER_META[key].emoji,
      })));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  fetchRef.current = fetchByCoords;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then((r) => r.json())
            .then((data) => {
              const label = data.address?.city || data.address?.town || data.address?.state || "Your location";
              fetchRef.current?.(latitude, longitude, label);
            })
            .catch(() => fetchRef.current?.(latitude, longitude, "Your location"));
        },
        () => fetchRef.current?.(21.3891, 39.8579, "Mecca")
      );
    } else {
      fetchRef.current?.(21.3891, 39.8579, "Mecca");
    }
  }, []);

  const nowMin = now.getHours() * 60 + now.getMinutes();
  let nextIdx  = -1;
  if (prayers.length > 0) {
    nextIdx = prayers.findIndex((p) => to24hMin(p.time) > nowMin);
    if (nextIdx === -1) nextIdx = 0;
  }

  const nextPrayer  = nextIdx >= 0 ? prayers[nextIdx] : null;
  const diffMin     = nextPrayer ? to24hMin(nextPrayer.time) - nowMin : 0;
  const adjustedDiff = diffMin < 0 ? diffMin + 24 * 60 : diffMin;

  return (
    <div className="max-w-lg mx-auto space-y-6 py-2">
      {/* Big countdown */}
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
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
                Next Prayer
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{nextPrayer.emoji}</span>
                <div className="text-left">
                  <p className="text-2xl font-bold">{nextPrayer.name}</p>
                  <p className="text-base text-muted-foreground">{nextPrayer.arabicName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 py-2">
              <div>
                <p className="text-4xl font-bold font-mono text-primary tabular-nums">
                  {formatTime12(nextPrayer.time)}
                </p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold font-mono tabular-nums">
                  {formatCountdown(adjustedDiff)}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                  <Timer className="size-3" /> remaining
                </p>
              </div>
            </div>
          </>
        )}

        {!loading && !error && prayers.length > 0 && (
          <button
            onClick={() => {
              navigator.geolocation?.getCurrentPosition(
                (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude, city),
                () => {}
              );
            }}
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="size-3" /> Refresh
          </button>
        )}
      </div>

      {/* All prayers list */}
      {!loading && !error && prayers.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-muted/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
            <Moon className="size-4 text-primary" />
            <span className="text-sm font-semibold">Today's Prayer Times</span>
          </div>
          <div className="divide-y divide-border/30">
            {prayers.map((prayer, i) => {
              const isNext = i === nextIdx;
              const isPast = to24hMin(prayer.time) < nowMin && !isNext;
              return (
                <div
                  key={prayer.name}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 transition-all",
                    isNext ? "bg-primary text-primary-foreground" : isPast ? "opacity-35" : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{prayer.emoji}</span>
                    <div>
                      <p className={cn("text-sm font-semibold", isNext ? "text-primary-foreground" : "text-foreground")}>
                        {prayer.name}
                      </p>
                      <p className={cn("text-xs", isNext ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {prayer.arabicName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-bold font-mono",
                      isNext ? "text-primary-foreground" : PRAYER_META[prayer.name].color
                    )}>
                      {formatTime12(prayer.time)}
                    </p>
                    {isNext && (
                      <p className="text-[11px] text-primary-foreground/70 flex items-center gap-0.5 justify-end">
                        <Clock className="size-2.5" />
                        {formatCountdown(adjustedDiff)}
                      </p>
                    )}
                    {isPast && <p className="text-[11px] text-muted-foreground/50">completed</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ACTIVITIES PAGE ────────────────────────────── */
const PRESET_FOOD: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Breakfast",          time: "" },
  { title: "Lunch",              time: "" },
  { title: "Dinner",             time: "" },
  { title: "Morning hydration",  time: "" },
  { title: "Evening supplements",time: "" },
];
const PRESET_TRAINING: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Strength training",  time: "" },
  { title: "Morning walk",       time: "" },
  { title: "Cardio / run",       time: "" },
  { title: "Yoga / stretching",  time: "" },
  { title: "Sports session",     time: "" },
];
const PRESET_SELFCARE: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Morning grooming",   time: "" },
  { title: "Shower / bath",      time: "" },
  { title: "Skincare routine",   time: "" },
  { title: "Meditation",         time: "" },
  { title: "Sleep prep",         time: "" },
];

const STORAGE_KEY = "ds-activities";
function loadActivities(date: string): ActivityItem[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${date}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveActivities(date: string, items: ActivityItem[]) {
  try { localStorage.setItem(`${STORAGE_KEY}-${date}`, JSON.stringify(items)); } catch {}
}

function ActivitySection({
  icon: Icon,
  title,
  color,
  bgColor,
  borderColor,
  suggestions,
  items,
  presets,
  onToggle,
  onAdd,
}: {
  icon: typeof Utensils;
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
    <div className={cn("rounded-2xl border overflow-hidden", borderColor)}>
      {/* Header */}
      <div className={cn("px-4 py-3 flex items-center gap-3", bgColor)}>
        <div className={cn("size-8 rounded-xl flex items-center justify-center", bgColor, "border", borderColor)}>
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
              style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Smart time suggestions */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1">
            <Sparkles className="size-3" /> Suggested times
          </p>
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => onAdd(s.label, s.bestTime)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/60 border border-transparent hover:border-border/40 transition-all text-left group"
            >
              <span className="text-lg shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.bestTime} · {s.reason}</p>
              </div>
              <Plus className="size-3.5 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
            </button>
          ))}
        </div>

        {/* Added items */}
        {items.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-border/40">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Your activities</p>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                  item.done
                    ? "bg-emerald-500/10 border-emerald-500/20 opacity-70"
                    : "bg-background/60 border-border/40 hover:border-primary/30 hover:bg-primary/5"
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
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-2.5" /> {item.time}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick presets */}
        {showPresets && (
          <div className="space-y-1 pt-1 border-t border-border/40">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Quick add</p>
            {presets.filter((p) => !items.find((i) => i.title === p.title)).map((p) => (
              <button
                key={p.title}
                onClick={() => { onAdd(p.title); setShowPresets(false); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs hover:bg-muted/60 text-left transition-colors"
              >
                <Plus className="size-3 text-muted-foreground/50" /> {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Custom input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Custom activity…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && customInput.trim()) {
                onAdd(customInput.trim());
                setCustomInput("");
              }
            }}
            className="flex-1 bg-background/60 border border-input/60 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-muted-foreground/40"
          />
          <button
            onClick={() => setShowPresets((v) => !v)}
            className={cn(
              "size-8 rounded-xl border flex items-center justify-center transition-colors",
              showPresets ? "bg-primary/10 border-primary/20 text-primary" : "border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <ChevronRight className={cn("size-3.5 transition-transform", showPresets && "rotate-90")} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivitiesPanel({ prayers }: { prayers: PrayerTime[] }) {
  const today = toDateStr(new Date());
  const [food,     setFood]     = useState<ActivityItem[]>(() => loadActivities(`${today}-food`));
  const [training, setTraining] = useState<ActivityItem[]>(() => loadActivities(`${today}-training`));
  const [selfCare, setSelfCare] = useState<ActivityItem[]>(() => loadActivities(`${today}-selfcare`));

  const suggestions = getActivitySuggestions(prayers);

  const makeToggle = (
    list: ActivityItem[],
    setList: React.Dispatch<React.SetStateAction<ActivityItem[]>>,
    key: string
  ) => (id: string) => {
    const updated = list.map((i) => i.id === id ? { ...i, done: !i.done } : i);
    setList(updated);
    saveActivities(`${today}-${key}`, updated);
  };

  const makeAdd = (
    list: ActivityItem[],
    setList: React.Dispatch<React.SetStateAction<ActivityItem[]>>,
    key: string
  ) => (title: string, time?: string) => {
    if (list.find((i) => i.title === title)) return;
    const updated = [...list, { id: crypto.randomUUID(), title, done: false, time }];
    setList(updated);
    saveActivities(`${today}-${key}`, updated);
    toast.success(`Added "${title}"`);
  };

  const allTotal = food.length + training.length + selfCare.length;
  const allDone  = [...food, ...training, ...selfCare].filter((i) => i.done).length;
  const pct      = allTotal > 0 ? Math.round((allDone / allTotal) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Day summary */}
      {allTotal > 0 && (
        <div className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold">Today's Activities</p>
            <p className="text-xs text-muted-foreground mt-0.5">{allDone} of {allTotal} completed</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary w-10 text-right">{pct}%</span>
          </div>
        </div>
      )}

      <ActivitySection
        icon={Utensils}
        title="Food & Nutrition"
        color="text-amber-600"
        bgColor="bg-amber-500/5"
        borderColor="border-amber-500/20"
        suggestions={suggestions.food}
        items={food}
        presets={PRESET_FOOD}
        onToggle={makeToggle(food, setFood, "food")}
        onAdd={makeAdd(food, setFood, "food")}
      />

      <ActivitySection
        icon={Dumbbell}
        title="Training & Sports"
        color="text-blue-600"
        bgColor="bg-blue-500/5"
        borderColor="border-blue-500/20"
        suggestions={suggestions.training}
        items={training}
        presets={PRESET_TRAINING}
        onToggle={makeToggle(training, setTraining, "training")}
        onAdd={makeAdd(training, setTraining, "training")}
      />

      <ActivitySection
        icon={Bath}
        title="Self-Care & Hygiene"
        color="text-rose-600"
        bgColor="bg-rose-500/5"
        borderColor="border-rose-500/20"
        suggestions={suggestions.selfCare}
        items={selfCare}
        presets={PRESET_SELFCARE}
        onToggle={makeToggle(selfCare, setSelfCare, "selfcare")}
        onAdd={makeAdd(selfCare, setSelfCare, "selfcare")}
      />
    </div>
  );
}

/* ── MAIN PAGE ─────────────────────────────────── */
export default function ActivitiesPage() {
  const [tab, setTab] = useState<Tab>("prayer");
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);

  const today   = new Date();
  const dateStr = toDateStr(today);
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <PageContainer>
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="size-9 sm:size-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <Dumbbell className="size-[18px] sm:size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-0.5">
              Daily Hub
            </p>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight">Activities</h1>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-sm font-semibold">{dayName}</p>
            <p className="text-xs text-muted-foreground">{dateLabel}</p>
          </div>
        </div>

        {/* Tab nav */}
        <div className="mt-3 flex items-center gap-1 p-1 bg-muted/40 rounded-xl border border-border/50 w-fit">
          <button
            onClick={() => setTab("prayer")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "prayer"
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Moon className={cn("size-4", tab === "prayer" && "text-indigo-500")} />
            Prayer Times
          </button>
          <button
            onClick={() => setTab("activities")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "activities"
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Flame className={cn("size-4", tab === "activities" && "text-orange-500")} />
            Daily Activities
          </button>
        </div>
      </PageSection>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          {tab === "prayer" && <PrayerPage key={dateStr} />}
          {tab === "activities" && <ActivitiesPanel prayers={prayers} />}
        </div>
      </div>
    </PageContainer>
  );
}
