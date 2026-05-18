import { useState } from "react";
import {
  Globe, Server, Container, FlaskConical, Database,
  BookOpen, Layers, ExternalLink, ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { TabNav } from "@/components/layout";
import { cn } from "@/lib/utils";

type MaterialType = "book" | "course" | "docs" | "tool";

interface Material {
  title: string;
  author?: string;
  url: string;
  desc: string;
  type: MaterialType;
  free?: boolean;
}

const TYPE_LABELS: Record<MaterialType, string> = {
  book: "Book", course: "Course", docs: "Docs", tool: "Tool",
};
const TYPE_COLORS: Record<MaterialType, string> = {
  book:   "bg-amber-500/10 text-amber-500 border-amber-500/20",
  course: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  docs:   "bg-green-500/10 text-green-500 border-green-500/20",
  tool:   "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const AREAS: { id: string; label: string; icon: React.ElementType; materials: Material[] }[] = [
  {
    id: "frontend", label: "Frontend", icon: Globe,
    materials: [
      { title: "javascript.info",            url: "https://javascript.info",                                             type: "docs",   free: true,  desc: "The most complete, modern JS tutorial — from basics to advanced topics." },
      { title: "You Don't Know JS",           author: "Kyle Simpson",          url: "https://github.com/getify/You-Dont-Know-JS",              type: "book",   free: true,  desc: "Deep-dive series on JavaScript internals — scope, closures, async, and more." },
      { title: "web.dev",                    url: "https://web.dev",                                                     type: "docs",   free: true,  desc: "Google's authoritative resource for web performance, accessibility, and PWAs." },
      { title: "React Official Docs",         url: "https://react.dev",                                                   type: "docs",   free: true,  desc: "The new React docs — Hooks, Server Components, and all modern patterns." },
      { title: "CSS for JS Developers",       author: "Josh Comeau",           url: "https://css-for-js.dev",                                 type: "course",              desc: "Interactive course that truly explains how CSS works — transforms, layout, animations." },
      { title: "Frontend Masters",            url: "https://frontendmasters.com",                                         type: "course",              desc: "Expert-taught courses on React, TypeScript, performance, and architecture." },
      { title: "The Odin Project",            url: "https://www.theodinproject.com",                                      type: "course", free: true,  desc: "Full-stack curriculum with projects — HTML, CSS, JS, React, Node." },
      { title: "Eloquent JavaScript",         author: "Marijn Haverbeke",      url: "https://eloquentjavascript.net",                         type: "book",   free: true,  desc: "Timeless book covering JS fundamentals through data structures and async." },
      { title: "TypeScript Handbook",         url: "https://www.typescriptlang.org/docs/",                                 type: "docs",   free: true,  desc: "Official TypeScript docs — type system, utility types, and config guide." },
      { title: "Vite Docs",                  url: "https://vitejs.dev",                                                   type: "docs",   free: true,  desc: "Official Vite documentation — fast bundler, plugins, SSR configuration." },
    ],
  },
  {
    id: "backend", label: "Backend", icon: Server,
    materials: [
      { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", url: "https://dataintensive.net",                          type: "book",              desc: "The definitive guide to distributed systems, databases, and data pipelines." },
      { title: "Clean Architecture",          author: "Robert C. Martin",      url: "https://www.oreilly.com/library/view/clean-architecture/9780134494272/", type: "book", desc: "SOLID principles, layered architecture, and dependency management." },
      { title: "Node.js Best Practices",      url: "https://github.com/goldbergyoni/nodebestpractices",                    type: "docs",   free: true,  desc: "3000-star GitHub collection of production Node.js patterns and security tips." },
      { title: "roadmap.sh — Backend",        url: "https://roadmap.sh/backend",                                           type: "docs",   free: true,  desc: "Curated visual roadmap for backend engineering." },
      { title: "System Design Primer",        url: "https://github.com/donnemartin/system-design-primer",                  type: "docs",   free: true,  desc: "How to design large-scale systems — load balancing, CDN, caching, CAP theorem." },
      { title: "The Pragmatic Programmer",    author: "Hunt & Thomas",         url: "https://pragprog.com/titles/tpp20/",                     type: "book",              desc: "Career-defining habits: DRY, tracer bullets, broken windows, and software craftsmanship." },
      { title: "FastAPI Documentation",       url: "https://fastapi.tiangolo.com",                                          type: "docs",   free: true,  desc: "Modern Python API framework — async, type hints, OpenAPI auto-generation." },
      { title: "REST API Design Rulebook",    author: "Mark Massé",            url: "https://www.oreilly.com/library/view/rest-api-design/9781449317904/", type: "book", desc: "Principles for designing consistent, intuitive REST APIs at scale." },
    ],
  },
  {
    id: "devops", label: "DevOps", icon: Container,
    materials: [
      { title: "The DevOps Handbook",         author: "Kim, Humble, Debois",   url: "https://itrevolution.com/product/the-devops-handbook-second-edition/", type: "book", desc: "The definitive guide to DevOps transformation — flow, feedback, and continuous learning." },
      { title: "Kubernetes Official Docs",    url: "https://kubernetes.io/docs/",                                          type: "docs",   free: true,  desc: "Everything you need to deploy, scale, and manage containerized workloads." },
      { title: "Docker Getting Started",      url: "https://docs.docker.com/get-started/",                                 type: "docs",   free: true,  desc: "Official Docker learning path — containers, images, Compose, and networking." },
      { title: "The Phoenix Project",         author: "Kim, Behr, Spafford",   url: "https://itrevolution.com/product/the-phoenix-project/",  type: "book",              desc: "A novel about DevOps — how IT and business succeed together through flow and feedback." },
      { title: "GitHub Actions Docs",         url: "https://docs.github.com/en/actions",                                   type: "docs",   free: true,  desc: "Automate CI/CD pipelines directly in GitHub — workflows, secrets, runners." },
      { title: "Accelerate",                  author: "Forsgren, Humble, Kim", url: "https://itrevolution.com/book/accelerate/",               type: "book",              desc: "Data-driven research on what makes high-performing software delivery teams." },
      { title: "12-Factor App",               url: "https://12factor.net",                                                  type: "docs",   free: true,  desc: "Methodology for building modern, portable, scalable SaaS applications." },
      { title: "Terraform Docs",             url: "https://developer.hashicorp.com/terraform/docs",                        type: "docs",   free: true,  desc: "Infrastructure as Code — provision cloud resources declaratively across providers." },
    ],
  },
  {
    id: "testing", label: "Testing", icon: FlaskConical,
    materials: [
      { title: "The Art of Unit Testing",     author: "Roy Osherove",          url: "https://www.artofunittesting.com",                       type: "book",              desc: "Classic guide to writing readable, maintainable unit tests — mocks, stubs, and design for testability." },
      { title: "Testing Trophy",              author: "Kent C. Dodds",         url: "https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications", type: "docs", free: true, desc: "The case for integration tests as the foundation of a solid test suite." },
      { title: "Testing Library Docs",        url: "https://testing-library.com/docs/",                                    type: "docs",   free: true,  desc: "Query by user-visible behavior, not implementation details." },
      { title: "Playwright Docs",             url: "https://playwright.dev/docs/intro",                                    type: "docs",   free: true,  desc: "Reliable end-to-end browser automation — cross-browser, parallel, auto-wait." },
      { title: "Google Testing Blog",         url: "https://testing.googleblog.com",                                       type: "docs",   free: true,  desc: "Engineering-level posts on testing strategy, flakiness, and CI at scale." },
      { title: "Test-Driven Development",     author: "Kent Beck",             url: "https://www.oreilly.com/library/view/test-driven-development/0321146530/", type: "book", desc: "The original TDD book — Red, Green, Refactor cycle explained by its creator." },
      { title: "Vitest Docs",                 url: "https://vitest.dev",                                                    type: "docs",   free: true,  desc: "Blazing-fast Vite-native unit test framework — drop-in Jest replacement." },
    ],
  },
  {
    id: "database", label: "Database", icon: Database,
    materials: [
      { title: "Use The Index, Luke",         url: "https://use-the-index-luke.com",                                       type: "docs",   free: true,  desc: "SQL performance explained — how indexes really work, query plans, and tuning." },
      { title: "PostgreSQL Docs",             url: "https://www.postgresql.org/docs/",                                     type: "docs",   free: true,  desc: "Comprehensive Postgres reference — JSONB, CTEs, window functions, replication." },
      { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", url: "https://dataintensive.net",      type: "book",              desc: "Replication, partitioning, transactions, and distributed consensus." },
      { title: "Redis University",            url: "https://university.redis.com",                                         type: "course", free: true,  desc: "Free official Redis courses — data structures, pub/sub, streams, and clustering." },
      { title: "MongoDB University",          url: "https://learn.mongodb.com",                                            type: "course", free: true,  desc: "Free MongoDB learning paths — aggregation, indexing, Atlas." },
      { title: "Prisma Docs",                 url: "https://www.prisma.io/docs",                                           type: "docs",   free: true,  desc: "Modern TypeScript ORM — schema-first, type-safe queries, migrations." },
      { title: "Database Internals",          author: "Alex Petrov",           url: "https://www.databass.dev",                               type: "book",              desc: "How database engines work — storage, B-trees, LSM trees, distributed systems." },
      { title: "SQL Performance Explained",   author: "Markus Winand",         url: "https://sql-performance-explained.com",                  type: "book",              desc: "Focused, practical book on writing fast SQL — indexes, execution plans, N+1 avoidance." },
    ],
  },
  {
    id: "solid", label: "SOLID", icon: Layers,
    materials: [
      { title: "Clean Code",                  author: "Robert C. Martin",      url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/", type: "book", desc: "The classic guide to writing readable, maintainable code — naming, functions, and SOLID in practice." },
      { title: "Clean Architecture",          author: "Robert C. Martin",      url: "https://www.oreilly.com/library/view/clean-architecture/9780134494272/", type: "book", desc: "How SOLID principles scale to full system architecture — boundaries, dependencies, use cases." },
      { title: "SOLID Explained — Stackify",  url: "https://stackify.com/solid-design-principles/",                        type: "docs",   free: true,  desc: "Concise visual guide to all 5 SOLID principles with code examples in multiple languages." },
      { title: "SOLID on refactoring.guru",   url: "https://refactoring.guru/refactoring/what-is-refactoring",             type: "docs",   free: true,  desc: "Interactive explanations of Single Responsibility, Open/Closed, Liskov, Interface Segregation, and DI." },
      { title: "Agile Principles, Patterns, and Practices", author: "Robert C. Martin", url: "https://www.pearson.com/en-us/subject-catalog/p/agile-principles-patterns-and-practices-in-c/P200000009457", type: "book", desc: "Where SOLID was first articulated — C# examples but universally applicable." },
      { title: "The Pragmatic Programmer",    author: "Hunt & Thomas",         url: "https://pragprog.com/titles/tpp20/",                     type: "book",              desc: "DRY, orthogonality, and design-by-contract — the practical roots of SOLID thinking." },
      { title: "SOLID Principles Course",     url: "https://www.pluralsight.com/courses/principles-oo-design",             type: "course",              desc: "Pluralsight course walking through each principle with before/after refactoring examples." },
    ],
  },
];

const FILTERS: { id: MaterialType | "all"; label: string }[] = [
  { id: "all", label: "All" }, { id: "book", label: "Books" },
  { id: "course", label: "Courses" }, { id: "docs", label: "Docs" },
  { id: "tool", label: "Tools" },
];

const TABS_PER_PAGE = 6;

export function MaterialsView() {
  const [activeArea, setActiveArea] = useState("frontend");
  const [filter, setFilter]         = useState<MaterialType | "all">("all");
  const [tabPage, setTabPage]       = useState(0);

  const totalPages  = Math.ceil(AREAS.length / TABS_PER_PAGE);
  const visibleAreas = AREAS.slice(tabPage * TABS_PER_PAGE, (tabPage + 1) * TABS_PER_PAGE);

  const area  = AREAS.find((a) => a.id === activeArea) ?? AREAS[0];
  const items = filter === "all" ? area.materials : area.materials.filter((m) => m.type === filter);

  const handleAreaChange = (id: string) => { setActiveArea(id); setFilter("all"); };

  const handlePrevPage = () => {
    const newPage = tabPage - 1;
    setTabPage(newPage);
    const firstOnPage = AREAS[newPage * TABS_PER_PAGE];
    if (firstOnPage) handleAreaChange(firstOnPage.id);
  };

  const handleNextPage = () => {
    const newPage = tabPage + 1;
    setTabPage(newPage);
    const firstOnPage = AREAS[newPage * TABS_PER_PAGE];
    if (firstOnPage) handleAreaChange(firstOnPage.id);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Inner area tab nav with pagination */}
      <div className="px-4 pt-4 pb-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <button
              onClick={handlePrevPage}
              disabled={tabPage === 0}
              className="size-7 rounded-lg flex items-center justify-center border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronLeft className="size-3.5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <TabNav
              tabs={visibleAreas.map((a) => ({
                id: a.id, label: a.label, icon: a.icon as LucideIcon,
                onClick: () => handleAreaChange(a.id),
              }))}
              activeTab={activeArea}
            />
          </div>
          {totalPages > 1 && (
            <button
              onClick={handleNextPage}
              disabled={tabPage === totalPages - 1}
              className="size-7 rounded-lg flex items-center justify-center border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Type filter pills */}
      <div className="px-4 sm:px-8 pt-5 pb-3 shrink-0 flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-medium border transition-all",
              filter === f.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted/70",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-4 sm:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((m) => (
              <a
                key={m.url}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", TYPE_COLORS[m.type])}>
                      {TYPE_LABELS[m.type]}
                    </span>
                    {m.free && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        Free
                      </span>
                    )}
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors mt-0.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {m.title}
                  </p>
                  {m.author && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">by {m.author}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{m.desc}</p>
              </a>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-16 text-sm text-muted-foreground italic">
                No {filter} resources for {area.label} yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
