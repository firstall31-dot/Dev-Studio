import { useState, useEffect } from "react";
import { BookOpen, CheckSquare, ExternalLink, GraduationCap, ChevronRight, Search } from "lucide-react";
import type { SkillAreaData } from "@/types/skills";
import { OverviewSection } from "./overview-section";
import { ChecklistSection } from "./checklist-section";
import { InterviewSection } from "./interview-section";
import { ResourcesSection } from "./resources-section";

type SectionId = "overview" | "checklist" | "interview" | "resources";

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "checklist", label: "Production Checklist", icon: CheckSquare },
  { id: "interview", label: "Interview Q&A", icon: GraduationCap },
  { id: "resources", label: "Resources", icon: ExternalLink },
];

import { SplitLayout } from "../layout";

export function SkillArea({
  data,
  activeSubArea,
}: {
  data: SkillAreaData;
  activeSubArea?: string;
}) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [subArea, setSubArea] = useState<string>(
    activeSubArea || data.subAreas?.[0]?.id || "",
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeSubArea) {
      setSubArea(activeSubArea);
    }
  }, [activeSubArea]);

  const filteredSubAreas = data.subAreas?.filter(sa =>
    sa.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebar = (
    <div className="h-full flex flex-col min-h-0">
      <div className="p-6 pb-2 sticky top-0 bg-background/80 backdrop-blur-md z-20 space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <data.icon className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{data.label}</h3>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Focus Area
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <span className="shrink-0">
                  <Icon className="size-3.5" />
                </span>
                {s.label}
              </button>
            );
          })}
        </nav>

        {data.subAreas && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Filter topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/50 border border-border rounded-lg py-1.5 pl-9 pr-3 text-[11px] outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin">
        {data.subAreas && (
          <div className="mt-2">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 mb-3 sticky top-0 bg-background/80 backdrop-blur-sm py-1 z-10">
              {data.id === "softskills" ? "Topics" : "Stacks / Frameworks"}
            </h4>
            <nav className="space-y-1">
              {filteredSubAreas?.map((sa) => {
                const SaIcon = sa.icon;
                const active = subArea === sa.id;
                return (
                  <button
                    key={sa.id}
                    onClick={() => setSubArea(sa.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      active
                        ? "bg-card text-foreground border border-border shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {SaIcon && <SaIcon className="size-3" />}
                      {sa.label}
                    </div>
                    {active && <ChevronRight className="size-3 text-primary" />}
                  </button>
                );
              })}
              {filteredSubAreas?.length === 0 && (
                <p className="text-[10px] text-center text-muted-foreground py-4 italic">
                  No matching topics found
                </p>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[260px]" className="border-t border-border">
      <div className="overflow-y-auto scrollbar-thin h-full w-full">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-10">
          {activeSection === "overview" && (
            <OverviewSection data={data} subArea={subArea} onSubAreaChange={setSubArea} />
          )}
          {activeSection === "checklist" && <ChecklistSection data={data} />}
          {activeSection === "interview" && <InterviewSection data={data} />}
          {activeSection === "resources" && <ResourcesSection data={data} subArea={subArea} />}
        </div>
      </div>
    </SplitLayout>
  );
}
