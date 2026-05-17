export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskCategory = "activities" | "work" | "learning" | "general";

export interface PlannerTask {
  id: string;
  date: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  order: number;
  estimatedMinutes?: number;
  createdAt: number;
  updatedAt: number;
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  activities: "Activities",
  work:       "Work Block",
  learning:   "Learning",
  general:    "General",
};

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  activities: "🌅",
  work:       "💼",
  learning:   "📚",
  general:    "⚡",
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  activities: "bg-amber-500/10 text-amber-600",
  work:       "bg-blue-500/10 text-blue-600",
  learning:   "bg-purple-500/10 text-purple-600",
  general:    "bg-muted text-muted-foreground",
};

export const CATEGORY_SECTION_STYLES: Record<TaskCategory, {
  border: string; bg: string; label: string; labelBg: string;
}> = {
  activities: {
    border: "border-amber-500/20",
    bg:     "bg-amber-500/5",
    label:  "text-amber-600",
    labelBg:"bg-amber-500/10",
  },
  work: {
    border: "border-blue-500/20",
    bg:     "bg-blue-500/5",
    label:  "text-blue-600",
    labelBg:"bg-blue-500/10",
  },
  learning: {
    border: "border-purple-500/20",
    bg:     "bg-purple-500/5",
    label:  "text-purple-600",
    labelBg:"bg-purple-500/10",
  },
  general: {
    border: "border-border/40",
    bg:     "bg-muted/20",
    label:  "text-muted-foreground",
    labelBg:"bg-muted/40",
  },
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low:    "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
  medium: "bg-amber-500/20 text-amber-600 border-amber-500/20",
  high:   "bg-red-500/20 text-red-600 border-red-500/20",
};

export interface WeekTheme {
  week: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  tags: string[];
}

export const WEEK_THEMES: WeekTheme[] = [
  {
    week: 1,
    title: "DevOps & Security",
    subtitle: "Infrastructure, CI/CD, Cyber",
    icon: "🔐",
    color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    tags: ["Docker", "CI/CD", "Linux", "Nginx", "SSH", "Firewall", "Secrets"],
  },
  {
    week: 2,
    title: "Database & Scraping",
    subtitle: "SQL, NoSQL, Data pipelines",
    icon: "🗄️",
    color: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20",
    tags: ["PostgreSQL", "Redis", "Playwright", "ETL", "SQL", "Indexing"],
  },
  {
    week: 3,
    title: "Code & Materials",
    subtitle: "Algorithms, Clean code, DSA",
    icon: "📝",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    tags: ["Refactoring", "DSA", "Patterns", "LeetCode", "Review", "Docs"],
  },
  {
    week: 4,
    title: "Frontend Frameworks",
    subtitle: "React, Next.js, UI/UX",
    icon: "⚛️",
    color: "text-violet-600 bg-violet-500/10 border-violet-500/20",
    tags: ["React", "Next.js", "Tailwind", "State", "A11y", "Performance"],
  },
];

export function getWeekOfMonth(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  return Math.min(Math.ceil(d.getDate() / 7), 4);
}

export function getWeekTheme(dateStr: string): WeekTheme {
  const week = getWeekOfMonth(dateStr);
  return WEEK_THEMES[week - 1];
}

export const DAILY_PARTS: TaskCategory[] = ["activities", "work", "learning"];

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
