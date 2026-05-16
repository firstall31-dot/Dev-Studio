import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageContainer, PageSection, PageHeader, SplitLayout } from "@/components/layout";
import { FileText } from "lucide-react";
import { useForge, newId } from "@/lib/store";
import { CVSidebar } from "@/components/cv/cv-sidebar";
import { CVBuilder } from "@/components/cv/cv-builder";
import type { CVProfile } from "@/types/cv";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [{ title: "CV Builder — Dev Studio" }],
  }),
  component: CVPage,
});

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
          title="CV Builder"
          description="Create tailored CVs for Frontend, Backend, and Fullstack roles. Check ATS compatibility before applying."
          className="mb-6"
        />
      </PageSection>

      <div className="flex-1 overflow-hidden">
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
          className="border-t border-border"
        >
          <div className="h-full overflow-hidden">
            {draft ? (
              <CVBuilder cv={draft} onUpdate={setDraft} onSave={handleSave} />
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
