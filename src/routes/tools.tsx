import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageContainer, PageSection, TabNav } from "@/components/layout";
import { Sparkles, Bot, Component as ComponentIcon, LayoutTemplate, Code2, Package } from "lucide-react";
import { Prompts } from "@/components/tools/prompts";
import { Agents } from "@/components/tools/agents";
import { Components } from "@/components/tools/components";
import { Templates } from "@/components/tools/templates";
import { Snippets } from "@/components/tools/snippets";

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

  const tabs = [
    { id: "prompts",    label: "Prompts",    icon: Sparkles },
    { id: "agents",     label: "Agents",     icon: Bot },
    { id: "components", label: "Components", icon: ComponentIcon },
    { id: "templates",  label: "Templates",  icon: LayoutTemplate },
    { id: "snippets",   label: "Snippets",   icon: Code2 },
  ] as const;

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
          tabs={tabs.map((t) => ({
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
