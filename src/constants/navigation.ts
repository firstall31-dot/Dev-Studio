import {
  LayoutDashboard,
  CalendarDays,
  Code2,
  Component as ComponentIcon,
  Bot,
  Users,
  FileText,
  Briefcase,
  Code,
  Heart,
  Linkedin,
  Twitter,
  Instagram,
  Send,
  Mail,
  MessageCircle,
  Building2,
  User,
  GraduationCap,
  FolderGit2,
  Sparkles,
  Trophy,
  Target,
  Lightbulb,
  MessageSquare,
  Globe,
  Server,
  Container,
  FlaskConical,
  Database,
  BookOpen,
  LayoutTemplate,
} from "lucide-react";

export const WORKSPACE_NAV = [
  { to: "/",        label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Planner",   icon: CalendarDays    },
  { to: "/tools",   label: "Tools",     icon: Code2           },
] as const;

export const COMMUNICATION_NAV = [
  { to: "/social",     label: "Social Media",      icon: ComponentIcon, match: ["/social"],     search: { tab: "linkedin" } },
  { to: "/mails",      label: "Mails & Messaging", icon: Bot,           match: ["/mails"],      search: { tab: "cover-letter" } },
  { to: "/connectors", label: "Connectors",         icon: Users,         match: ["/connectors"], search: { tab: "companies" } },
  { to: "/cv",         label: "CV Builder",         icon: FileText,      match: ["/cv"],         search: {} },
] as const;

export const FREELANCE_NAV = [
  { to: "/jobs", label: "Jobs & Freelance", icon: Briefcase, match: ["/jobs"], search: { tab: "jobs" } },
] as const;

export const SKILLS_NAV = [
  { to: "/tech-skills", label: "Tech Skills", icon: Code,  match: ["/tech-skills"], search: { tab: "frontend" } },
  { to: "/soft-skills", label: "Soft Skills", icon: Heart, match: ["/soft-skills"], search: { tab: "communication" } },
] as const;

export const SOCIAL_TABS = [
  { id: "linkedin",  label: "LinkedIn",    icon: Linkedin },
  { id: "twitter",   label: "X / Twitter", icon: Twitter },
  { id: "instagram", label: "Instagram",   icon: Instagram },
] as const;

export const MAIL_TABS = [
  { id: "cover-letter", label: "Cover Letters", icon: Send },
  { id: "gmail",        label: "Gmail",         icon: Mail },
  { id: "whatsapp",     label: "WhatsApp",      icon: MessageCircle },
] as const;

export const CONNECTORS_TABS = [
  { id: "companies", label: "Companies",   icon: Building2 },
  { id: "hr",        label: "HR Contacts", icon: Briefcase },
  { id: "clients",   label: "Clients",     icon: Users },
] as const;

export const BUILDER_TABS = [
  { id: "personal",   label: "Personal",   icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills",     label: "Skills",     icon: Code2 },
  { id: "education",  label: "Education",  icon: GraduationCap },
  { id: "projects",   label: "Projects",   icon: FolderGit2 },
  { id: "ats",        label: "ATS Check",  icon: Sparkles },
] as const;

export const JOBS_TABS = [
  { id: "jobs",     label: "Jobs" },
  { id: "offers",   label: "Offers" },
  { id: "services", label: "Services" },
] as const;

export const SOFT_SKILL_TABS = [
  { id: "top-10",         label: "Top 10",          icon: Trophy },
  { id: "communication",  label: "Communication",   icon: MessageCircle },
  { id: "leadership",     label: "Leadership",      icon: Target },
  { id: "problem-solving",label: "Problem Solving", icon: Lightbulb },
  { id: "teamwork",       label: "Teamwork",        icon: Users },
  { id: "ai-mock",        label: "AI Mock Chat",    icon: MessageSquare },
] as const;

export const TECH_SKILL_TABS = [
  { to: "/tech-skills", search: { tab: "frontend" },  label: "Frontend",      icon: Globe,         id: "frontend" },
  { to: "/tech-skills", search: { tab: "backend" },   label: "Backend",       icon: Server,        id: "backend" },
  { to: "/tech-skills", search: { tab: "devops" },    label: "DevOps",        icon: Container,     id: "devops" },
  { to: "/tech-skills", search: { tab: "testing" },   label: "Testing",       icon: FlaskConical,  id: "testing" },
  { to: "/tech-skills", search: { tab: "database" },  label: "Database",      icon: Database,      id: "database" },
  { to: "/tech-skills", search: { tab: "materials" }, label: "Materials",     icon: BookOpen,      id: "materials" },
  { to: "/tech-skills", search: { tab: "ai-mock" },   label: "AI Mock Chat",  icon: MessageSquare, id: "ai-mock" },
] as const;

export const TOOLS_TABS = [
  { id: "prompts",    label: "Prompts",    icon: Sparkles },
  { id: "agents",     label: "Agents",     icon: Bot },
  { id: "components", label: "Components", icon: ComponentIcon },
  { id: "templates",  label: "Templates",  icon: LayoutTemplate },
  { id: "snippets",   label: "Snippets",   icon: Code2 },
] as const;
