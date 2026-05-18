import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  PageContainer, PageSection, PageHeader, TabNav, SplitLayout,
} from "@/components/layout";
import { FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForge, newId } from "@/lib/store";
import { CVSidebar } from "@/components/cv/cv-sidebar";
import { CVBuilder } from "@/components/cv/cv-builder";
import type { CVProfile } from "@/types/cv";
import { BUILDER_TABS } from "@/constants";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [{ title: "CV Builder — Dev Studio" }],
  }),
  component: CVPage,
});

type BuilderTab = typeof BUILDER_TABS[number]["id"];


function defaultCV(id: string): CVProfile {
  return {
    id,
    title: "My CV",
    focus: "frontend",
    personalInfo: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "", title: "" },
    summary: "",
    experience: [],
    skills: { technical: [], soft: [], tools: [], languages: [] },
    education: [],
    projects: [],
    languages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function CVPage() {
  const { cvProfiles, upsertCVProfile, deleteCVProfile } = useForge();
  const [activeCVId, setActiveCVId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CVProfile | null>(null);
  const [activeTab, setActiveTab] = useState<BuilderTab>("personal");

  useEffect(() => {
    if (cvProfiles.length > 0 && !activeCVId) {
      setActiveCVId(cvProfiles[0].id);
    }
  }, [cvProfiles, activeCVId]);

  useEffect(() => {
    if (activeCVId) {
      const found = cvProfiles.find((cv) => cv.id === activeCVId);
      if (found) setDraft(found);
    }
  }, [activeCVId, cvProfiles]);

  const handleNewCV = () => {
    const id = newId("cv");
    const cv = defaultCV(id);
    setActiveCVId(id);
    setDraft(cv);
    setActiveTab("personal");
  };

  const handleSave = async () => {
    if (!draft) return;
    await upsertCVProfile(draft);
    if (!cvProfiles.some((cv) => cv.id === draft.id)) {
      setActiveCVId(draft.id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCVProfile(id);
    const remaining = cvProfiles.filter((cv) => cv.id !== id);
    if (remaining.length > 0) {
      setActiveCVId(remaining[0].id);
    } else {
      setActiveCVId(null);
      setDraft(null);
    }
  };

  return (
    <PageContainer>
      <PageSection>
        <PageHeader
          icon={FileText}
          title="CV Builder"
          className="mb-4"
          actions={
            draft ? (
              <Button onClick={handleSave} size="sm" className="gap-2 shrink-0">
                <Save className="size-3.5" /> Save CV
              </Button>
            ) : undefined
          }
        />
        <TabNav
          tabs={BUILDER_TABS.map((t) => ({
            ...t,
            onClick: () => setActiveTab(t.id),
          }))}
          activeTab={activeTab}
        />
      </PageSection>

      <div className="flex-1 min-h-0 overflow-hidden">
        <SplitLayout
          sidebar={
            <CVSidebar
              cvProfiles={cvProfiles}
              activeCVId={activeCVId}
              onSelectCV={setActiveCVId}
              onNewCV={handleNewCV}
              onDeleteCV={handleDelete}
            />
          }
          sidebarWidth="lg:w-[260px]"
        >
          <div className="h-full overflow-hidden">
            {draft ? (
              <CVBuilder cv={draft} onUpdate={setDraft} activeTab={activeTab} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4 p-8">
                <div className="size-14 rounded-full bg-muted/20 flex items-center justify-center">
                  <FileText className="size-6 opacity-40" />
                </div>
                <div>
                  <p className="text-sm font-medium">No CV selected</p>
                  <p className="text-xs mt-1 opacity-70">Create a new CV from the sidebar to get started</p>
                </div>
              </div>
            )}
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
