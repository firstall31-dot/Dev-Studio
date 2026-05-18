import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageContainer, PageSection, TabNav } from "@/components/layout";
import { Package } from "lucide-react";
import { Prompts } from "@/components/tools/prompts";
import { Agents } from "@/components/tools/agents";
import { Components } from "@/components/tools/components";
import { Templates } from "@/components/tools/templates";
import { Snippets } from "@/components/tools/snippets";
import { TOOLS_TABS } from "@/constants";

type ToolTab = "prompts" | "agents" | "components" | "templates" | "snippets";

interface ToolSearchParams {
  tab?: ToolTab;
  id?: string;
}

export const Route = createFileRoute("/tools")({
  validateSearch: (search: Record<string, unknown>): ToolSearchParams => {
    return {
      tab: (search.tab as ToolTab) || "prompts",
      id: search.id as string | undefined,
    };
  },
  component: ToolsPage,
});

function ToolsPage() {
  const { tab, id } = Route.useSearch();
  const navigate = Route.useNavigate();

  const setTab = (newTab: ToolTab) => {
    navigate({ search: { tab: newTab, id: undefined } });
  };

  return (
    <PageContainer>
      <PageSection>
        <PageHeader
          icon={Package}
          eyebrow="Asset Library"
          title="Tools & Assets"
          className="mb-4"
        />
        <TabNav
          tabs={TOOLS_TABS.map((t) => ({
            ...t,
            onClick: () => setTab(t.id as ToolTab),
          }))}
          activeTab={tab as string}
        />
      </PageSection>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {tab === "prompts"    && <Prompts selectedId={id} />}
        {tab === "agents"     && <Agents selectedId={id} />}
        {tab === "components" && <Components selectedId={id} />}
        {tab === "templates"  && <Templates selectedId={id} />}
        {tab === "snippets"   && <Snippets selectedId={id} />}
      </div>
    </PageContainer>
  );
}
