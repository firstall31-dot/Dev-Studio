import { useSearch } from "@tanstack/react-router";
import { TabNav } from "../layout";
import { TECH_SKILL_TABS } from "@/constants";

export function SkillTabs() {
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const currentTab = searchParams.tab || "frontend";

  return (
    <TabNav
      tabs={TECH_SKILL_TABS.map((t) => ({
        ...t,
        to: t.to as string,
        search: t.search as Record<string, unknown>,
      }))}
      activeTab={currentTab}
    />
  );
}
