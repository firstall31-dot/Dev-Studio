import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageContainer, TabNav, SplitLayout } from "@/components/layout";
import { Users, Building2, Briefcase } from "lucide-react";
import { z } from "zod";
import { useForge, newId } from "@/lib/store";
import { ConnectorsSidebar } from "@/components/connectors/connectors-sidebar";
import { ConnectorEditor } from "@/components/connectors/connector-editor";
import type { Connector } from "@/types/tools";

const connectorsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/connectors")({
  validateSearch: connectorsSearchSchema,
  head: () => ({
    meta: [{ title: "Connectors — Dev Studio" }],
  }),
  component: ConnectorsPage,
});

const CONNECTORS_TABS = [
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "hr", label: "HR Contacts", icon: Briefcase },
  { id: "clients", label: "Clients", icon: Users },
];

function ConnectorsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab || "companies";

  const { connectors, upsertConnector, deleteConnector } = useForge();
  const [activeConnectorId, setActiveConnectorId] = useState<string | null>(null);

  // Switch active connector when tab changes
  useEffect(() => {
    const tabConnectors = connectors.filter((c) => c.type === tab);
    if (tabConnectors.length > 0 && !tabConnectors.some((c) => c.id === activeConnectorId)) {
      setActiveConnectorId(tabConnectors[0].id);
    } else if (tabConnectors.length === 0) {
      setActiveConnectorId(null);
    }
  }, [tab, connectors, activeConnectorId]);

  const handleNewConnector = () => {
    const next: Connector = {
      id: newId("conn"),
      type: tab,
      name: "New Contact",
      email: "",
      phone: "",
      notes: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertConnector(next);
    setActiveConnectorId(next.id);
  };

  const handleUpdateConnector = (updates: Partial<Connector>) => {
    const current = connectors.find(c => c.id === activeConnectorId);
    if (!current) return;
    upsertConnector({ ...current, ...updates, updatedAt: Date.now() });
  };

  const activeConnector = connectors.find((c) => c.id === activeConnectorId) || null;

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader
            title="Connectors"
            description="Manage your professional network, clients, and company contacts."
            className="mb-6"
          />
          <div className="w-full overflow-hidden">
            <TabNav
              tabs={CONNECTORS_TABS.map((t) => ({
                ...t,
                onClick: () => navigate({ to: ".", search: { tab: t.id } }),
              }))}
              activeTab={tab}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SplitLayout
          sidebar={
            <ConnectorsSidebar
              type={tab}
              connectors={connectors}
              activeConnectorId={activeConnectorId}
              onSelectConnector={setActiveConnectorId}
              onNewConnector={handleNewConnector}
              onDeleteConnector={deleteConnector}
            />
          }
          sidebarWidth="lg:w-[260px]"
          className="border-t border-border"
        >
          <div className="overflow-y-auto scrollbar-thin h-full w-full">
            <ConnectorEditor
              type={tab}
              activeConnector={activeConnector}
              onUpdateConnector={handleUpdateConnector}
              onSave={() => console.log("Saved!")}
            />
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
