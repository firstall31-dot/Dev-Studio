import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageContainer, TabNav, SplitLayout } from "@/components/layout";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { z } from "zod";
import { useForge, newId } from "@/lib/store";
import { SocialSidebar } from "@/components/social/social-sidebar";
import { PostEditor } from "@/components/social/post-editor";
import type { SocialDraft } from "@/types/tools";

const socialSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/social")({
  validateSearch: socialSearchSchema,
  head: () => ({
    meta: [{ title: "Social Media — Dev Studio" }],
  }),
  component: SocialPage,
});

const SOCIAL_TABS = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "twitter", label: "X / Twitter", icon: Twitter },
  { id: "instagram", label: "Instagram", icon: Instagram },
];

function SocialPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab || "linkedin";

  const { socialDrafts, upsertSocialDraft, deleteSocialDraft } = useForge();
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  // Switch active draft when platform changes
  useEffect(() => {
    const platformDrafts = socialDrafts.filter((d) => d.platform === tab);
    if (platformDrafts.length > 0 && !platformDrafts.some((d) => d.id === activeDraftId)) {
      setActiveDraftId(platformDrafts[0].id);
    } else if (platformDrafts.length === 0) {
      setActiveDraftId(null);
    }
  }, [tab, socialDrafts, activeDraftId]);

  const handleNewDraft = () => {
    const next = {
      id: newId("soc"),
      platform: tab,
      content: "",
      mediaUrls: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertSocialDraft(next);
    setActiveDraftId(next.id);
  };

  const handleUpdateDraft = (updates: Partial<SocialDraft>) => {
    const current = socialDrafts.find(d => d.id === activeDraftId);
    if (!current) return;
    upsertSocialDraft({ ...current, ...updates, updatedAt: Date.now() });
  };

  const activeDraft = socialDrafts.find((d) => d.id === activeDraftId) || null;

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader
            title="Social Media Management"
            description="Manage your posts, threads, and updates across all social platforms."
            className="mb-6"
          />
          <div className="w-full">
            <TabNav
              tabs={SOCIAL_TABS.map((t) => ({
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
            <SocialSidebar
              platform={tab}
              drafts={socialDrafts}
              activeDraftId={activeDraftId}
              onSelectDraft={setActiveDraftId}
              onNewDraft={handleNewDraft}
              onDeleteDraft={deleteSocialDraft}
            />
          }
          sidebarWidth="lg:w-[260px]"
          className="border-t border-border"
        >
          <div className="overflow-y-auto scrollbar-thin h-full w-full">
            <PostEditor
              platform={tab}
              activeDraft={activeDraft}
              onUpdateDraft={handleUpdateDraft}
              onSave={() => console.log("Saved!")}
            />
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
