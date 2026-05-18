import type { TaskPriority, TaskStatus, TaskCategory } from "@/types/planner";
import type { LucideIcon } from "lucide-react";
import { Sunrise, Briefcase, BookOpen, Zap, ShieldCheck, Database, FileCode2, Monitor } from "lucide-react";

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  activities: "Activities",
  work:       "Work Block",
  learning:   "Learning",
  general:    "General",
};

export const CATEGORY_ICON_COMPONENTS: Record<TaskCategory, LucideIcon> = {
  activities: Sunrise,
  work:       Briefcase,
  learning:   BookOpen,
  general:    Zap,
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

export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];
export const TASK_STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];
export const TASK_CATEGORIES = Object.keys(CATEGORY_LABELS) as TaskCategory[];

export const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string; dot: string }[] = [
  { value: "low",    label: "Low",  dot: "bg-emerald-500" },
  { value: "medium", label: "Med",  dot: "bg-amber-400"   },
  { value: "high",   label: "High", dot: "bg-red-500"     },
];

export const TASK_TIME_OPTIONS = [
  { value: 15,  label: "15m"    },
  { value: 30,  label: "30m"    },
  { value: 60,  label: "1h"     },
  { value: 90,  label: "1h 30m" },
  { value: 120, label: "2h"     },
  { value: 180, label: "3h"     },
  { value: 240, label: "4h+"    },
];

export const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  low: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
  medium: "bg-amber-500/20 text-amber-600 border-amber-500/20",
  high: "bg-red-500/20 text-red-600 border-red-500/20",
};

export const PRIORITY_COLORS = PRIORITY_CLASSES;

export const STATUS_CLASSES: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground border-border",
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  done: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export type StatusFilter = "all" | "todo" | "in-progress" | "done";

export const STATUS_FILTERS: { id: StatusFilter; label: string; color: string }[] = [
  { id: "all",         label: "All",    color: "text-foreground" },
  { id: "todo",        label: "Todo",   color: "text-muted-foreground" },
  { id: "in-progress", label: "Active", color: "text-primary" },
  { id: "done",        label: "Done",   color: "text-emerald-600" },
];

export interface WeekTheme {
  week: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
}

export const WEEK_THEMES: WeekTheme[] = [
  {
    week: 1,
    title: "DevOps & Security",
    subtitle: "Infrastructure, CI/CD, Cyber",
    icon: ShieldCheck,
    color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    tags: ["Docker", "CI/CD", "Linux", "Nginx", "SSH", "Firewall", "Secrets"],
  },
  {
    week: 2,
    title: "Database & Scraping",
    subtitle: "SQL, NoSQL, Data pipelines",
    icon: Database,
    color: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20",
    tags: ["PostgreSQL", "Redis", "Playwright", "ETL", "SQL", "Indexing"],
  },
  {
    week: 3,
    title: "Code & Materials",
    subtitle: "Algorithms, Clean code, DSA",
    icon: FileCode2,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    tags: ["Refactoring", "DSA", "Patterns", "LeetCode", "Review", "Docs"],
  },
  {
    week: 4,
    title: "Frontend Frameworks",
    subtitle: "React, Next.js, UI/UX",
    icon: Monitor,
    color: "text-violet-600 bg-violet-500/10 border-violet-500/20",
    tags: ["React", "Next.js", "Tailwind", "State", "A11y", "Performance"],
  },
];

export const DAILY_PARTS: TaskCategory[] = ["activities", "work", "learning"];
