import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SkillTabs } from "@/components/tech-skills/skill-tabs";
import { SkillArea } from "@/components/tech-skills/skill-area";
import { MaterialsView } from "@/components/tech-skills/materials-view";
import { MockChatView } from "@/components/ai-mock/mock-chat-view";
import { PageHeader, PageContainer, PageSection } from "@/components/layout";
import { TECH_AREAS } from "@/data/skills";
import type { TechAreaId } from "@/types/skills";
import { Code2 } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  tab: z
    .enum([
      "frontend",
      "backend",
      "devops",
      "testing",
      "database",
      "design-patterns",
      "architecture",
      "system-design",
      "microservices",
      "security",
      "performance",
      "materials",
      "ai-mock",
    ])
    .optional()
    .default("frontend"),
});

export const Route = createFileRoute("/tech-skills")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Technical Skills Hub — Dev Studio" },
      {
        name: "description",
        content:
          "Master frontend, backend, devops, testing, databases, design patterns, architecture, system design, microservices, security, and performance.",
      },
    ],
  }),
  component: TechSkillsPage,
});

const NON_AREA_TABS = new Set(["materials", "ai-mock"]);

function TechSkillsPage() {
  const { tab } = useSearch({ from: "/tech-skills" });

  return (
    <PageContainer>
      <PageSection>
        <PageHeader icon={Code2} title="Technical Skills Hub" className="mb-4" />
        <SkillTabs />
      </PageSection>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === "materials" ? (
          <MaterialsView />
        ) : tab === "ai-mock" ? (
          <MockChatView context="tech" />
        ) : (
          <SkillArea data={TECH_AREAS[tab as TechAreaId]} />
        )}
      </div>
    </PageContainer>
  );
}
