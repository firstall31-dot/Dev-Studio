import { useSearch } from "@tanstack/react-router";
import {
  MessageCircle,
  Target,
  Lightbulb,
  Users,
  MessageSquare,
} from "lucide-react";
import { TabNav } from "@/components/layout";

const TABS = [
  { id: "communication",   label: "Communication",   icon: MessageCircle },
  { id: "leadership",      label: "Leadership",       icon: Target },
  { id: "problem-solving", label: "Problem Solving",  icon: Lightbulb },
  { id: "teamwork",        label: "Teamwork",         icon: Users },
  { id: "ai-mock",         label: "AI Mock Chat",     icon: MessageSquare },
] as const;

export function SoftSkillTabs() {
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const currentTab = searchParams.tab || "communication";

  return (
    <TabNav
      tabs={TABS.map((t) => ({
        id: t.id,
        label: t.label,
        icon: t.icon,
        to: "/soft-skills",
        search: { tab: t.id } as Record<string, unknown>,
      }))}
      activeTab={currentTab}
    />
  );
}
