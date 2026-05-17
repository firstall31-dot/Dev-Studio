import { useState, useEffect, useCallback } from "react";
import { Moon, MapPin, RefreshCw, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  emoji: string;
}

interface PrayerTimesProps {
  date: string;
  onPrayerTimesLoaded?: (prayers: PrayerTime[]) => void;
}

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_META: Record<string, { arabic: string; emoji: string }> = {
  Fajr:    { arabic: "الفجر",   emoji: "🌙" },
  Dhuhr:   { arabic: "الظهر",   emoji: "☀️" },
  Asr:     { arabic: "العصر",   emoji: "🌤" },
  Maghrib: { arabic: "المغرب",  emoji: "🌅" },
  Isha:    { arabic: "العشاء",  emoji: "🌃" },
};

function to24hMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatCountdown(diffMin: number): string {
  if (diffMin <= 0) return "Now";
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function PrayerTimes({ date, onPrayerTimesLoaded }: PrayerTimesProps) {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const [cityLabel, setCityLabel] = useState<string>("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const fetchByCoords = useCallback(async (lat: number, lng: number, label: string) => {
    setLoading(true);
    setError(null);
    setCityLabel(label);
    try {
      const [day, month, year] = [
        date.slice(8, 10),
        date.slice(5, 7),
        date.slice(0, 4),
      ];
      const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=4`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch prayer times");
      const json = await res.json();
      const timings = json.data?.timings;
      if (!timings) throw new Error("Invalid response");
      const parsed: PrayerTime[] = PRAYER_KEYS.map((key) => ({
        name: key,
        arabicName: PRAYER_META[key].arabic,
        time: timings[key],
        emoji: PRAYER_META[key].emoji,
      }));
      setPrayers(parsed);
      onPrayerTimesLoaded?.(parsed);
    } catch (e: any) {
      setError(e.message || "Could not load prayer times");
    } finally {
      setLoading(false);
    }
  }, [date, onPrayerTimesLoaded]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then((r) => r.json())
            .then((data) => {
              const city = data.address?.city || data.address?.town || data.address?.state || "Your location";
              fetchByCoords(latitude, longitude, city);
            })
            .catch(() => fetchByCoords(latitude, longitude, "Your location"));
        },
        () => fetchByCoords(21.3891, 39.8579, "Mecca")
      );
    } else {
      fetchByCoords(21.3891, 39.8579, "Mecca");
    }
  }, [date]);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = date === new Date().toISOString().slice(0, 10);

  let nextPrayerIdx = -1;
  if (isToday && prayers.length > 0) {
    nextPrayerIdx = prayers.findIndex((p) => to24hMinutes(p.time) > nowMinutes);
    if (nextPrayerIdx === -1) nextPrayerIdx = 0;
  }

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden transition-all duration-200",
      open ? "border-primary/20 bg-gradient-to-b from-primary/5 to-transparent" : "border-border/40 bg-muted/20 hover:border-primary/15"
    )}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className={cn(
          "size-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          open ? "bg-primary/15" : "bg-muted/60"
        )}>
          <Moon className={cn("size-4", open ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold", open ? "text-primary" : "text-foreground")}>
            Prayer Times
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            {cityLabel ? (
              <><MapPin className="size-2.5 shrink-0" />{cityLabel}</>
            ) : "Azan schedule"}
          </p>
        </div>
        {loading ? (
          <RefreshCw className="size-3.5 text-muted-foreground animate-spin shrink-0" />
        ) : open ? (
          <ChevronUp className="size-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-primary/10 px-3 pb-3 pt-2 space-y-1">
          {loading && (
            <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <RefreshCw className="size-3.5 animate-spin" /> Loading prayer times…
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && prayers.map((prayer, i) => {
            const isNext = isToday && i === nextPrayerIdx;
            const isPast = isToday && to24hMinutes(prayer.time) < nowMinutes;
            const diff = isNext ? to24hMinutes(prayer.time) - nowMinutes : 0;

            return (
              <div
                key={prayer.name}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl transition-all",
                  isNext
                    ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/30"
                    : isPast
                    ? "opacity-40"
                    : "hover:bg-muted/40"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{prayer.emoji}</span>
                  <div>
                    <p className={cn(
                      "text-xs font-semibold",
                      isNext ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {prayer.name}
                    </p>
                    <p className={cn(
                      "text-[10px]",
                      isNext ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {prayer.arabicName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-xs font-bold font-mono",
                    isNext ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {prayer.time}
                  </p>
                  {isNext && (
                    <p className="text-[10px] text-primary-foreground/70 flex items-center gap-0.5 justify-end">
                      <Clock className="size-2.5" />
                      {formatCountdown(diff)}
                    </p>
                  )}
                  {isPast && !isNext && (
                    <p className="text-[10px] text-muted-foreground">done</p>
                  )}
                </div>
              </div>
            );
          })}

          {!loading && !error && prayers.length > 0 && (
            <button
              onClick={() => {
                navigator.geolocation?.getCurrentPosition(
                  (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude, cityLabel),
                  () => {}
                );
              }}
              className="w-full mt-1 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors py-1 rounded-lg hover:bg-primary/5"
            >
              <RefreshCw className="size-2.5" /> Refresh
            </button>
          )}
        </div>
      )}
    </div>
  );
}
