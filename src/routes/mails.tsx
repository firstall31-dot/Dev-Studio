import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageContainer, TabNav, SplitLayout } from "@/components/layout";
import { Mail, Send, MessageCircle } from "lucide-react";
import { z } from "zod";
import { useForge, newId } from "@/lib/store";
import { MailsSidebar } from "@/components/mails/mails-sidebar";
import { TemplateEditor } from "@/components/mails/template-editor";
import type { MailTemplate } from "@/types/tools";

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

const MAIL_TABS = [
  { id: "cover-letter", label: "Cover Letters", icon: Send },
  { id: "gmail", label: "Professional Emails", icon: Mail },
  { id: "whatsapp", label: "Business Chat", icon: MessageCircle },
];

function MailsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab || "cover-letter";

  const { mailTemplates, upsertMailTemplate, deleteMailTemplate } = useForge();
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  // Switch active mail when channel changes
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
    const current = mailTemplates.find(m => m.id === activeTemplateId);
    if (!current) return;
    upsertMailTemplate({ ...current, ...updates, updatedAt: Date.now() });
  };

  const activeMail = mailTemplates.find((m) => m.id === activeTemplateId) || null;

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader
            title="Communication Hub"
            description="Manage your professional emails, cover letters, and outreach templates."
            className="mb-6"
          />
          <div className="w-full">
            <TabNav
              tabs={MAIL_TABS.map((t) => ({
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
          className="border-t border-border"
        >
          <div className="overflow-y-auto scrollbar-thin h-full w-full">
            <TemplateEditor
              channel={tab}
              activeTemplate={activeMail}
              onUpdateTemplate={handleUpdateMail}
              onSave={() => console.log("Saved!")}
            />
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
