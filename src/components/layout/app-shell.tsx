import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  Component as ComponentIcon,
  LayoutTemplate,
  Code2,
  Plus,
  Flame,
  Code,
  Heart,
  GraduationCap,
  Menu,
  X,
  Search,
  Users,
  Briefcase,
  FileText,
} from "lucide-react";
import { CommandPalette } from "./command-palette";
import { ErrorBoundary } from "./error-boundary";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WORKSPACE_NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tools", label: "Tools", icon: Code2 },
] as const;

const COMMUNICATION_NAV = [
  {
    to: "/social",
    label: "Social Media",
    icon: ComponentIcon,
    match: ["/social"],
    search: { tab: "linkedin" },
  },
  {
    to: "/mails",
    label: "Mails & Messaging",
    icon: Bot,
    match: ["/mails"],
    search: { tab: "cover-letter" },
  },
  {
    to: "/connectors",
    label: "Connectors",
    icon: Users,
    match: ["/connectors"],
    search: { tab: "companies" },
  },
  {
    to: "/cv",
    label: "CV Builder",
    icon: FileText,
    match: ["/cv"],
    search: {},
  },
] as const;

const FREELANCE_NAV = [
  {
    to: "/jobs",
    label: "Jobs & Freelance",
    icon: Briefcase,
    match: ["/jobs"],
    search: { tab: "jobs" },
  },
] as const;

const SKILLS_NAV = [
  {
    to: "/tech-skills",
    label: "Tech Skills",
    icon: Code,
    match: ["/tech-skills"],
    search: { tab: "frontend" },
  },
  {
    to: "/soft-skills",
    label: "Soft Skills",
    icon: Heart,
    match: ["/soft-skills"],
    search: { tab: "communication" },
  },
] as const;

function NavItem({ item, active, isCollapsed }: { item: any; active: boolean; isCollapsed: boolean }) {
  const Icon = item.icon;
  const content = (
    <Link
      to={item.to}
      search={item.search}
      className={`flex items-center rounded-md transition-colors ${
        isCollapsed ? "justify-center size-10 mx-auto" : "gap-2.5 px-2.5 py-1.5"
      } ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-border"
          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
    </Link>
  );

  if (!isCollapsed) return <li>{content}</li>;

  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={14} className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    </li>
  );
}

const SIDEBAR_KEY = "ds-sidebar-collapsed";

function readSidebarPref(): boolean {
  try { return localStorage.getItem(SIDEBAR_KEY) !== "false"; } catch { return true; }
}

function writeSidebarPref(collapsed: boolean) {
  try { localStorage.setItem(SIDEBAR_KEY, String(collapsed)); } catch {}
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(readSidebarPref);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      writeSidebarPref(!prev);
      return !prev;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] md:hidden"
        />
      )}

      {/* Sidebar */}
      <TooltipProvider delayDuration={0}>
        <nav
          className={`fixed md:static inset-y-0 left-0 z-[110] shrink-0 border-r border-border bg-sidebar flex flex-col overflow-y-auto transition-[width,transform] duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
          } ${isCollapsed ? "md:w-[60px]" : "md:w-60"}`}
        >
          <div className={`h-14 flex items-center border-b border-border/40 mb-2 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2.5"}`}>
          <div className="size-7 rounded-md bg-primary grid place-items-center shrink-0">
            <Flame className="size-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-semibold tracking-tight text-sm truncate">Dev Studio</span>
              <span className="text-[10px] text-muted-foreground font-mono truncate">your dev hub</span>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto md:hidden size-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Workspace section */}
        <div className="px-2 mt-2">
          {!isCollapsed && (
            <p className="px-2 mb-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Workspace
            </p>
          )}
          <ul className="space-y-1">
            {WORKSPACE_NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return <NavItem key={item.to} item={item} active={active} isCollapsed={isCollapsed} />;
            })}
          </ul>
        </div>

        {/* Communication section */}
        <div className="px-2 mt-4">
          {!isCollapsed && (
            <p className="px-2 mb-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Communication
            </p>
          )}
          <ul className="space-y-1">
            {COMMUNICATION_NAV.map((item) => {
              const active = item.match.some((p) => pathname.startsWith(p));
              return <NavItem key={item.label} item={item} active={active} isCollapsed={isCollapsed} />;
            })}
          </ul>
        </div>

        {/* Skills section */}
        <div className="px-2 mt-4">
          {!isCollapsed && (
            <p className="px-2 mb-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Skills
            </p>
          )}
          <ul className="space-y-1">
            {SKILLS_NAV.map((item) => {
              const active = item.match.some((p) => pathname.startsWith(p));
              return <NavItem key={item.label} item={item} active={active} isCollapsed={isCollapsed} />;
            })}
          </ul>
        </div>

        {/* Freelance section */}
        <div className="px-2 mt-4">
          {!isCollapsed && (
            <p className="px-2 mb-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Freelance
            </p>
          )}
          <ul className="space-y-1">
            {FREELANCE_NAV.map((item) => {
              const active = item.match.some((p) => pathname.startsWith(p));
              return <NavItem key={item.label} item={item} active={active} isCollapsed={isCollapsed} />;
            })}
          </ul>
        </div>

        {/* Interview Prep */}
        <div className="px-2 mt-4">
          {!isCollapsed && (
            <p className="px-2 mb-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Resources
            </p>
          )}
          <ul className="space-y-1">
            <NavItem 
              item={{ to: "/interview", label: "Interview", icon: GraduationCap }} 
              active={pathname.startsWith("/interview")} 
              isCollapsed={isCollapsed} 
            />
          </ul>
        </div>

        <div className={`mt-auto border-t border-border ${isCollapsed ? "p-2" : "p-3"}`}>
          {!isCollapsed ? (
            <button
              onClick={() => setPaletteOpen(true)}
              className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs rounded-md bg-card hover:bg-sidebar-accent/50 transition-colors text-muted-foreground mb-3"
            >
              <span className="flex items-center gap-2">
                <Search className="size-3.5" /> Quick search
              </span>
              <kbd className="font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border text-[10px]">
                ⌘K
              </kbd>
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="w-10 h-10 mx-auto flex items-center justify-center rounded-md bg-card hover:bg-sidebar-accent/50 transition-colors text-muted-foreground mb-3"
                >
                  <Search className="size-4 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={14} className="font-medium">
                Quick search (⌘K)
              </TooltipContent>
            </Tooltip>
          )}
          <div className="w-full">
            <UserMenu isCollapsed={isCollapsed} />
          </div>
        </div>
      </nav>
    </TooltipProvider>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-border flex items-center justify-between gap-2 px-4 sm:px-8 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden size-9 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-card border border-border shrink-0"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
            <button
              onClick={toggleCollapsed}
              className="hidden md:grid size-9 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-card border border-border shrink-0"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="size-4" />
            </button>
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="group flex items-center gap-2.5 flex-1 min-w-0 max-w-md text-left px-3 py-1.5 rounded-md bg-card border border-border hover:border-ring/40 transition-colors"
          >
            <Search className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">Search…</span>
            <kbd className="ml-auto font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border text-[10px]">
              ⌘K
            </kbd>
          </button>
          <div className="flex items-center gap-2 ml-2 sm:ml-4 shrink-0">
            <Link
              to="/tools"
              className="hidden md:inline-flex text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1"
            >
              Library
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
            >
              <Plus className="size-4" /> <span className="hidden sm:inline">New asset</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
