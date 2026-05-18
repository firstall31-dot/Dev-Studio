import {
  Moon, Dumbbell, Bath, Utensils,
  Briefcase, Timer, Coffee, MessageSquare,
  BookOpen, Monitor, FileCode2, BedDouble,
  Salad, UtensilsCrossed, Footprints, HeartPulse,
  Sparkles, Droplets,
  LucideIcon
} from "lucide-react";
import { STORAGE_KEYS } from "./system";

export interface ActivityItem {
  id: string;
  title: string;
  done: boolean;
  time?: string;
}

export interface ActivitySuggestion {
  Icon: LucideIcon;
  label: string;
  bestTime: string;
  reason: string;
}

export type InnerTab = "prayer" | "sports" | "care" | "food";

export const INNER_TABS: { id: InnerTab; label: string; icon: LucideIcon; color: string }[] = [
  { id: "prayer",  label: "Prayer",  icon: Moon,     color: "text-indigo-500" },
  { id: "sports",  label: "Sports",  icon: Dumbbell, color: "text-blue-500"   },
  { id: "care",    label: "Care",    icon: Bath,     color: "text-rose-500"   },
  { id: "food",    label: "Food",    icon: Utensils, color: "text-amber-500"  },
];

export const WORKING_SUGGESTIONS: ActivitySuggestion[] = [
  { Icon: Briefcase,    label: "Deep work block",  bestTime: "09:00 – 11:00", reason: "Peak focus window" },
  { Icon: Timer,        label: "Pomodoro × 4",     bestTime: "10:00 – 12:00", reason: "4 × 25-min sprints" },
  { Icon: Coffee,       label: "Morning standup",  bestTime: "09:00 – 09:15", reason: "Quick daily sync" },
  { Icon: MessageSquare,label: "Email & Slack",    bestTime: "12:30 – 13:00", reason: "Batch check after lunch" },
];

export const LEARNING_SUGGESTIONS: ActivitySuggestion[] = [
  { Icon: BookOpen,  label: "Read docs",        bestTime: "08:00 – 09:00", reason: "Fresh morning mind" },
  { Icon: Monitor,   label: "Watch tutorial",   bestTime: "14:00 – 15:00", reason: "Post-lunch learning" },
  { Icon: FileCode2, label: "Practice / build", bestTime: "15:00 – 17:00", reason: "Apply what you learned" },
  { Icon: BedDouble, label: "Review notes",     bestTime: "21:00 – 21:30", reason: "Before sleep — boosts retention" },
];

export const ACTIVITIES_STORAGE_KEY = STORAGE_KEYS.ACTIVITIES;
export const PRAYER_TRACKER_KEY = STORAGE_KEYS.PRAYER_TRACKER;

export const PRESET_FOOD: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Breakfast",           time: "" },
  { title: "Lunch",               time: "" },
  { title: "Dinner",              time: "" },
  { title: "Morning hydration",   time: "" },
  { title: "Evening supplements", time: "" },
];
export const PRESET_SPORTS: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Strength training", time: "" },
  { title: "Morning walk",      time: "" },
  { title: "Cardio / run",      time: "" },
  { title: "Yoga / stretching", time: "" },
  { title: "Sports session",    time: "" },
];
export const PRESET_CARE: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Morning grooming", time: "" },
  { title: "Shower / bath",    time: "" },
  { title: "Skincare routine", time: "" },
  { title: "Meditation",       time: "" },
  { title: "Sleep prep",       time: "" },
];
export const PRESET_WORKING: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Deep work block",  time: "" },
  { title: "Code review",      time: "" },
  { title: "Planning session", time: "" },
  { title: "Email & Slack",    time: "" },
  { title: "Team standup",     time: "" },
];
export const PRESET_LEARNING: Omit<ActivityItem, "id" | "done">[] = [
  { title: "Read documentation", time: "" },
  { title: "Watch tutorial",     time: "" },
  { title: "Practice exercises", time: "" },
  { title: "Review notes",       time: "" },
  { title: "Build a project",    time: "" },
];
