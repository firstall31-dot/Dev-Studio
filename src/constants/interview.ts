import { Globe, Server, Database, Container, Layout, Cpu } from "lucide-react";
import type { Difficulty, FocusArea } from "@/types/common";

export const DIFFICULTIES: Difficulty[] = ["junior", "mid", "senior"];

export const FOCUS_AREAS: FocusArea[] = ["frontend", "backend", "devops", "testing", "database", "general"];

export const DEPTH_LABEL_PRESETS = [
  "Deep dive",
  "Code example",
  "Real-world scenario",
  "Common mistake / Gotcha",
  "Follow-up question",
  "Step-by-step",
  "Senior perspective",
  "Custom…",
];

export const DOMAINS = [
  { id: "frontend", label: "Frontend", icon: Globe },
  { id: "backend", label: "Backend", icon: Server },
  { id: "database", label: "Database", icon: Database },
  { id: "devops", label: "DevOps", icon: Container },
  { id: "architecture", label: "Architecture", icon: Layout },
  { id: "core", label: "Core CS", icon: Cpu },
];

export const DIFF_COLORS: Record<string, string> = {
  junior: "bg-primary/10 text-primary border-primary/20",
  mid: "bg-primary/10 text-primary border-primary/20",
  senior: "bg-primary/10 text-primary border-primary/20",
};

export const DEPTH_COLORS = [
  "border-primary/30 bg-primary/5 text-primary",
  "border-primary/40 bg-primary/10 text-primary",
  "border-primary/50 bg-primary/15 text-primary",
  "border-primary/60 bg-primary/20 text-primary",
  "border-primary/70 bg-primary/25 text-primary",
  "border-primary/80 bg-primary/30 text-primary",
];
