import { useEffect, useState, useRef, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Sparkles, Bot, Component as ComponentIcon,
  LayoutTemplate, Code2, Plus, Flame, Code, Heart, GraduationCap,
  Menu, X, Search, Users, Briefcase, FileText, CalendarDays,
  Sun, Moon, Bell, Languages, CheckCheck, Trash2, Info, CalendarCheck, Dumbbell,
} from "lucide-react";
import { CommandPalette } from "./command-palette";
import { ErrorBoundary } from "./error-boundary";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* ── Theme ─────────────────────────────────────────────── */
const THEME_KEY = "ds-theme";
function readTheme(): "dark" | "light" {
  try { return (localStorage.getItem(THEME_KEY) as "dark" | "light") || "dark"; } catch { return "dark"; }
}
function applyTheme(t: "dark" | "light") {
  document.documentElement.classList.toggle("dark", t === "dark");
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}

/* ── Language ───────────────────────────────────────────── */
const LANG_KEY = "ds-lang";
function readLang(): "en" | "ar" {
  try { return (localStorage.getItem(LANG_KEY) as "en" | "ar") || "en"; } catch { return "en"; }
}
function applyLang(l: "en" | "ar") {
  document.documentElement.setAttribute("lang", l);
  document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
  try { localStorage.setItem(LANG_KEY, l); } catch {}
}

/* ── Notifications ──────────────────────────────────────── */
interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: "sparkles" | "calendar" | "info";
}

const INIT_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "Planner updated", body: "AI suggestions are now live on your planner.", time: "2 min ago", read: false, icon: "sparkles" },
  { id: "n2", title: "Tasks due today", body: "You have 3 high-priority tasks scheduled.", time: "1 hr ago", read: false, icon: "calendar" },
  { id: "n3", title: "Welcome to Dev Studio", body: "Your workspace is ready. Start building!", time: "Today", read: true, icon: "info" },
];

function NotifIcon({ icon }: { icon: AppNotification["icon"] }) {
  if (icon === "sparkles") return <Sparkles className="size-3.5 text-primary" />;
  if (icon === "calendar") return <CalendarCheck className="size-3.5 text-emerald-500" />;
  return <Info className="size-3.5 text-muted-foreground" />;
}

/* ── Nav data ───────────────────────────────────────────── */
const WORKSPACE_NAV = [
  { to: "/",           label: "Dashboard",  icon: LayoutDashboard },
  { to: "/planner",    label: "Planner",    icon: CalendarDays    },
  { to: "/activities", label: "Activities", icon: Dumbbell        },
  { to: "/tools",      label: "Tools",      icon: Code2           },
] as const;

const COMMUNICATION_NAV = [
  { to: "/social",     label: "Social Media",      icon: ComponentIcon, match: ["/social"],     search: { tab: "linkedin" } },
  { to: "/mails",      label: "Mails & Messaging", icon: Bot,           match: ["/mails"],      search: { tab: "cover-letter" } },
  { to: "/connectors", label: "Connectors",         icon: Users,         match: ["/connectors"], search: { tab: "companies" } },
  { to: "/cv",         label: "CV Builder",         icon: FileText,      match: ["/cv"],         search: {} },
] as const;

const FREELANCE_NAV = [
  { to: "/jobs", label: "Jobs & Freelance", icon: Briefcase, match: ["/jobs"], search: { tab: "jobs" } },
] as const;

const SKILLS_NAV = [
  { to: "/tech-skills", label: "Tech Skills", icon: Code,  match: ["/tech-skills"], search: { tab: "frontend" } },
  { to: "/soft-skills", label: "Soft Skills", icon: Heart, match: ["/soft-skills"], search: { tab: "communication" } },
] as const;

/* ── NavItem ────────────────────────────────────────────── */
function NavItem({ item, active, isCollapsed }: { item: any; active: boolean; isCollapsed: boolean }) {
  const Icon = item.icon;
  const content = (
    <Link
      to={item.to}
      search={item.search}
      className={cn(
        "flex items-center rounded-xl transition-all duration-150",
        isCollapsed ? "justify-center size-9 mx-auto" : "gap-2.5 px-3 py-2",
        active
          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      )}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
      {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
    </Link>
  );
  if (!isCollapsed) return <li>{content}</li>;
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="font-medium text-xs">{item.label}</TooltipContent>
      </Tooltip>
    </li>
  );
}

function SectionLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  if (isCollapsed) return <div className="my-1 h-px bg-border/50 mx-2" />;
  return (
    <p className="px-3 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
      {label}
    </p>
  );
}

