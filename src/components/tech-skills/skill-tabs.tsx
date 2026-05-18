import { useSearch } from "@tanstack/react-router";
import {
  Globe, Server, Container, FlaskConical, Database,
  MessageSquare, BookOpen, GitBranch, Cpu, Network, Boxes, Shield, Zap,
} from "lucide-react";
import { TabNav } from "../layout";

const TABS = [
  { to: "/tech-skills", search: { tab: "frontend" },         label: "Frontend",         icon: Globe,         id: "frontend" },
  { to: "/tech-skills", search: { tab: "backend" },          label: "Backend",          icon: Server,        id: "backend" },
  { to: "/tech-skills", search: { tab: "devops" },           label: "DevOps",           icon: Container,     id: "devops" },
  { to: "/tech-skills", search: { tab: "testing" },          label: "Testing",          icon: FlaskConical,  id: "testing" },
  { to: "/tech-skills", search: { tab: "database" },         label: "Database",         icon: Database,      id: "database" },
  { to: "/tech-skills", search: { tab: "design-patterns" },  label: "Design Patterns",  icon: GitBranch,     id: "design-patterns" },
  { to: "/tech-skills", search: { tab: "architecture" },     label: "Architecture",     icon: Cpu,           id: "architecture" },
  { to: "/tech-skills", search: { tab: "system-design" },    label: "System Design",    icon: Network,       id: "system-design" },
  { to: "/tech-skills", search: { tab: "microservices" },    label: "Microservices",    icon: Boxes,         id: "microservices" },
  { to: "/tech-skills", search: { tab: "security" },         label: "Security",         icon: Shield,        id: "security" },
  { to: "/tech-skills", search: { tab: "performance" },      label: "Performance",      icon: Zap,           id: "performance" },
  { to: "/tech-skills", search: { tab: "materials" },        label: "Materials",        icon: BookOpen,      id: "materials" },
  { to: "/tech-skills", search: { tab: "ai-mock" },          label: "AI Mock Chat",     icon: MessageSquare, id: "ai-mock" },
] as const;

export function SkillTabs() {
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const currentTab = searchParams.tab || "frontend";

  return (
    <TabNav
      tabs={TABS.map((t) => ({
        ...t,
        to: t.to as string,
        search: t.search as Record<string, unknown>,
      }))}
      activeTab={currentTab}
    />
  );
}
