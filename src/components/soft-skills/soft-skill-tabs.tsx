import { useSearch } from "@tanstack/react-router";
import { TabNav } from "@/components/layout";
import { SOFT_SKILL_TABS } from "@/constants";

export function SoftSkillTabs() {
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const currentTab = searchParams.tab || "top-10";

  return (
    <TabNav
      tabs={SOFT_SKILL_TABS.map((t) => ({
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