const SIDEBAR_KEY = "ds-sidebar-collapsed";
function readSidebarPref(): boolean {
  try { return localStorage.getItem(SIDEBAR_KEY) !== "false"; } catch { return true; }
}
function writeSidebarPref(c: boolean) {
  try { localStorage.setItem(SIDEBAR_KEY, String(c)); } catch {}
}

/* ── AppShell ───────────────────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(readSidebarPref);
  const { user, signOut } = useAuth();

  /* Theme */
  const [theme, setThemeState] = useState<"dark" | "light">(readTheme);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setThemeState(next);
  };
  useEffect(() => { applyTheme(theme); }, []);

  /* Language */
  const [lang, setLangState] = useState<"en" | "ar">(readLang);
  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    applyLang(next);
    setLangState(next);
  };
  useEffect(() => { applyLang(lang); }, []);

  /* Notifications */
  const [notifications, setNotifications] = useState<AppNotification[]>(INIT_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const dismissOne = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const readOne = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  /* Close notif dropdown on outside click */
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  /* Keyboard shortcut */
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

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => { writeSidebarPref(!prev); return !prev; });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/30">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] md:hidden"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────── */}
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            "fixed md:relative inset-y-0 left-0 z-[110] flex shrink-0 flex-col transition-[width,transform] duration-300 ease-in-out p-2",
            mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
            isCollapsed ? "md:w-[72px]" : "md:w-[228px]"
          )}
        >
          <nav className="flex flex-col flex-1 rounded-2xl bg-sidebar border border-border/60 shadow-sm overflow-hidden">
            {/* Logo */}
            <div className={cn("flex items-center shrink-0 px-3 py-3", isCollapsed ? "justify-center" : "gap-2.5")}>
              <div className="size-7 rounded-xl bg-primary grid place-items-center shrink-0 shadow-sm">
                <Flame className="size-3.5 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col leading-tight overflow-hidden">
                  <span className="font-semibold tracking-tight text-sm truncate">Dev Studio</span>
                  <span className="text-[10px] text-muted-foreground font-mono truncate">your dev hub</span>
                </div>
              )}
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-auto md:hidden size-7 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Nav sections */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-3 scrollbar-thin">
              <div>
                <SectionLabel label="Workspace" isCollapsed={isCollapsed} />
                <ul className="space-y-0.5">
                  {WORKSPACE_NAV.map((item) => {
                    const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                    return <NavItem key={item.to} item={item} active={active} isCollapsed={isCollapsed} />;
                  })}
                </ul>
              </div>
              <div>
                <SectionLabel label="Communication" isCollapsed={isCollapsed} />
                <ul className="space-y-0.5">
                  {COMMUNICATION_NAV.map((item) => {
                    const active = item.match.some((p) => pathname.startsWith(p));
                    return <NavItem key={item.label} item={item} active={active} isCollapsed={isCollapsed} />;
                  })}
                </ul>
              </div>
              <div>
                <SectionLabel label="Skills" isCollapsed={isCollapsed} />
                <ul className="space-y-0.5">
                  {SKILLS_NAV.map((item) => {
                    const active = item.match.some((p) => pathname.startsWith(p));
                    return <NavItem key={item.label} item={item} active={active} isCollapsed={isCollapsed} />;
                  })}
                </ul>
              </div>
              <div>
                <SectionLabel label="Freelance" isCollapsed={isCollapsed} />
                <ul className="space-y-0.5">
                  {FREELANCE_NAV.map((item) => {
                    const active = item.match.some((p) => pathname.startsWith(p));
                    return <NavItem key={item.label} item={item} active={active} isCollapsed={isCollapsed} />;
                  })}
                </ul>
              </div>
              <div>
                <SectionLabel label="Resources" isCollapsed={isCollapsed} />
                <ul className="space-y-0.5">
                  <NavItem
                    item={{ to: "/interview", label: "Interview", icon: GraduationCap }}
                    active={pathname.startsWith("/interview")}
                    isCollapsed={isCollapsed}
                  />
                </ul>
              </div>
            </div>

            {/* Sidebar footer */}
            <div className="border-t border-border/60 p-2">
              {!isCollapsed ? (
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl bg-muted/40 hover:bg-muted/80 transition-colors text-muted-foreground mb-2"
                >
                  <span className="flex items-center gap-2">
                    <Search className="size-3.5" /> Quick search
                  </span>
                  <kbd className="font-mono bg-background text-muted-foreground px-1.5 py-0.5 rounded-md border border-border text-[10px]">
                    ⌘K
                  </kbd>
                </button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setPaletteOpen(true)}
                      className="w-9 h-9 mx-auto flex items-center justify-center rounded-xl bg-muted/40 hover:bg-muted/80 transition-colors text-muted-foreground mb-2"
                    >
                      <Search className="size-4 shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="font-medium text-xs">Quick search (⌘K)</TooltipContent>
                </Tooltip>
              )}
              <UserMenu isCollapsed={isCollapsed} />
            </div>
          </nav>
        </div>
      </TooltipProvider>

      {/* ── Main area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 p-2 pl-0 md:pl-0 gap-2">

        {/* ── Top header bar ───────────────────────── */}
        <header className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 shadow-sm relative z-[100]">

          {/* Left: sidebar toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden size-8 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
            <button
              onClick={toggleCollapsed}
              className="hidden md:grid size-8 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="size-4" />
            </button>
          </div>

          {/* Center: search */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2.5 flex-1 min-w-0 max-w-sm text-left px-3 py-1.5 rounded-xl bg-muted/40 border border-border/60 hover:border-ring/40 hover:bg-muted/60 transition-all"
          >
            <Search className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">Search…</span>
            <kbd className="ml-auto font-mono bg-background text-muted-foreground px-1.5 py-0.5 rounded-md border border-border text-[10px] hidden sm:block">⌘K</kbd>
          </button>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Theme toggle */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleTheme}
                    className="size-8 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60 transition-all"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark"
                      ? <Sun className="size-4" />
                      : <Moon className="size-4" />
                    }
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                </TooltipContent>
              </Tooltip>

              {/* Language toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleLang}
                    className="h-8 px-2.5 flex items-center gap-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60 transition-all"
                    aria-label="Toggle language"
                  >
                    <Languages className="size-3.5 shrink-0" />
                    <span className="text-[11px] font-bold font-mono uppercase">{lang}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {lang === "en" ? "Switch to Arabic (RTL)" : "Switch to English (LTR)"}
                </TooltipContent>
              </Tooltip>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => { setNotifOpen((o) => !o); if (!notifOpen) markAllRead(); }}
                      className="relative size-8 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60 transition-all"
                      aria-label="Notifications"
                    >
                      <Bell className="size-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground leading-none">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Notifications</TooltipContent>
                </Tooltip>

                {/* Notification dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-sm shadow-lg z-[9999] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <Bell className="size-3.5 text-primary" />
                        <span className="text-sm font-semibold">Notifications</span>
                        {notifications.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            {notifications.length}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {notifications.length > 0 && (
                          <>
                            <button
                              onClick={markAllRead}
                              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded-lg hover:bg-muted/60"
                              title="Mark all read"
                            >
                              <CheckCheck className="size-3" /> All read
                            </button>
                            <button
                              onClick={clearAll}
                              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-destructive transition-colors px-1.5 py-1 rounded-lg hover:bg-muted/60"
                              title="Clear all"
                            >
                              <Trash2 className="size-3" /> Clear
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Notification list */}
                    <div className="max-h-72 overflow-y-auto scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                          <Bell className="size-8 opacity-20" />
                          <p className="text-xs font-medium">All caught up!</p>
                          <p className="text-[10px] opacity-60">No new notifications</p>
                        </div>
                      ) : (
                        <ul className="p-2 space-y-1">
                          {notifications.map((n) => (
                            <li key={n.id}>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => readOne(n.id)}
                                onKeyDown={(e) => e.key === "Enter" && readOne(n.id)}
                                className={cn(
                                  "w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer",
                                  n.read ? "opacity-60 hover:opacity-100 hover:bg-muted/40" : "bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/10"
                                )}
                              >
                                <div className={cn(
                                  "size-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                  n.read ? "bg-muted/60" : "bg-primary/10"
                                )}>
                                  <NotifIcon icon={n.icon} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold leading-tight truncate">{n.title}</p>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); dismissOne(n.id); }}
                                      className="size-4 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                                  <p className="text-[10px] text-muted-foreground/50 mt-1">{n.time}</p>
                                </div>
                                {!n.read && (
                                  <div className="size-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* New button */}
              <Link
                to="/tools"
                className="hidden md:inline-flex text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 rounded-xl px-3 py-1.5 hover:bg-muted/60 transition-all"
              >
                Library
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus className="size-3.5" />
                <span className="hidden sm:inline">New</span>
              </Link>
            </TooltipProvider>
          </div>
        </header>

        {/* ── Page content ─────────────────────────── */}
        <main className="flex-1 flex flex-col min-h-0 rounded-2xl bg-background border border-border/60 shadow-sm overflow-hidden">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
