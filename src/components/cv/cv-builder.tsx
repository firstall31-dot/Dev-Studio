import { useState } from "react";
import { Save, User, Briefcase, GraduationCap, Code2, FolderGit2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/tools/shared";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CVPersonal } from "./cv-personal";
import { CVExperienceSection } from "./cv-experience";
import { CVSkillsSection } from "./cv-skills";
import { CVEducationSection } from "./cv-education";
import { CVProjectsSection } from "./cv-projects";
import { ATSChecker } from "./ats-checker";
import type { CVProfile, CVFocus } from "@/types/cv";
import { FOCUS_LABELS } from "@/types/cv";

interface CVBuilderProps {
  cv: CVProfile;
  onUpdate: (cv: CVProfile) => void;
  onSave: () => void;
}

const BUILDER_TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "ats", label: "ATS Check", icon: Sparkles },
] as const;

type BuilderTab = typeof BUILDER_TABS[number]["id"];

export function CVBuilder({ cv, onUpdate, onSave }: CVBuilderProps) {
  const [activeTab, setActiveTab] = useState<BuilderTab>("personal");

  const patch = <K extends keyof CVProfile>(key: K, value: CVProfile[K]) =>
    onUpdate({ ...cv, [key]: value, updatedAt: Date.now() });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <Input
            type="text"
            value={cv.title}
            onChange={(e) => patch("title", e.target.value)}
            placeholder="CV Title (e.g. Frontend Engineer CV)"
            className="max-w-[280px] font-medium"
          />
          <Select value={cv.focus} onValueChange={(v) => patch("focus", v as CVFocus)}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FOCUS_LABELS) as CVFocus[]).map((f) => (
                <SelectItem key={f} value={f}>{FOCUS_LABELS[f]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onSave} size="sm" className="gap-2 shrink-0">
          <Save className="size-3.5" /> Save CV
        </Button>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-0.5 border-b border-border px-3 overflow-x-auto scrollbar-thin">
        {BUILDER_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            } ${id === "ats" ? "ml-auto text-primary/80" : ""}`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "ats" ? (
          <div className="h-full overflow-y-auto scrollbar-thin">
            <ATSChecker cvProfile={cv} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto scrollbar-thin">
            <div className="p-4 sm:p-6 max-w-3xl">
              {activeTab === "personal" && (
                <Section title="Personal Information" desc="Your contact details and online presence.">
                  <CVPersonal data={cv.personalInfo} onChange={(v) => patch("personalInfo", v)} />
                  <div className="mt-5 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Professional Summary</label>
                    <textarea
                      value={cv.summary}
                      onChange={(e) => patch("summary", e.target.value)}
                      rows={5}
                      placeholder={`Write a concise 2-4 sentence summary that highlights your experience, tech stack, and what you bring to the role.\n\nExample: Senior Frontend Engineer with 5+ years building scalable web applications using React and TypeScript...`}
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <p className="text-[10px] text-muted-foreground">{cv.summary.length} characters · Aim for 300-600 characters for optimal ATS performance</p>
                  </div>
                </Section>
              )}
              {activeTab === "experience" && (
                <Section title="Work Experience" desc="List your positions from most recent to oldest.">
                  <CVExperienceSection data={cv.experience} onChange={(v) => patch("experience", v)} />
                </Section>
              )}
              {activeTab === "skills" && (
                <Section title="Skills" desc="Add your technical and soft skills. The focus area suggests relevant keywords.">
                  <CVSkillsSection data={cv.skills} focus={cv.focus} onChange={(v) => patch("skills", v)} />
                </Section>
              )}
              {activeTab === "education" && (
                <Section title="Education" desc="Academic qualifications and certifications.">
                  <CVEducationSection data={cv.education} onChange={(v) => patch("education", v)} />
                </Section>
              )}
              {activeTab === "projects" && (
                <Section title="Projects" desc="Showcase your portfolio projects and open source contributions.">
                  <CVProjectsSection data={cv.projects} onChange={(v) => patch("projects", v)} />
                </Section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}
