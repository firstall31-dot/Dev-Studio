import { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Mail,
  Database,
  ListTodo,
  HardDrive,
  Radio,
  Activity,
  Search as SearchIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import type { SkillAreaData, ServiceIntegration, ServiceCategory } from "@/types/skills";
import { cn } from "@/lib/utils";

interface Props {
  data: SkillAreaData;
  subArea: string;
}

const CATEGORY_META: Record<
  ServiceCategory,
  { label: string; icon: React.ElementType; color: string }
> = {
  auth: { label: "Auth", icon: ShieldCheck, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  payment: { label: "Payment", icon: CreditCard, color: "text-green-500 bg-green-500/10 border-green-500/20" },
  email: { label: "Email", icon: Mail, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  cache: { label: "Cache", icon: Database, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  queue: { label: "Queue", icon: ListTodo, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  storage: { label: "Storage", icon: HardDrive, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
  realtime: { label: "Realtime", icon: Radio, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
  monitoring: { label: "Monitoring", icon: Activity, color: "text-red-500 bg-red-500/10 border-red-500/20" },
  search: { label: "Search", icon: SearchIcon, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
};

const BADGE_COLOR: Record<string, string> = {
  Popular: "bg-primary/10 text-primary border-primary/20",
  Official: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Recommended: "bg-green-500/10 text-green-600 border-green-500/20",
};

function CodeBlock({ install, code, lang }: { install: string; code: string; lang: string }) {
  const [copied, setCopied] = useState<"install" | "code" | null>(null);

  const copy = (text: string, type: "install" | "code") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border/60 text-xs font-mono">
      {/* Install */}
      <div className="flex items-center justify-between gap-2 bg-muted/60 px-3 py-2 border-b border-border/60">
        <span className="text-muted-foreground select-none">$ {install}</span>
        <button
          onClick={() => copy(install, "install")}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          title="Copy install command"
        >
          {copied === "install" ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
        </button>
      </div>
      {/* Code */}
      <div className="relative bg-muted/30">
        <div className="flex items-center justify-between px-3 py-1 border-b border-border/40">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60">{lang}</span>
          <button
            onClick={() => copy(code, "code")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Copy code"
          >
            {copied === "code" ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
          </button>
        </div>
        <pre className="overflow-x-auto p-3 text-[11px] leading-relaxed text-foreground/90 scrollbar-thin">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceIntegration }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[service.category];
  const Icon = meta.icon;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn("size-8 rounded-lg border flex items-center justify-center shrink-0", meta.color)}>
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-1.5 mb-1">
                <h3 className="font-semibold text-sm">{service.name}</h3>
                {service.badge && (
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md border font-medium", BADGE_COLOR[service.badge])}>
                    {service.badge}
                  </span>
                )}
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md border font-medium", meta.color)}>
                  {meta.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pl-11">
          {service.packageName && (
            <code className="text-[10px] bg-muted/60 border border-border/60 rounded-md px-2 py-1 text-muted-foreground font-mono">
              {service.packageName}
            </code>
          )}
          <a
            href={service.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium ml-auto shrink-0"
          >
            Docs <ExternalLink className="size-3" />
          </a>
          {service.snippet && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="size-3" /> Hide</>
              ) : (
                <><ChevronDown className="size-3" /> Integration</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code snippet */}
      {expanded && service.snippet && (
        <div className="px-4 pb-4 pt-0">
          <CodeBlock install={service.snippet.install} code={service.snippet.code} lang={service.snippet.lang} />
        </div>
      )}
    </div>
  );
}

export function ServicesSection({ data, subArea }: Props) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");

  const saData = data.subAreas?.find((sa) => sa.id === subArea);
  const services = saData?.services ?? [];

  const availableCategories = Array.from(
    new Set(services.map((s) => s.category))
  ) as ServiceCategory[];

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const label = saData?.label ?? data.label;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Services & Integrations</h2>
        <p className="text-muted-foreground text-sm">
          Production-ready services for <span className="text-foreground font-medium">{label}</span> —
          auth, payments, email, caching, queues, and more. Each card includes docs and a ready-to-use integration snippet.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl bg-muted/20">
          <Layers className="size-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No services defined for <span className="font-medium">{label}</span> yet.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Select a specific technology from the sidebar to see its services.
          </p>
        </div>
      ) : (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              All ({services.length})
            </button>
            {availableCategories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              const count = services.filter((s) => s.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    activeCategory === cat
                      ? cn("border", meta.color)
                      : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-3" />
                  {meta.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Service cards */}
          <div className="space-y-3">
            {filtered.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
