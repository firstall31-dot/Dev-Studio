import { TaskCategory } from "@/types/planner";
import { WEEK_THEMES } from "@/constants/planner";

export function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function to24hMin(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatCountdown(diffMin: number): string {
  if (diffMin <= 0) return "Now";
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function formatMinutesLabel(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const ap  = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
}

export function getWeekOfMonth(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  return Math.min(Math.ceil(d.getDate() / 7), 4);
}

export function getWeekTheme(dateStr: string) {
  const week = getWeekOfMonth(dateStr);
  return WEEK_THEMES[week - 1];
}

export function normCategory(cat: string): TaskCategory {
  if (["activities", "work", "learning", "general"].includes(cat)) return cat as TaskCategory;
  if (["personal"].includes(cat)) return "activities";
  if (["coding", "freelance", "job-search", "meetings"].includes(cat)) return "work";
  return "general";
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
