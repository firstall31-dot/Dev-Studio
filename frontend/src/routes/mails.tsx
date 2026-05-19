import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageContainer, PageSection, TabNav, SplitLayout } from "@/components/layout";
import { Mail } from "lucide-react";
import { z } from "zod";
import { useForge, newId } from "@/lib/store";
import { MailsSidebar } from "@/components/mails/mails-sidebar";
import { TemplateEditor } from "@/components/mails/template-editor";
import type { MailTemplate } from "@/types/tools";
import { MAIL_TABS } from "@/constants";
import { MailChannel } from "@shared/enums";

const mailsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/mails")({
  validateSearch: mailsSearchSchema,
  head: () => ({
    meta: [{ title: "Communications — Dev Studio" }],
  }),
  component: MailsPage,
});

function MailsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = (search.tab || "cover-letter") as MailChannel;

  const { mailTemplates, upsertMailTemplate, deleteMailTemplate } = useForge();
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const channelMails = mailTemplates.filter((m) => m.channel === tab);
    if (channelMails.length > 0 && !channelMails.some((m) => m.id === activeTemplateId)) {
      setActiveTemplateId(channelMails[0].id);
    } else if (channelMails.length === 0) {
      setActiveTemplateId(null);
    }
  }, [tab, mailTemplates, activeTemplateId]);

  const handleNewMail = () => {
    const next: MailTemplate = {
      id: newId("mail"),
      channel: tab,
      subject: tab === "whatsapp" ? "" : "New Template",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertMailTemplate(next);
    setActiveTemplateId(next.id);
  };

  const handleUpdateMail = (updates: Partial<MailTemplate>) => {
    const current = mailTemplates.find((m) => m.id === activeTemplateId);
    if (!current) return;
    upsertMailTemplate({ ...current, ...updates, updatedAt: Date.now() });
  };

  const activeMail = mailTemplates.find((m) => m.id === activeTemplateId) || null;

  return (
    <PageContainer>
      <PageSection>
        <PageHeader icon={Mail} title="Communication Hub" className="mb-4" />
        <TabNav
          tabs={MAIL_TABS.map((t) => ({
            ...t,
            onClick: () => navigate({ to: ".", search: { tab: t.id } }),
          }))}
          activeTab={tab}
        />
      </PageSection>

      <div className="flex-1 min-h-0 overflow-hidden">
        <SplitLayout
          sidebar={
            <MailsSidebar
              channel={tab}
              templates={mailTemplates}
              activeTemplateId={activeTemplateId}
              onSelectTemplate={setActiveTemplateId}
              onNewTemplate={handleNewMail}
              onDeleteTemplate={deleteMailTemplate}
            />
          }
          sidebarWidth="lg:w-[260px]"
          className=""
        >
          <div className="overflow-y-auto scrollbar-thin h-full w-full">
            <TemplateEditor
              channel={tab}
              activeTemplate={activeMail}
              onUpdateTemplate={handleUpdateMail}
              onSave={() => {}}
            />
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
