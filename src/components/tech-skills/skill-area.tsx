import { useState, useEffect } from "react";
import {
  BookOpen, CheckSquare, ExternalLink, GraduationCap,
  Search, Plus, ChevronRight, LucideIcon,
} from "lucide-react";
import type { SkillAreaData } from "@/types/skills";
import { OverviewSection }   from "./overview-section";
import { ChecklistSection }  from "./checklist-section";
import { InterviewSection }  from "./interview-section";
import { ResourcesSection }  from "./resources-section";
import { SplitLayout, TabNav } from "../layout";
import { cn } from "@/lib/utils";

type SectionId = "overview" | "checklist" | "interview" | "resources";

interface SubAreaTab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",     icon: BookOpen },
  { id: "checklist", label: "Checklist",    icon: CheckSquare },
  { id: "interview", label: "Interview Q&A", icon: GraduationCap },
  { id: "resources", label: "Resources",    icon: ExternalLink },
];

const ADD_SECTIONS: SectionId[] = ["interview"];

export function SkillArea({
  data,
  activeSubArea,
  subAreaGroups,
}: {
  data: SkillAreaData;
  activeSubArea?: string;
  /** Maps parent sub-area id → its children tabs. Used for both inner tab nav and sidebar grouping. */
  subAreaGroups?: Record<string, SubAreaTab[]>;
}) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [subArea, setSubArea] = useState<string>(
    activeSubArea || data.subAreas?.[0]?.id || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [addTrigger, setAddTrigger]   = useState(0);

  // Which group parents are open in the sidebar
  const initExpanded = (): Set<string> => {
    const s = new Set<string>();
    if (!subAreaGroups) return s;
    const target = activeSubArea || data.subAreas?.[0]?.id || "";
    Object.entries(subAreaGroups).forEach(([parentId, children]) => {
      if (parentId === target || children.some(c => c.id === target)) s.add(parentId);
    });
    return s;
  };
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(initExpanded);

  // Sync subArea when main tab changes
  useEffect(() => {
    if (activeSubArea) setSubArea(activeSubArea);
  }, [activeSubArea]);

  // Auto-expand the group containing the newly selected subArea
  useEffect(() => {
    if (!subAreaGroups) return;
    Object.entries(subAreaGroups).forEach(([parentId, children]) => {
      if (subArea === parentId || children.some(c => c.id === subArea)) {
        setExpandedGroups(prev => new Set([...prev, parentId]));
      }
    });
  }, [subArea]);

  useEffect(() => {
    setSubArea(data.subAreas?.[0]?.id || "");
    setActiveSection("overview");
    setSearchQuery("");
  }, [data.id]);

  const toggleGroup = (id: string) =>
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // IDs that live as children under a group parent — excluded from top-level list
  const childIds = new Set(
    Object.values(subAreaGroups ?? {}).flatMap(ch => ch.map(c => c.id)),
  );

  const filteredSubAreas = data.subAreas?.filter(sa =>
    sa.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Top-level items: not a child of any group (or no groups exist)
  const topLevel = subAreaGroups
    ? filteredSubAreas?.filter(sa => !childIds.has(sa.id))
    : filteredSubAreas;

  const canAdd  = ADD_SECTIONS.includes(activeSection);
  const addLabel = activeSection === "interview" ? "Add Q&A" : "Add";

  // Inner tab nav — sections + active group's children
  const activeGroupChildren: SubAreaTab[] = subAreaGroups?.[activeSubArea ?? ""] ?? [];
  const subAreaTabIds = new Set(activeGroupChildren.map(t => t.id));

  const allTabs = [
    ...SECTIONS.map(s => ({ id: s.id, label: s.label, icon: s.icon, isSubArea: false })),
    ...activeGroupChildren.map(t => ({ id: t.id, label: t.label, icon: t.icon, isSubArea: true })),
  ];

  const activeTabId = subAreaTabIds.has(subArea) ? subArea : activeSection;

  const handleTabClick = (id: string, isSubArea: boolean) => {
    if (isSubArea) {
      setSubArea(id);
      setActiveSection("overview");
    } else {
      setActiveSection(id as SectionId);
      if (subAreaTabIds.has(subArea)) {
        setSubArea(activeSubArea || data.subAreas?.[0]?.id || "");
      }
    }
  };

  /* ── Sidebar ──────────────────────────────────────────── */
  const renderSidebarItem = (sa: { id: string; label: string; icon?: any }) => {
    const SaIcon   = sa.icon;
    const isActive = subArea === sa.id;
    return (
      <button
        key={sa.id}
        onClick={() => {
          setSubArea(sa.id);
          if (subAreaTabIds.has(sa.id)) setActiveSection("overview");
        }}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all",
          isActive
            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          {SaIcon && <SaIcon className="size-3 shrink-0" />}
          <span className={isActive ? "text-foreground" : ""}>{sa.label}</span>
        </div>
        {isActive && !subAreaGroups?.[sa.id] && (
          <ChevronRight className="size-3 text-primary shrink-0" />
        )}
      </button>
    );
  };

  const sidebar = (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-3 py-3 border-b border-border/60 shrink-0 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
            <data.icon className="size-3.5" />
          </div>
          <span className="flex-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 truncate">
            {data.label}
          </span>
          <button
            onClick={() => canAdd && setAddTrigger(n => n + 1)}
            title={addLabel}
            className={cn(
              "size-6 rounded-lg flex items-center justify-center transition-all",
              canAdd
                ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                : "text-muted-foreground/25 cursor-default pointer-events-none",
            )}
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        {data.subAreas && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                data.id === "softskills"
                  ? "Filter topics…"
                  : data.subAreasLabel
                  ? `Filter ${data.subAreasLabel.toLowerCase()}…`
                  : "Filter stacks…"
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {data.subAreas && (
          <div>
            <p className="px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
              {data.id === "softskills"
                ? "Topics"
                : data.subAreasLabel
                ? data.subAreasLabel
                : "Stacks / Frameworks"}
            </p>
            <nav className="space-y-0.5">
              {topLevel?.map(sa => {
                const children = subAreaGroups?.[sa.id];
                const hasChildren = children && children.length > 0;

                if (!hasChildren) return renderSidebarItem(sa);

                // — Collapsible group —
                const isOpen   = expandedGroups.has(sa.id);
                const SaIcon   = sa.icon;
                const isActive = subArea === sa.id;
                const childActive = children.some(c => c.id === subArea);

                return (
                  <div key={sa.id}>
                    {/* Group header */}
                    <div
                      className={cn(
                        "flex items-center rounded-xl text-xs font-medium transition-all",
                        isActive || childActive
                          ? "bg-primary/10 ring-1 ring-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      {/* Clickable label area */}
                      <button
                        onClick={() => {
                          setSubArea(sa.id);
                          if (subAreaTabIds.has(sa.id)) setActiveSection("overview");
                        }}
                        className="flex-1 flex items-center gap-2 px-3 py-2 text-left"
                      >
                        {SaIcon && <SaIcon className="size-3 shrink-0" />}
                        <span className={isActive || childActive ? "text-foreground" : ""}>
                          {sa.label}
                        </span>
                      </button>

                      {/* Collapse / expand toggle */}
                      <button
                        onClick={() => toggleGroup(sa.id)}
                        className="px-2 py-2 rounded-r-xl hover:bg-primary/10 transition-colors"
                        title={isOpen ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          className={cn(
                            "size-3 transition-transform duration-200",
                            isOpen ? "rotate-90" : "",
                            isActive || childActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      </button>
                    </div>

                    {/* Children (animated) */}
                    {isOpen && (
                      <div className="ml-3 mt-0.5 pl-2 border-l border-border/40 space-y-0.5 pb-1">
                        {children.map(child => {
                          const ChildIcon   = child.icon;
                          const childActive = subArea === child.id;
                          return (
                            <button
                              key={child.id}
                              onClick={() => {
                                setSubArea(child.id);
                                setActiveSection("overview");
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                                childActive
                                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                              )}
                            >
                              {ChildIcon && <ChildIcon className="size-3 shrink-0" />}
                              <span className={childActive ? "text-foreground" : ""}>
                                {child.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {topLevel?.length === 0 && (
                <p className="text-[10px] text-center text-muted-foreground py-6 italic">
                  No matching topics found
                </p>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Main content ─────────────────────────────────────── */
  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[240px]">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-border/60 shrink-0">
          <TabNav
            tabs={allTabs.map(t => ({
              id: t.id, label: t.label, icon: t.icon as LucideIcon | undefined,
              onClick: () => handleTabClick(t.id, t.isSubArea),
            }))}
            activeTab={activeTabId}
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-8">
            {activeSection === "overview"  && <OverviewSection  data={data} subArea={subArea} onSubAreaChange={setSubArea} />}
            {activeSection === "checklist" && <ChecklistSection data={data} />}
            {activeSection === "interview" && <InterviewSection data={data} triggerAdd={addTrigger} />}
            {activeSection === "resources" && <ResourcesSection data={data} subArea={subArea} />}
          </div>
        </div>
      </div>
    </SplitLayout>
  );
}
