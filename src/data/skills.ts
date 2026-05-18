import { AreaId, SkillAreaData, TechAreaId } from "../types/skills";
import {
  Globe,
  Server,
  Container,
  FlaskConical,
  Database,
  MessageCircle,
  Users,
  Lightbulb,
  Clock,
  Target,
  Sparkles,
  Heart,
  Mic,
  Handshake,
  Brain,
  Swords,
  Wifi,
  Terminal,
  GitPullRequest,
  RefreshCw,
  GitBranch,
  Cpu,
  Network,
  Boxes,
  Shield,
  Zap,
  Layers,
  Puzzle,
  Activity,
  Package,
  Link,
  Globe2,
  Lock,
  Key,
  ShieldCheck,
  Server as ServerIcon,
  BarChart2,
  Gauge,
  HardDrive,
  Radio,
  CloudCog,
  Workflow,
  ScanSearch,
  PlugZap,
  Scissors,
  Cable,
  AlertTriangle,
  DatabaseZap,
  MonitorDot,
} from "lucide-react";

export const TECH_AREAS: Record<TechAreaId, SkillAreaData> = {
  frontend: {
    id: "frontend",
    label: "Frontend",
    icon: Globe,
    description: "HTML, CSS, JavaScript and modern frameworks — choose a framework to dive deep.",
    concepts: [],
    resources: [],
    checklist: [
      { id: "perf", label: "Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)" },
      { id: "a11y", label: "Semantic HTML & ARIA — screen reader accessible" },
      { id: "resp", label: "Responsive layout (mobile-first, fluid typography)" },
      { id: "seo", label: "Meta tags, OG, structured data (schema.org)" },
      { id: "bundle", label: "Bundle analysis — no unnecessary dependencies" },
      { id: "lazy", label: "Lazy load routes & heavy components" },
      { id: "error", label: "Error boundaries & graceful fallbacks" },
      { id: "csp", label: "Content Security Policy headers set" },
      { id: "fonts", label: "Font optimization (preload, font-display: swap)" },
      { id: "img", label: "Images: WebP/AVIF, srcset, lazy loading" },
    ],
    subAreas: [
      {
        id: "react",
        label: "React",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["react"],
        concepts: [
          {
            title: "Composition over Inheritance",
            body: "Build complex UIs by nesting specialized components. Use children prop for layouts.",
          },
          {
            title: "Immutability",
            body: "Never mutate state directly. Use setState/dispatch. Enables fast comparisons and time-travel debugging.",
          },
          {
            title: "Hooks Pattern",
            body: "Logic reuse without classes. Custom hooks for data fetching, auth, and complex state.",
          },
          {
            title: "Server Components",
            body: "Move logic to the server. Zero-bundle size for static parts. Direct DB access.",
          },
        ],
        resources: [
          {
            label: "React Docs",
            url: "https://react.dev",
            desc: "The new official React documentation.",
          },
          {
            label: "Beta Docs — Hooks",
            url: "https://react.dev/reference/react",
            desc: "Deep dive into React Hooks API.",
          },
        ],
      },
      {
        id: "angular",
        label: "Angular",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["angular"],
      },
      {
        id: "vue",
        label: "Vue.js",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["vue"],
      },
      {
        id: "svelte",
        label: "Svelte",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["svelte"],
      },
      {
        id: "nextjs",
        label: "Next.js",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["nextjs"],
      },
    ],
  },
  backend: {
    id: "backend",
    label: "Backend",
    icon: Server,
    description: "APIs, databases, authentication, and scalable architecture — choose your stack.",
    concepts: [],
    resources: [],
    checklist: [
      { id: "auth", label: "Authentication & authorization (JWT/session, RBAC)" },
      { id: "valid", label: "Input validation & sanitization on every endpoint" },
      { id: "sql", label: "Parameterized queries — no string concatenation" },
      { id: "rate", label: "Rate limiting on auth and sensitive endpoints" },
      { id: "https", label: "HTTPS enforced; security headers set" },
      { id: "logs", label: "Structured logging with correlation IDs" },
      { id: "health", label: "Health check endpoint configured" },
      { id: "migrations", label: "DB migrations versioned and reversible" },
      { id: "secrets", label: "Secrets in env vars / vault — never hardcoded" },
      { id: "timeout", label: "Request timeouts & circuit breakers on external calls" },
    ],
    subAreas: [
      {
        id: "node",
        label: "Node.js",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["nodejs"],
      },
      {
        id: "aspnet",
        label: "ASP.NET Core",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["aspnet"],
      },
      {
        id: "python",
        label: "Python/FastAPI",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["python", "fastapi"],
      },
      {
        id: "go",
        label: "Go",
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["go"],
      },
      {
        id: "supabase",
        label: "Supabase",
        color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
        accent: "border-emerald-500/30",
        tags: ["supabase", "postgres", "baas"],
        concepts: [
          {
            title: "PostgreSQL Under the Hood",
            body: "Supabase is not a black-box NoSQL DB; it's a full Postgres database. Use triggers, functions, and RLS directly.",
          },
          {
            title: "Row Level Security (RLS)",
            body: "Secure data at the database layer. Policies determine who can read/write rows based on their JWT auth context.",
          },
          {
            title: "Realtime",
            body: "Listen to Postgres changes via WebSockets. Requires enabling Realtime on specific tables and proper RLS.",
          },
        ],
        resources: [
          {
            label: "Supabase Docs",
            url: "https://supabase.com/docs",
            desc: "Official documentation and guides.",
          },
        ],
      },
    ],
  },
  database: {
    id: "database",
    label: "Database",
    icon: Database,
    description:
      "SQL, NoSQL, Redis, indexing, transactions, schema design, and scaling — deeply covered.",
    concepts: [
      {
        title: "ACID Transactions",
        body: "Atomicity, Consistency, Isolation, Durability. Postgres is fully ACID.",
      },
      {
        title: "B-Tree Indexes",
        body: "Default index type. Sorted tree allowing O(log n) lookups and range scans.",
      },
      {
        title: "Query Planning",
        body: "Optimizer chooses between index scans, hash joins, etc. Use EXPLAIN ANALYZE.",
      },
      {
        title: "Normalization",
        body: "Reduce redundancy and maintain integrity. Denormalize only for performance.",
      },
    ],
    resources: [
      {
        label: "PostgreSQL Docs",
        url: "https://www.postgresql.org/docs/",
        desc: "Full PostgreSQL SQL reference.",
      },
      {
        label: "MongoDB Docs",
        url: "https://www.mongodb.com/docs/",
        desc: "Official MongoDB documentation.",
      },
      {
        label: "Use The Index, Luke",
        url: "https://use-the-index-luke.com",
        desc: "SQL indexing for developers.",
      },
    ],
    checklist: [
      { id: "migrate", label: "All schema changes via versioned migrations" },
      { id: "index", label: "Foreign keys and frequently-filtered columns indexed" },
      { id: "pool", label: "Connection pooling configured correctly" },
      { id: "backup", label: "Automated backups + restore tested" },
    ],
  },
  devops: {
    id: "devops",
    label: "DevOps",
    icon: Container,
    description: "CI/CD, containers, infrastructure as code, and observability.",
    concepts: [
      {
        title: "Infrastructure as Code",
        body: "Define resources in code (Terraform, CloudFormation). Versioned and reproducible.",
      },
      {
        title: "CI/CD Pipelines",
        body: "Automated build, test, and deploy. Use Github Actions or GitLab CI.",
      },
    ],
    resources: [
      { label: "Docker Docs", url: "https://docs.docker.com", desc: "Containerization reference." },
      {
        label: "Terraform Registry",
        url: "https://registry.terraform.io",
        desc: "Infrastructure modules.",
      },
    ],
    checklist: [
      { id: "pipeline", label: "Automated CI pipeline on every PR" },
      { id: "secrets", label: "Secrets managed in vault/env vars" },
      { id: "monitoring", label: "Real-time monitoring and alerting" },
    ],
  },
  testing: {
    id: "testing",
    label: "Testing",
    icon: FlaskConical,
    description: "Frontend, Backend, and End-to-End testing strategies.",
    concepts: [
      {
        title: "Testing Pyramid",
        body: "Many unit tests, fewer integration tests, even fewer E2E tests.",
      },
      { title: "TDD", body: "Test-Driven Development: Red, Green, Refactor." },
    ],
    resources: [
      { label: "Vitest", url: "https://vitest.dev", desc: "Modern frontend testing." },
      { label: "Playwright", url: "https://playwright.dev", desc: "Reliable E2E testing." },
    ],
    checklist: [
      { id: "coverage", label: "Critical paths covered by unit tests" },
      { id: "e2e", label: "E2E smoke tests for main user flows" },
    ],
  },

  "design-patterns": {
    id: "design-patterns",
    label: "Design Patterns",
    icon: GitBranch,
    description:
      "Reusable solutions to common software design problems — from GoF classics to modern architectural patterns.",
    subAreasLabel: "Categories",
    concepts: [
      {
        title: "What Is a Pattern?",
        body: "A named, proven solution to a recurring design problem. Patterns are language-agnostic templates — they describe intent, structure, and trade-offs, not code.",
      },
      {
        title: "SOLID Principles",
        body: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. The foundation every pattern is built on.",
      },
      {
        title: "Favour Composition",
        body: "Prefer object composition over class inheritance. Inheritance creates tight coupling; composition gives you flexible, swappable behaviour at runtime.",
      },
      {
        title: "Program to Interfaces",
        body: "Depend on abstractions, not concrete implementations. This is what makes patterns like Strategy, Decorator, and Observer possible without modification.",
      },
    ],
    resources: [
      {
        label: "refactoring.guru — Patterns",
        url: "https://refactoring.guru/design-patterns",
        desc: "The best visual catalog of all 23 GoF patterns with real-world examples.",
      },
      {
        label: "Design Patterns (GoF)",
        url: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/",
        desc: "The original Gang of Four book — Creational, Structural, and Behavioral patterns.",
      },
      {
        label: "Head First Design Patterns",
        url: "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
        desc: "Visual, brain-friendly introduction — great for beginners.",
      },
      {
        label: "Dive Into Design Patterns",
        url: "https://refactoring.guru/design-patterns/book",
        desc: "Modern guide with TypeScript examples.",
      },
      {
        label: "sourcemaking.com",
        url: "https://sourcemaking.com/design_patterns",
        desc: "Concise pattern catalog with UML diagrams.",
      },
    ],
    checklist: [
      { id: "dp-solid", label: "All classes have a single, clearly defined responsibility" },
      { id: "dp-open", label: "New behaviour added via extension, not modification" },
      { id: "dp-iface", label: "Dependencies injected via interfaces, not concrete types" },
      { id: "dp-comp", label: "Composition used instead of inheritance where possible" },
      { id: "dp-overuse", label: "Patterns applied to real problems — not over-engineered" },
      { id: "dp-naming", label: "Pattern names used in code (e.g. UserFactory, OrderObserver)" },
      { id: "dp-doc", label: "Non-obvious patterns documented with rationale in comments" },
    ],
    subAreas: [
      {
        id: "creational",
        label: "Creational",
        icon: Package,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["creational", "factory", "builder", "singleton"],
        concepts: [
          {
            title: "Factory Method",
            body: "Define an interface for creating an object but let subclasses decide which class to instantiate. Decouples creation from usage — swap implementations without touching client code.",
          },
          {
            title: "Abstract Factory",
            body: "Create families of related objects without specifying their concrete classes. Use when your system must be independent of how its products are created, composed, and represented.",
          },
          {
            title: "Builder",
            body: "Separate the construction of a complex object from its representation. Lets the same construction process create different representations — perfect for objects with many optional fields.",
          },
          {
            title: "Singleton",
            body: "Ensure a class has only one instance and provide a global access point. Use sparingly — it introduces global state and makes testing harder. Prefer Dependency Injection instead.",
          },
          {
            title: "Prototype",
            body: "Create new objects by copying an existing object (the prototype). Useful when object creation is expensive and a nearly identical copy is needed — common in game dev and data pipelines.",
          },
        ],
        resources: [
          { label: "Creational Patterns — refactoring.guru", url: "https://refactoring.guru/design-patterns/creational-patterns", desc: "Visual guides for all 5 creational patterns." },
        ],
      },
      {
        id: "structural",
        label: "Structural",
        icon: Link,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["structural", "adapter", "decorator", "facade", "proxy"],
        concepts: [
          {
            title: "Adapter",
            body: "Convert the interface of a class into another interface clients expect. Lets incompatible interfaces work together — essential when integrating third-party libraries.",
          },
          {
            title: "Decorator",
            body: "Attach additional responsibilities to an object dynamically. Provides a flexible alternative to subclassing — stack decorators like middleware layers.",
          },
          {
            title: "Facade",
            body: "Provide a simplified interface to a complex subsystem. Reduces coupling between clients and subsystems — hide complexity behind a clean API.",
          },
          {
            title: "Proxy",
            body: "Provide a surrogate or placeholder for another object. Use for lazy initialisation, access control, caching, logging, or remote communication.",
          },
          {
            title: "Composite",
            body: "Compose objects into tree structures to represent part-whole hierarchies. Lets clients treat individual objects and compositions uniformly — used in UI trees and file systems.",
          },
          {
            title: "Bridge",
            body: "Decouple an abstraction from its implementation so the two can vary independently. Use when you need to extend both the abstraction and implementation through subclassing.",
          },
        ],
        resources: [
          { label: "Structural Patterns — refactoring.guru", url: "https://refactoring.guru/design-patterns/structural-patterns", desc: "Visual guides for all 7 structural patterns." },
        ],
      },
      {
        id: "behavioral",
        label: "Behavioral",
        icon: Activity,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["behavioral", "observer", "strategy", "command", "iterator"],
        concepts: [
          {
            title: "Observer",
            body: "Define a one-to-many dependency so that when one object changes state, all dependents are notified automatically. Foundation of event systems, React state, and pub/sub.",
          },
          {
            title: "Strategy",
            body: "Define a family of algorithms, encapsulate each one, and make them interchangeable. Lets the algorithm vary independently from clients that use it — eliminates large conditionals.",
          },
          {
            title: "Command",
            body: "Encapsulate a request as an object. Supports undoable operations, queuing, logging, and macro commands. Foundation of task queues and CQRS command buses.",
          },
          {
            title: "Chain of Responsibility",
            body: "Pass a request along a chain of handlers. Each handler decides to process the request or pass it on. Used in middleware pipelines, event bubbling, and validation chains.",
          },
          {
            title: "Template Method",
            body: "Define the skeleton of an algorithm in a base class, deferring some steps to subclasses. Lets subclasses redefine certain steps without changing the algorithm's overall structure.",
          },
          {
            title: "Iterator",
            body: "Provide a way to sequentially access elements of a collection without exposing its underlying representation. JavaScript's for...of and generators are native iterator implementations.",
          },
        ],
        resources: [
          { label: "Behavioral Patterns — refactoring.guru", url: "https://refactoring.guru/design-patterns/behavioral-patterns", desc: "Visual guides for all 11 behavioral patterns." },
        ],
      },
      {
        id: "architectural-patterns",
        label: "Architectural",
        icon: Layers,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["repository", "cqrs", "event-sourcing", "saga", "unit-of-work"],
        concepts: [
          {
            title: "Repository Pattern",
            body: "Abstract data access behind a collection-like interface. Business logic never knows if data comes from Postgres, MongoDB, or an in-memory store. Enables easy testing with mocks.",
          },
          {
            title: "CQRS",
            body: "Command Query Responsibility Segregation — separate the read model from the write model. Enables independent scaling, different data stores per side, and optimized read projections.",
          },
          {
            title: "Event Sourcing",
            body: "Store state changes as a sequence of immutable events. Derive current state by replaying events. Enables full audit logs, temporal queries, and event-driven projections.",
          },
          {
            title: "Unit of Work",
            body: "Track changes to domain objects during a business transaction and coordinate writing them out as a single batch. Prevents partial updates and manages database transactions cleanly.",
          },
          {
            title: "Saga Pattern",
            body: "Manage distributed transactions across multiple services using a sequence of local transactions. Each step publishes an event; on failure, compensating transactions roll back the change.",
          },
        ],
        resources: [
          { label: "Patterns of Enterprise App Architecture", url: "https://martinfowler.com/books/eaa.html", desc: "Martin Fowler's definitive catalog of architectural patterns." },
          { label: "CQRS — Martin Fowler", url: "https://martinfowler.com/bliki/CQRS.html", desc: "Fowler's authoritative explanation of CQRS." },
        ],
      },
    ],
  },

  architecture: {
    id: "architecture",
    label: "Architecture",
    icon: Cpu,
    description:
      "Software architectural styles, structural patterns, and the principles that govern how systems are organized, evolved, and scaled.",
    subAreasLabel: "Styles",
    concepts: [
      {
        title: "Separation of Concerns",
        body: "Divide a system so each module addresses a distinct concern. Reduces coupling, improves testability, and makes changes local — the foundation of every architectural style.",
      },
      {
        title: "Dependency Rule",
        body: "Source code dependencies must point inward — toward higher-level policies, never toward lower-level details. Frameworks, databases, and UIs are details; business rules are the core.",
      },
      {
        title: "Architecture Characteristics",
        body: "Define what qualities the system must have — scalability, reliability, security, maintainability. These drive which architectural style to choose, not technology preference.",
      },
      {
        title: "Fitness Functions",
        body: "Automated checks that verify architectural characteristics over time. Like unit tests for your architecture — prevent drift and ensure the system evolves without losing its properties.",
      },
    ],
    resources: [
      {
        label: "Clean Architecture",
        url: "https://www.oreilly.com/library/view/clean-architecture/9780134494272/",
        desc: "Robert C. Martin — boundaries, use cases, and the dependency rule.",
      },
      {
        label: "Fundamentals of Software Architecture",
        url: "https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/",
        desc: "Architectural styles, characteristics, decisions, and fitness functions.",
      },
      {
        label: "Martin Fowler's bliki",
        url: "https://martinfowler.com",
        desc: "Authoritative articles on CQRS, event sourcing, strangler fig, and bounded context.",
      },
      {
        label: "Architecture of Open Source Applications",
        url: "https://aosabook.org",
        desc: "How real systems like NGINX, Git, and Eclipse are designed.",
      },
    ],
    checklist: [
      { id: "arch-dep", label: "Dependencies point inward — domain layer has no framework imports" },
      { id: "arch-bound", label: "Bounded contexts defined with clear interfaces between them" },
      { id: "arch-fitness", label: "Fitness functions in CI checking key architectural properties" },
      { id: "arch-adr", label: "Architecture Decision Records (ADRs) written for major choices" },
      { id: "arch-modular", label: "Modules/packages enforce their own boundaries (no spaghetti imports)" },
      { id: "arch-testable", label: "Core business logic testable without starting a server or database" },
      { id: "arch-evolvable", label: "Strangler fig or anti-corruption layer used when migrating legacy code" },
    ],
    subAreas: [
      {
        id: "clean-arch",
        label: "Clean Architecture",
        icon: Layers,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["clean-architecture", "solid", "use-cases"],
        concepts: [
          {
            title: "Concentric Layers",
            body: "Entities → Use Cases → Interface Adapters → Frameworks & Drivers. Each ring can only know about rings inside it — never outside. UI and databases are outermost, most replaceable.",
          },
          {
            title: "Entities",
            body: "Enterprise-wide business rules. Pure domain objects with no framework dependencies. These are the highest-level policies — they change least and mean the most.",
          },
          {
            title: "Use Cases",
            body: "Application-specific business rules. Orchestrate entity interactions to fulfill a user goal. They define what the system does, independent of how it is presented or stored.",
          },
          {
            title: "Interface Adapters",
            body: "Convert data between use case format and external formats (REST, GraphQL, database). Controllers, presenters, gateways, and repository implementations live here.",
          },
        ],
        resources: [
          { label: "Clean Architecture — Robert C. Martin", url: "https://www.oreilly.com/library/view/clean-architecture/9780134494272/", desc: "The book that defines the clean architecture model." },
          { label: "Architecture Patterns with Python", url: "https://www.cosmicpython.com", desc: "TDD, DDD, and clean architecture with Python — freely available online." },
        ],
      },
      {
        id: "event-driven-arch",
        label: "Event-Driven",
        icon: Radio,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["event-driven", "events", "pub-sub", "event-sourcing"],
        concepts: [
          {
            title: "Event Notification",
            body: "Services publish events when something happens; other services react. Decouples producers from consumers — the publisher doesn't know or care who is listening.",
          },
          {
            title: "Event-Carried State Transfer",
            body: "Events carry enough data that consumers don't need to call back to the source. Eliminates synchronous coupling and enables local state caching in consumers.",
          },
          {
            title: "Event Sourcing",
            body: "The system's state is derived by replaying an immutable log of events. Enables full audit trail, temporal queries, and projecting multiple read models from one event stream.",
          },
          {
            title: "CQRS with Events",
            body: "Write side processes commands and emits events. Read side builds query-optimised projections from those events. Each side scales and evolves independently.",
          },
        ],
        resources: [
          { label: "Event-Driven Architecture — Martin Fowler", url: "https://martinfowler.com/articles/201701-event-driven.html", desc: "Fowler's authoritative breakdown of event notification, sourcing, and CQRS." },
          { label: "Kafka Documentation", url: "https://kafka.apache.org/documentation/", desc: "The de-facto standard for event streaming at scale." },
        ],
      },
      {
        id: "hexagonal",
        label: "Hexagonal / Ports & Adapters",
        icon: Puzzle,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["hexagonal", "ports-and-adapters", "alistair-cockburn"],
        concepts: [
          {
            title: "Ports",
            body: "Technology-agnostic interfaces (APIs) that the application exposes or uses. Primary ports are driven by actors (e.g. REST controller). Secondary ports drive external systems (e.g. database).",
          },
          {
            title: "Adapters",
            body: "Concrete implementations that connect ports to the outside world. An HTTP adapter connects a REST call to a primary port. A Postgres adapter implements a secondary port.",
          },
          {
            title: "The Application at the Centre",
            body: "The application core contains business logic only. It has no knowledge of REST, databases, or message brokers. It can be tested in total isolation from infrastructure.",
          },
          {
            title: "Inside-Out Development",
            body: "Build and test the application core first. Add adapters later. This lets you prove business rules work before committing to any specific framework or database.",
          },
        ],
        resources: [
          { label: "Hexagonal Architecture — Alistair Cockburn", url: "https://alistair.cockburn.us/hexagonal-architecture/", desc: "The original article that defined ports and adapters." },
        ],
      },
      {
        id: "ddd",
        label: "Domain-Driven Design",
        icon: Brain,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["ddd", "domain", "bounded-context", "aggregate"],
        concepts: [
          {
            title: "Ubiquitous Language",
            body: "Use the same language in code, conversations, and documentation as domain experts. When the code reflects the business vocabulary, misunderstandings surface immediately.",
          },
          {
            title: "Bounded Context",
            body: "A clear boundary within which a particular domain model applies. 'Order' means different things in Shipping vs Billing — bound each meaning to its own context.",
          },
          {
            title: "Aggregates",
            body: "A cluster of domain objects treated as a single unit. The aggregate root enforces invariants. Transactions should not cross aggregate boundaries.",
          },
          {
            title: "Domain Events",
            body: "Capture something that happened in the domain — OrderPlaced, PaymentReceived. Events are first-class citizens used to integrate bounded contexts.",
          },
        ],
        resources: [
          { label: "Domain-Driven Design — Eric Evans", url: "https://www.oreilly.com/library/view/domain-driven-design-tackling/0321125215/", desc: "The original DDD blue book — bounded contexts, aggregates, repositories." },
          { label: "DDD Quickly (free PDF)", url: "https://www.infoq.com/minibooks/domain-driven-design-quickly/", desc: "A free condensed summary of the core DDD concepts." },
        ],
      },
      {
        id: "serverless-arch",
        label: "Serverless",
        icon: CloudCog,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["serverless", "functions", "faas", "lambda"],
        concepts: [
          {
            title: "Function as a Service (FaaS)",
            body: "Deploy individual functions that are invoked on demand. No server management, auto-scaling to zero — you pay per invocation, not per hour.",
          },
          {
            title: "Cold Starts",
            body: "Functions must be initialised before the first request. Keep packages small, use provisioned concurrency for latency-sensitive paths, and warm critical functions on a schedule.",
          },
          {
            title: "Event-Driven Composition",
            body: "Serverless functions are ideal when triggered by events — S3 uploads, queue messages, HTTP requests. Compose workflows using event bridges and orchestration services.",
          },
          {
            title: "Stateless by Default",
            body: "Functions must not rely on local state between invocations. Store state in external systems (S3, DynamoDB, Redis). This is what enables the auto-scaling model.",
          },
        ],
        resources: [
          { label: "AWS Lambda Docs", url: "https://docs.aws.amazon.com/lambda/", desc: "Official Lambda documentation — functions, layers, triggers." },
          { label: "Serverless Framework", url: "https://www.serverless.com/framework/docs", desc: "Deploy serverless apps to any cloud with a single config." },
        ],
      },
    ],
  },

  "system-design": {
    id: "system-design",
    label: "System Design",
    icon: Network,
    description:
      "Design large-scale distributed systems — scalability, reliability, consistency, and the trade-offs that define modern infrastructure.",
    subAreasLabel: "Topics",
    concepts: [
      {
        title: "CAP Theorem",
        body: "A distributed system can only guarantee two of three: Consistency, Availability, Partition Tolerance. Most systems choose AP (eventually consistent) or CP (consistent but may be unavailable).",
      },
      {
        title: "Horizontal vs Vertical Scaling",
        body: "Vertical: bigger machine. Horizontal: more machines. Horizontal is preferred for availability and cost at scale — but requires stateless services and distributed data.",
      },
      {
        title: "Latency vs Throughput",
        body: "Latency is time for one request. Throughput is requests per second. Optimising one often harms the other — batch processing improves throughput but increases individual latency.",
      },
      {
        title: "Back-of-Envelope Estimation",
        body: "Estimate QPS, storage, bandwidth before designing. 1M DAU × 10 req/day ÷ 86400 ≈ 115 QPS. Numbers ground decisions about caching, sharding, and server count.",
      },
    ],
    resources: [
      {
        label: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
        desc: "The most-starred system design resource on GitHub — scalability, caching, and more.",
      },
      {
        label: "Designing Data-Intensive Applications",
        url: "https://dataintensive.net",
        desc: "The bible of distributed systems — replication, sharding, consistency, consensus.",
      },
      {
        label: "ByteByteGo",
        url: "https://bytebytego.com",
        desc: "Visual system design explanations loved by engineers worldwide.",
      },
      {
        label: "High Scalability Blog",
        url: "http://highscalability.com",
        desc: "Real-world architecture teardowns of Twitter, YouTube, Amazon, and more.",
      },
      {
        label: "AWS Architecture Center",
        url: "https://aws.amazon.com/architecture/",
        desc: "Reference architectures and best practices for scalable cloud systems.",
      },
    ],
    checklist: [
      { id: "sd-reqs", label: "Functional and non-functional requirements clarified before designing" },
      { id: "sd-est", label: "Back-of-envelope estimates done (QPS, storage, bandwidth)" },
      { id: "sd-sing", label: "Single points of failure identified and eliminated" },
      { id: "sd-cache", label: "Caching strategy defined (what to cache, TTL, invalidation)" },
      { id: "sd-db", label: "Database choice justified — SQL vs NoSQL vs hybrid" },
      { id: "sd-async", label: "Async processing used for long-running tasks (queues, workers)" },
      { id: "sd-monitor", label: "Monitoring, alerting, and runbooks defined" },
      { id: "sd-failover", label: "Failover and disaster recovery strategy documented" },
    ],
    subAreas: [
      {
        id: "scalability",
        label: "Scalability & Load Balancing",
        icon: BarChart2,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["scalability", "load-balancing", "horizontal-scaling"],
        concepts: [
          {
            title: "Load Balancers",
            body: "Distribute traffic across multiple servers. Layer 4 (TCP) for raw throughput; Layer 7 (HTTP) for content-aware routing. Use health checks to remove unhealthy instances automatically.",
          },
          {
            title: "Stateless Services",
            body: "Services that store no session data locally can be scaled horizontally with zero configuration. Move all session state to Redis or a database — any instance can then handle any request.",
          },
          {
            title: "Auto-Scaling",
            body: "Automatically add or remove instances based on load. Use CPU, memory, or custom metrics (queue depth, request latency) as triggers. Design for both scale-out and scale-in.",
          },
          {
            title: "CDN",
            body: "Serve static assets and cached responses from edge nodes close to users. Offloads origin servers dramatically. Cache-Control headers determine what CDNs store and for how long.",
          },
        ],
        resources: [
          { label: "The System Design Primer — Scalability", url: "https://github.com/donnemartin/system-design-primer#scalability", desc: "Scalability chapter from the most-starred system design repo." },
        ],
      },
      {
        id: "caching-sd",
        label: "Caching Strategies",
        icon: Gauge,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["caching", "redis", "memcached", "cache-invalidation"],
        concepts: [
          {
            title: "Cache-Aside (Lazy Loading)",
            body: "Application checks cache first. On miss, reads from DB and populates cache. Simple and resilient to cache failures. Risk: cache misses on new data cause DB spikes.",
          },
          {
            title: "Write-Through",
            body: "Write to cache and DB simultaneously on every update. Data is always fresh, but adds write latency. Good for read-heavy workloads with low write volume.",
          },
          {
            title: "Cache Eviction Policies",
            body: "LRU (Least Recently Used) is the default. LFU (Least Frequently Used) better for skewed access patterns. TTL-based expiry is mandatory to prevent stale data accumulation.",
          },
          {
            title: "Cache Stampede",
            body: "Many requests hit the DB simultaneously on cache expiry. Mitigate with mutex locks, staggered TTLs, or probabilistic early expiration (re-compute before TTL expires).",
          },
        ],
        resources: [
          { label: "Redis Documentation", url: "https://redis.io/documentation", desc: "Full Redis reference — data types, persistence, clustering, pub/sub." },
        ],
      },
      {
        id: "messaging",
        label: "Messaging & Queues",
        icon: Radio,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["messaging", "kafka", "rabbitmq", "queues", "pub-sub"],
        concepts: [
          {
            title: "Message Queues",
            body: "Decouple producers from consumers. Producers write to the queue; consumers process at their own pace. Buffers load spikes and allows independent scaling of each side.",
          },
          {
            title: "Pub/Sub",
            body: "Publishers broadcast messages to a topic. Multiple subscribers consume independently. Unlike queues, each subscriber gets a copy — used for fan-out, event broadcasting, and notifications.",
          },
          {
            title: "At-Least-Once Delivery",
            body: "Messages are guaranteed to be delivered but may be delivered more than once. Consumers must be idempotent — processing the same message twice must produce the same result.",
          },
          {
            title: "Dead Letter Queues",
            body: "Failed messages land in a DLQ after max retries. Prevents poison messages from blocking the queue. Inspect and replay from DLQ after fixing the underlying issue.",
          },
        ],
        resources: [
          { label: "Apache Kafka Docs", url: "https://kafka.apache.org/documentation/", desc: "The de-facto standard for distributed event streaming." },
          { label: "RabbitMQ Tutorials", url: "https://www.rabbitmq.com/tutorials", desc: "Hands-on queue patterns — work queues, pub/sub, routing, and RPC." },
        ],
      },
      {
        id: "storage-sd",
        label: "Storage & Databases",
        icon: HardDrive,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["databases", "sharding", "replication", "nosql", "sql"],
        concepts: [
          {
            title: "Database Sharding",
            body: "Horizontally partition data across multiple DB nodes. Each shard holds a subset of rows. Choose a shard key that distributes load evenly and keeps related data on the same shard.",
          },
          {
            title: "Replication",
            body: "Leader-follower: writes go to leader, reads from followers. Improves read throughput and availability. Trade-off: replication lag means followers may serve stale data.",
          },
          {
            title: "SQL vs NoSQL",
            body: "SQL: strong consistency, ACID, joins, well-understood. NoSQL: flexible schema, horizontal scale, eventual consistency. Choose based on access patterns, not hype.",
          },
          {
            title: "Object Storage",
            body: "Store blobs (images, videos, backups) in S3-compatible stores. Infinitely scalable, cheap, and globally available. Serve directly via CDN — never proxy through your app servers.",
          },
        ],
        resources: [
          { label: "Designing Data-Intensive Applications", url: "https://dataintensive.net", desc: "Replication, partitioning, transactions, and distributed consensus." },
        ],
      },
      {
        id: "api-design",
        label: "API Design",
        icon: Cable,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["api", "rest", "graphql", "grpc", "api-gateway"],
        concepts: [
          {
            title: "API Gateway",
            body: "Single entry point that routes, authenticates, rate-limits, and transforms requests. Hides internal service topology from clients and enables cross-cutting concerns centrally.",
          },
          {
            title: "REST vs GraphQL vs gRPC",
            body: "REST: simple, widely understood, HTTP caching. GraphQL: flexible queries, single endpoint, great for complex UIs. gRPC: binary, typed, high-performance — ideal for internal service calls.",
          },
          {
            title: "Idempotency",
            body: "Ensure repeated identical requests have the same effect as a single request. Use idempotency keys for payment and order APIs. GET/PUT/DELETE are idempotent; POST is not by default.",
          },
          {
            title: "Versioning",
            body: "Version your APIs from day one — /v1/, /v2/ in the URL or via headers. Never make breaking changes to an existing version. Deprecate with a sunset date and migration guide.",
          },
        ],
        resources: [
          { label: "REST API Design Rulebook", url: "https://www.oreilly.com/library/view/rest-api-design/9781449317904/", desc: "Principles for designing consistent, intuitive REST APIs at scale." },
        ],
      },
    ],
  },

  microservices: {
    id: "microservices",
    label: "Microservices",
    icon: Boxes,
    description:
      "Design, build, and operate distributed microservice architectures — decomposition, communication, resilience, data management, and observability.",
    subAreasLabel: "Topics",
    concepts: [
      {
        title: "Single Responsibility at Service Level",
        body: "Each service owns one business capability end-to-end. If two services always change together, they should be one service. If one service needs another's data for every request, reconsider the split.",
      },
      {
        title: "Decentralised Data Management",
        body: "Each service owns its own database. No shared databases between services — they create hidden coupling that defeats the purpose of microservices.",
      },
      {
        title: "Design for Failure",
        body: "Network calls fail. Services go down. Every inter-service call must have a timeout, retry policy, and a fallback. The system must degrade gracefully, not cascade.",
      },
      {
        title: "Operational Overhead",
        body: "Microservices add distributed systems complexity. You need service discovery, distributed tracing, contract testing, and deployment pipelines per service. Start with a modular monolith.",
      },
    ],
    resources: [
      {
        label: "Building Microservices",
        url: "https://samnewman.io/books/building_microservices_2nd_edition/",
        desc: "Sam Newman — the definitive guide to decomposition, communication, and deployment.",
      },
      {
        label: "Microservices Patterns",
        url: "https://microservices.io/book",
        desc: "Chris Richardson — Saga, CQRS, API Gateway, Service Mesh patterns with trade-off analysis.",
      },
      {
        label: "microservices.io",
        url: "https://microservices.io",
        desc: "The canonical pattern catalog for microservices.",
      },
      {
        label: "Monolith to Microservices",
        url: "https://samnewman.io/books/monolith-to-microservices/",
        desc: "Strangler fig, branch by abstraction, and parallel change strategies.",
      },
    ],
    checklist: [
      { id: "ms-bound", label: "Service boundaries aligned with business capabilities" },
      { id: "ms-db", label: "Each service has its own isolated database" },
      { id: "ms-timeout", label: "All inter-service calls have timeouts and retry policies" },
      { id: "ms-circuit", label: "Circuit breakers implemented for critical dependencies" },
      { id: "ms-trace", label: "Distributed tracing with correlation IDs across all services" },
      { id: "ms-contract", label: "Consumer-driven contract tests between services" },
      { id: "ms-health", label: "Health checks and readiness probes on every service" },
      { id: "ms-deploy", label: "Each service has an independent CI/CD pipeline" },
    ],
    subAreas: [
      {
        id: "decomposition",
        label: "Decomposition",
        icon: Scissors,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["decomposition", "bounded-context", "ddd"],
        concepts: [
          {
            title: "Decompose by Business Capability",
            body: "Identify the business capabilities your organisation performs. Each capability (Order Management, Payment, Notification) maps to a service. Aligns services with organisational structure.",
          },
          {
            title: "Decompose by Subdomain (DDD)",
            body: "Use Domain-Driven Design to identify core, supporting, and generic subdomains. Core subdomains get the most attention; generic ones use off-the-shelf solutions.",
          },
          {
            title: "Strangler Fig Pattern",
            body: "Gradually replace a monolith by routing specific requests to new microservices. The monolith shrinks over time. Never do a big-bang rewrite — it almost always fails.",
          },
          {
            title: "Avoiding Distributed Monolith",
            body: "Services that must all be deployed together or that synchronously call each other in a chain are a distributed monolith — the worst of both worlds. Design for independence.",
          },
        ],
        resources: [
          { label: "Monolith to Microservices — Sam Newman", url: "https://samnewman.io/books/monolith-to-microservices/", desc: "Step-by-step decomposition strategies with real patterns." },
        ],
      },
      {
        id: "communication-ms",
        label: "Communication",
        icon: Cable,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["communication", "grpc", "rest", "async", "events"],
        concepts: [
          {
            title: "Synchronous vs Asynchronous",
            body: "Synchronous (HTTP, gRPC) is simpler but creates temporal coupling — if the downstream service is slow or down, the caller is too. Async (events, queues) decouples availability but adds complexity.",
          },
          {
            title: "gRPC for Internal Communication",
            body: "gRPC is binary, typed, and fast — ideal for high-throughput internal service calls. Auto-generates client SDKs from protobuf definitions. Built-in bidirectional streaming.",
          },
          {
            title: "Service Mesh",
            body: "Offload cross-cutting concerns (mTLS, retries, tracing, load balancing) to a sidecar proxy (Envoy/Istio). Services communicate as if on a reliable network — the mesh handles the rest.",
          },
          {
            title: "API Contracts",
            body: "Define strict API contracts using OpenAPI or protobuf. Use consumer-driven contract testing (Pact) to ensure providers never break their consumers unintentionally.",
          },
        ],
        resources: [
          { label: "gRPC Documentation", url: "https://grpc.io/docs/", desc: "High-performance RPC framework for inter-service communication." },
          { label: "Istio Service Mesh Docs", url: "https://istio.io/latest/docs/", desc: "Traffic management, mTLS, observability for microservice fleets." },
        ],
      },
      {
        id: "resilience",
        label: "Resilience Patterns",
        icon: ShieldCheck,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["resilience", "circuit-breaker", "retry", "bulkhead", "timeout"],
        concepts: [
          {
            title: "Circuit Breaker",
            body: "When failure rate exceeds a threshold, open the circuit — fail fast instead of waiting for timeouts. After a cooldown period, allow a test request through. Prevents cascading failures.",
          },
          {
            title: "Retry with Exponential Backoff",
            body: "Retry transient failures with increasing delay between attempts (1s, 2s, 4s, 8s) plus jitter. Without jitter, all retries hit the downstream service simultaneously — a thundering herd.",
          },
          {
            title: "Bulkhead",
            body: "Isolate resources (thread pools, connection pools) per downstream dependency. A slow database shouldn't exhaust all threads and starve other operations. Fail one compartment, not the ship.",
          },
          {
            title: "Graceful Degradation",
            body: "When a dependency fails, serve a reduced but functional experience. Return cached data, a default response, or a partial result — never a blank page or unhandled exception.",
          },
        ],
        resources: [
          { label: "Resilience4j Docs", url: "https://resilience4j.readme.io/docs", desc: "Lightweight fault tolerance library — circuit breaker, retry, bulkhead." },
        ],
      },
      {
        id: "data-ms",
        label: "Data Management",
        icon: DatabaseZap,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["data", "saga", "cqrs", "eventual-consistency", "transactions"],
        concepts: [
          {
            title: "Saga Pattern",
            body: "Manage distributed transactions as a sequence of local transactions. Choreography: services react to events. Orchestration: a saga orchestrator tells services what to do and handles failures.",
          },
          {
            title: "Eventual Consistency",
            body: "Distributed systems cannot have strong consistency without sacrificing availability. Accept that replicas may diverge temporarily — design UX to handle stale reads gracefully.",
          },
          {
            title: "Database per Service",
            body: "Each service owns its schema and data. Other services query via API, never direct DB access. Enables independent schema evolution, different DB engines, and clear ownership.",
          },
          {
            title: "API Composition",
            body: "For queries that join data across services, have a dedicated aggregator service or gateway call each service and compose the result. Avoid cross-service joins at the database level.",
          },
        ],
        resources: [
          { label: "Microservices Patterns — Chris Richardson", url: "https://microservices.io/book", desc: "Saga, CQRS, and data management patterns with trade-off analysis." },
        ],
      },
      {
        id: "observability-ms",
        label: "Observability",
        icon: MonitorDot,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["observability", "tracing", "metrics", "logging", "opentelemetry"],
        concepts: [
          {
            title: "Three Pillars",
            body: "Metrics (aggregated numbers — latency p99, error rate), Logs (timestamped events), Traces (request paths across services). You need all three — each answers different questions.",
          },
          {
            title: "Distributed Tracing",
            body: "Propagate a correlation ID through every service call. Visualise the full request path, identify latency contributors, and debug errors across service boundaries without grep.",
          },
          {
            title: "OpenTelemetry",
            body: "Vendor-neutral SDK for capturing traces, metrics, and logs. Instrument once, export to any backend (Jaeger, Grafana Tempo, Datadog). Becoming the industry standard.",
          },
          {
            title: "SLIs, SLOs, and SLAs",
            body: "SLI: a metric you measure (request success rate). SLO: your internal target (99.9% success). SLA: the contract with customers. Design monitoring around SLO burn rate, not raw thresholds.",
          },
        ],
        resources: [
          { label: "OpenTelemetry Documentation", url: "https://opentelemetry.io/docs/", desc: "Vendor-neutral observability framework for traces, metrics, and logs." },
          { label: "Distributed Systems Observability", url: "https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/", desc: "Free O'Reilly book — metrics, logging, and tracing in distributed systems." },
        ],
      },
    ],
  },

  security: {
    id: "security",
    label: "Security",
    icon: Shield,
    description:
      "Protect applications from vulnerabilities — from OWASP Top 10 to authentication, cryptography, API security, and infrastructure hardening.",
    subAreasLabel: "Topics",
    concepts: [
      {
        title: "Defence in Depth",
        body: "Layer multiple security controls so that when one fails, another catches it. No single mechanism is sufficient — validate input at every layer, not just the edge.",
      },
      {
        title: "Principle of Least Privilege",
        body: "Grant only the permissions required to perform a task and no more. A database user for the API should not have DROP TABLE rights. A Lambda function should not have full S3 access.",
      },
      {
        title: "Assume Breach",
        body: "Design as if attackers will eventually get in. Segment networks, encrypt data at rest and in transit, log everything, and implement detection — not just prevention.",
      },
      {
        title: "Shift Left on Security",
        body: "Find vulnerabilities in development, not production. Run SAST/DAST in CI, review dependencies for CVEs on every PR, and threat-model new features before writing a line of code.",
      },
    ],
    resources: [
      {
        label: "OWASP Top 10",
        url: "https://owasp.org/www-project-top-ten/",
        desc: "The essential checklist of the 10 most critical web application security risks.",
      },
      {
        label: "PortSwigger Web Security Academy",
        url: "https://portswigger.net/web-security",
        desc: "Free, hands-on labs for every major web vulnerability — the best practical security training.",
      },
      {
        label: "OWASP Cheat Sheet Series",
        url: "https://cheatsheetseries.owasp.org",
        desc: "Quick-reference guides for securing authentication, sessions, APIs, and cryptography.",
      },
      {
        label: "Security Headers",
        url: "https://securityheaders.com",
        desc: "Scan any URL and grade its HTTP security headers — CSP, HSTS, X-Frame-Options.",
      },
    ],
    checklist: [
      { id: "sec-owasp", label: "OWASP Top 10 reviewed and mitigations applied" },
      { id: "sec-input", label: "All user input validated and sanitized server-side" },
      { id: "sec-sql", label: "Parameterized queries used everywhere — no SQL string concatenation" },
      { id: "sec-headers", label: "Security headers set: HSTS, CSP, X-Frame-Options, Referrer-Policy" },
      { id: "sec-auth", label: "Passwords hashed with bcrypt/argon2 — never MD5 or SHA-1" },
      { id: "sec-secrets", label: "Secrets in environment variables / vault — never in source code" },
      { id: "sec-deps", label: "Dependencies audited for CVEs on every build (npm audit / snyk)" },
      { id: "sec-https", label: "HTTPS enforced everywhere; HTTP redirects to HTTPS" },
      { id: "sec-rate", label: "Rate limiting on all auth and sensitive endpoints" },
      { id: "sec-logs", label: "Security events logged and monitored with alerts" },
    ],
    subAreas: [
      {
        id: "web-security",
        label: "Web Vulnerabilities",
        icon: Globe2,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["owasp", "xss", "csrf", "sqli", "injection"],
        concepts: [
          {
            title: "SQL Injection",
            body: "Attacker injects SQL via input fields to read, modify, or delete data. Prevention: parameterized queries / prepared statements everywhere. ORM does not automatically protect you.",
          },
          {
            title: "Cross-Site Scripting (XSS)",
            body: "Attacker injects malicious scripts into pages viewed by other users. Prevention: escape output, use Content Security Policy, avoid innerHTML with user data, validate on server side.",
          },
          {
            title: "CSRF",
            body: "Cross-Site Request Forgery — tricks a logged-in user's browser into making an unwanted request. Prevention: CSRF tokens, SameSite cookie attribute, verifying Origin/Referer headers.",
          },
          {
            title: "Broken Access Control",
            body: "OWASP #1 — users accessing data they shouldn't. Enforce authorization checks on every endpoint, not just the UI. Test by changing IDs in requests (IDOR — Insecure Direct Object Reference).",
          },
          {
            title: "Security Misconfiguration",
            body: "Default credentials, debug modes in production, overly permissive CORS, directory listing enabled. Automate configuration checks with security scanners in your CI pipeline.",
          },
        ],
        resources: [
          { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", desc: "The 10 most critical web application security risks." },
          { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", desc: "Free hands-on labs for every major web vulnerability." },
        ],
      },
      {
        id: "auth-security",
        label: "Authentication & Authorization",
        icon: Key,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["auth", "jwt", "oauth", "rbac", "mfa"],
        concepts: [
          {
            title: "Password Hashing",
            body: "Use bcrypt, scrypt, or Argon2. Never MD5 or SHA-1 — they're not designed for passwords. Add a salt (built into bcrypt). Use a cost factor that makes cracking impractical.",
          },
          {
            title: "JWT Best Practices",
            body: "Sign with RS256 (asymmetric) in production. Validate issuer, audience, and expiry on every request. Store in httpOnly cookies, not localStorage (XSS resistant). Keep payloads small.",
          },
          {
            title: "OAuth 2.0 & OIDC",
            body: "OAuth 2.0 is for authorization (access to resources). OIDC adds authentication (identity). Use the Authorization Code flow with PKCE for web and mobile — never Implicit flow.",
          },
          {
            title: "RBAC / ABAC",
            body: "Role-Based Access Control assigns permissions to roles, not users. ABAC evaluates attributes (user, resource, environment) for fine-grained decisions. Enforce at the service layer, not just UI.",
          },
          {
            title: "Multi-Factor Authentication",
            body: "Something you know (password) + something you have (TOTP app) + something you are (biometrics). Even weak passwords become safe with MFA — enforce it for all admin accounts.",
          },
        ],
        resources: [
          { label: "OWASP Authentication Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html", desc: "Complete guide to secure authentication implementation." },
          { label: "JWT.io", url: "https://jwt.io", desc: "Decode, verify, and generate JWT tokens — with library references." },
        ],
      },
      {
        id: "cryptography",
        label: "Cryptography",
        icon: Lock,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["crypto", "tls", "encryption", "hashing", "certificates"],
        concepts: [
          {
            title: "Symmetric vs Asymmetric Encryption",
            body: "Symmetric (AES): same key encrypts and decrypts — fast, used for bulk data. Asymmetric (RSA/ECC): public key encrypts, private key decrypts — used for key exchange and signatures.",
          },
          {
            title: "TLS / HTTPS",
            body: "TLS authenticates the server, negotiates a symmetric key, and encrypts all traffic. Always use TLS 1.2+. Disable weak ciphers. Use HSTS to prevent downgrade attacks.",
          },
          {
            title: "Hashing vs Encryption",
            body: "Hashing is one-way (SHA-256, bcrypt). Encryption is reversible. Use hashing for passwords and integrity checks. Use encryption for data you need to retrieve (tokens, PII, secrets).",
          },
          {
            title: "Key Management",
            body: "Never hardcode keys. Rotate them regularly. Use a dedicated secret store (AWS KMS, HashiCorp Vault). Separate keys per environment. Audit every key access.",
          },
        ],
        resources: [
          { label: "Crypto 101 (free book)", url: "https://www.crypto101.io", desc: "Free cryptography primer — block ciphers, hashing, TLS, and public-key infrastructure." },
          { label: "SSL Labs Server Test", url: "https://www.ssllabs.com/ssltest/", desc: "Grade your TLS configuration and find weak cipher suites." },
        ],
      },
      {
        id: "api-sec",
        label: "API Security",
        icon: PlugZap,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["api-security", "rate-limiting", "owasp-api", "cors"],
        concepts: [
          {
            title: "OWASP API Security Top 10",
            body: "API-specific risks: Broken Object Level Authorization, Excessive Data Exposure, Lack of Resources & Rate Limiting, Broken Function Level Authorization. Different from the classic OWASP Top 10.",
          },
          {
            title: "Rate Limiting & Throttling",
            body: "Limit requests per IP and per API key. Use token bucket or sliding window algorithms. Return 429 with Retry-After header. Protect auth endpoints most aggressively.",
          },
          {
            title: "Input Validation on Every Endpoint",
            body: "Validate all inputs — type, length, format, range — at the server, not just the frontend. Use schema validation libraries (Zod, Joi). Reject malformed requests before business logic runs.",
          },
          {
            title: "CORS Configuration",
            body: "Don't use Access-Control-Allow-Origin: * on authenticated endpoints. Whitelist specific origins. CORS is a browser control — it doesn't protect server-to-server API calls.",
          },
        ],
        resources: [
          { label: "OWASP API Security Top 10", url: "https://owasp.org/www-project-api-security/", desc: "The API-specific version of the OWASP Top 10." },
          { label: "OWASP API Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html", desc: "REST API security best practices from OWASP." },
        ],
      },
      {
        id: "infra-security",
        label: "Infrastructure Security",
        icon: ServerIcon,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["infrastructure", "cloud-security", "network", "iam"],
        concepts: [
          {
            title: "Least Privilege IAM",
            body: "Cloud IAM roles should grant only the permissions needed. Avoid wildcard permissions (*). Use service accounts per workload. Audit permission usage with Cloud IAM analyser.",
          },
          {
            title: "Network Segmentation",
            body: "Put databases and internal services in private subnets — not publicly accessible. Use security groups or firewall rules to allow only required traffic between services.",
          },
          {
            title: "Secrets Management",
            body: "Never commit secrets to version control. Use a dedicated vault (AWS Secrets Manager, HashiCorp Vault). Rotate secrets regularly. Audit every secret access. Scan repos for leaked secrets.",
          },
          {
            title: "Patch Management",
            body: "Run automated vulnerability scans on container images and dependencies. Use minimal base images (Alpine, Distroless). Rebuild and redeploy images regularly — don't SSH into running containers.",
          },
        ],
        resources: [
          { label: "HackTheBox", url: "https://www.hackthebox.com", desc: "Hands-on security labs — CTF challenges and career paths for developers." },
          { label: "AWS Security Best Practices", url: "https://docs.aws.amazon.com/security/", desc: "AWS security documentation — IAM, VPC, encryption, compliance." },
        ],
      },
    ],
  },

  performance: {
    id: "performance",
    label: "Performance",
    icon: Zap,
    description:
      "Measure and improve application speed at every layer — frontend rendering, backend throughput, database queries, and network delivery.",
    subAreasLabel: "Topics",
    concepts: [
      {
        title: "Measure Before Optimising",
        body: "Premature optimisation is the root of all evil. Profile first — find the actual bottleneck. Gut feelings are wrong more often than not. A 5% improvement on a non-bottleneck changes nothing.",
      },
      {
        title: "Amdahl's Law",
        body: "Speedup from parallelising is limited by the sequential fraction. If 20% of work is sequential, max speedup is 5× regardless of how many cores you add. Optimise the bottleneck.",
      },
      {
        title: "Latency Numbers Every Dev Should Know",
        body: "L1 cache: 1ns. RAM: 100ns. SSD: 100µs. Network round-trip: 1–100ms. These orders-of-magnitude guide architecture — avoid a DB call where a cache lookup will do.",
      },
      {
        title: "The 80/20 Rule",
        body: "80% of performance gain comes from 20% of optimisations. Find the slow path (using profilers and tracing) and fix that — don't micro-optimise code that runs 0.1% of the time.",
      },
    ],
    resources: [
      {
        label: "High Performance Browser Networking",
        url: "https://hpbn.co",
        desc: "TCP, TLS, HTTP/2, WebSockets, WebRTC — free book by Ilya Grigorik.",
      },
      {
        label: "web.dev — Performance",
        url: "https://web.dev/performance/",
        desc: "Google's authoritative guide to Core Web Vitals, lazy loading, and caching.",
      },
      {
        label: "The USE Method",
        url: "https://www.brendangregg.com/usemethod.html",
        desc: "Utilization, Saturation, Errors — a systematic framework for diagnosing bottlenecks.",
      },
      {
        label: "WebPageTest",
        url: "https://www.webpagetest.org",
        desc: "Deep performance testing from real browsers in real locations — waterfall, filmstrip.",
      },
    ],
    checklist: [
      { id: "perf-profile", label: "Production profiling done before any optimisation" },
      { id: "perf-cwv", label: "Core Web Vitals pass: LCP < 2.5s, CLS < 0.1, INP < 200ms" },
      { id: "perf-cache", label: "Static assets served with long Cache-Control max-age via CDN" },
      { id: "perf-query", label: "Slow queries identified with EXPLAIN and indexes added" },
      { id: "perf-n1", label: "N+1 query problem eliminated — use joins or DataLoader batching" },
      { id: "perf-bundle", label: "JS bundle analysed — code split, tree-shaken, no duplicate deps" },
      { id: "perf-img", label: "Images served as WebP/AVIF with correct sizes and lazy loading" },
      { id: "perf-compress", label: "Gzip/Brotli compression enabled on server responses" },
    ],
    subAreas: [
      {
        id: "frontend-perf",
        label: "Frontend Performance",
        icon: MonitorDot,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["frontend", "web-vitals", "bundle", "rendering"],
        concepts: [
          {
            title: "Core Web Vitals",
            body: "LCP (Largest Contentful Paint < 2.5s): page load speed. CLS (Cumulative Layout Shift < 0.1): visual stability. INP (Interaction to Next Paint < 200ms): responsiveness. Google uses these for ranking.",
          },
          {
            title: "Critical Rendering Path",
            body: "HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite. Blocking resources (render-blocking scripts, large CSS) delay this. Preload critical resources, defer non-critical scripts.",
          },
          {
            title: "Code Splitting & Lazy Loading",
            body: "Split your JS bundle by route. Lazy-load components not needed on initial render. React.lazy + Suspense, dynamic import(). Don't ship code users may never run.",
          },
          {
            title: "Image Optimisation",
            body: "Use WebP/AVIF (40–60% smaller than JPEG). Set explicit width/height to prevent CLS. Use srcset for responsive images. Lazy-load below-the-fold images with loading='lazy'.",
          },
          {
            title: "Perceived Performance",
            body: "Skeleton screens, optimistic UI updates, and instant feedback make apps feel faster than they are. Show something immediately — even a spinner is better than a blank screen.",
          },
        ],
        resources: [
          { label: "web.dev — Performance", url: "https://web.dev/performance/", desc: "Core Web Vitals, rendering, and browser performance from Google." },
          { label: "Chrome DevTools Performance", url: "https://developer.chrome.com/docs/devtools/performance/", desc: "How to profile, flame charts, long tasks, and memory leaks." },
          { label: "Lighthouse Docs", url: "https://developer.chrome.com/docs/lighthouse/", desc: "Automated auditing for performance, accessibility, SEO, and best practices." },
        ],
      },
      {
        id: "backend-perf",
        label: "Backend Performance",
        icon: ServerIcon,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["backend", "throughput", "concurrency", "profiling"],
        concepts: [
          {
            title: "Profiling First",
            body: "Use a profiler (py-spy, clinic.js, pprof) to find where CPU time is spent. Flame graphs show the call stack. Fix the widest bars — small optimisations elsewhere are noise.",
          },
          {
            title: "Concurrency Models",
            body: "Thread-per-request (traditional): simple but memory-intensive at scale. Async/event-loop (Node, Go): high concurrency with low overhead. CPU-bound work belongs in worker threads or processes.",
          },
          {
            title: "Caching",
            body: "Cache expensive computations and frequent DB queries in Redis with appropriate TTLs. Even a 1-second cache on a hot endpoint can eliminate thousands of DB calls per minute.",
          },
          {
            title: "Connection Pooling",
            body: "Opening a DB connection is expensive. Pool connections and reuse them. Set pool size based on DB thread limit and server concurrency. Too large a pool is as bad as too small.",
          },
        ],
        resources: [
          { label: "Systems Performance — Brendan Gregg", url: "https://www.brendangregg.com/systems-performance.html", desc: "CPU, memory, storage, and network performance analysis using flame graphs." },
        ],
      },
      {
        id: "db-perf",
        label: "Database Performance",
        icon: DatabaseZap,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["database", "indexing", "query-optimization", "n+1"],
        concepts: [
          {
            title: "EXPLAIN ANALYZE",
            body: "Run EXPLAIN ANALYZE on slow queries. Look for Seq Scan on large tables (needs an index), high row estimates, nested loops on large datasets. This is the most valuable performance tool you have.",
          },
          {
            title: "Indexing Strategy",
            body: "Index columns used in WHERE, JOIN, and ORDER BY. Composite indexes: put the most selective column first. Partial indexes for frequently queried subsets. Too many indexes slow writes.",
          },
          {
            title: "N+1 Query Problem",
            body: "Fetching a list of N records and then querying for related data N times. Fix with JOIN, eager loading, or DataLoader batching. EXPLAIN reveals it; query logging confirms it.",
          },
          {
            title: "Query Optimisation Patterns",
            body: "Select only needed columns — never SELECT *. Use pagination (LIMIT/OFFSET or cursor-based). Avoid functions on indexed columns in WHERE clauses — they prevent index use.",
          },
        ],
        resources: [
          { label: "Use The Index, Luke", url: "https://use-the-index-luke.com", desc: "SQL performance explained — how indexes really work, query plans, and tuning." },
          { label: "PostgreSQL EXPLAIN documentation", url: "https://www.postgresql.org/docs/current/using-explain.html", desc: "Official guide to reading query plans in Postgres." },
        ],
      },
      {
        id: "network-perf",
        label: "Network & CDN",
        icon: Network,
        color: "border-primary/40 bg-primary/10 text-primary",
        accent: "border-primary/30",
        tags: ["network", "cdn", "http2", "compression", "caching"],
        concepts: [
          {
            title: "HTTP/2 & HTTP/3",
            body: "HTTP/2 multiplexes requests over a single connection — eliminates head-of-line blocking and makes domain sharding counterproductive. HTTP/3 (QUIC) improves performance on lossy networks.",
          },
          {
            title: "Compression",
            body: "Gzip/Brotli compress text responses (HTML, CSS, JS, JSON) by 70–90%. Brotli compresses ~20% better than Gzip. Never compress already-compressed formats (JPEG, PNG, MP4).",
          },
          {
            title: "CDN Strategy",
            body: "Serve static assets with far-future Cache-Control max-age via CDN. Cache API responses at the edge for public data. Use cache invalidation rather than short TTLs.",
          },
          {
            title: "DNS & TLS Optimisation",
            body: "Preconnect to third-party origins (<link rel='preconnect'>). Use TLS 1.3 for 1-RTT handshakes. Enable OCSP stapling to eliminate certificate revocation round-trips.",
          },
        ],
        resources: [
          { label: "High Performance Browser Networking", url: "https://hpbn.co", desc: "TCP, TLS, HTTP/2, WebSockets — how the network works and how to optimize it." },
          { label: "WebPageTest", url: "https://www.webpagetest.org", desc: "Deep performance testing from real browsers and locations." },
        ],
      },
    ],
  },
};

export const SOFT_SKILLS_DATA: SkillAreaData = {
  id: "softskills",
  label: "Soft Skills",
  icon: Heart,
  description:
    "The human side of engineering — communication, leadership, and emotional intelligence.",
  concepts: [],
  resources: [],
  checklist: [
    { id: "agenda", label: "Meeting has clear agenda & desired outcome" },
    { id: "feedback", label: "Feedback is specific, behavioral, and timely" },
    { id: "focus", label: "Deep work blocks scheduled in calendar" },
    { id: "listen", label: "Repeat back understanding before disagreeing" },
    { id: "write", label: "Key decisions documented in writing" },
    { id: "delegate", label: "Delegate the 'what', not the 'how'" },
  ],
  subAreas: [
    {
      id: "communication",
      label: "Communication",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["communication"],
      concepts: [
        {
          title: "Active Listening",
          body: "Repeat back what you heard before responding. Ask clarifying questions. In code review, comment on intent before style.",
        },
        {
          title: "Async Writing",
          body: "Lead with the conclusion (BLUF). Use bullet points for scanability. Record decisions and 'why' — future you will thank you.",
        },
        {
          title: "Technical Storytelling",
          body: "Frame trade-offs as 'option A buys X but costs Y'. Use diagrams for systems. Anchor numbers (latency, cost) before opinions.",
        },
        {
          title: "Stakeholder Translation",
          body: "Translate engineering jargon into business outcomes. 'Refactor' → 'reduces incident frequency'. 'Tech debt' → 'slowing feature velocity 30%'.",
        },
        {
          title: "1:1 Conversations",
          body: "Show up with one topic, not a status report. Ask open questions ('what's draining you?'). Silence is a tool — let people finish their thought.",
        },
        {
          title: "Disagree & Commit",
          body: "State your objection once, clearly, with evidence. If the team chooses otherwise, commit fully — no sabotage, no 'I told you so'.",
        },
        {
          title: "Written Standups",
          body: "Yesterday / Today / Blockers — kept under 5 lines. Tag people you need from. Async beats a 30-minute meeting for 6 people.",
        },
      ],
      resources: [
        {
          label: "Nonviolent Communication",
          url: "https://www.cnvc.org/",
          desc: "The foundational framework for empathy.",
        },
        {
          label: "Crucial Conversations",
          url: "https://cruciallearning.com/",
          desc: "Tools for talking when stakes are high.",
        },
        {
          label: "Never Split the Difference",
          url: "https://www.blackswanltd.com/",
          desc: "Tactical empathy and negotiation by an ex-FBI hostage negotiator.",
        },
      ],
    },
    {
      id: "speaking",
      label: "Public Speaking",
      icon: Mic,
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["speaking", "presentations", "talks"],
      concepts: [
        {
          title: "Open With a Hook",
          body: "First 30 seconds decide whether the room listens. Start with a surprising number, a sharp question, or a 1-sentence story — never with 'My name is...'.",
        },
        {
          title: "Rule of Three",
          body: "Group ideas in threes: 3 problems, 3 reasons, 3 takeaways. The brain remembers triplets and forgets lists of seven.",
        },
        {
          title: "Slow Down, Then Slow Down Again",
          body: "Nerves push you to 1.5x speed. Mark deliberate pauses on your slides. A 2-second silence after a key point lands harder than any animation.",
        },
        {
          title: "Demo Discipline",
          body: "Record a backup video. Pre-stage data. Zoom your terminal to 18pt+. Never type a password on stage — paste from a notes file.",
        },
        {
          title: "Q&A Without Panic",
          body: "Repeat the question (buys time, helps the room). 'I don't know — I'll follow up' is a strong answer. Park hostile threads: 'great topic, let's chat after'.",
        },
      ],
      resources: [
        {
          label: "Talk Like TED",
          url: "https://www.ted.com/playlists",
          desc: "Watch 3 talks in your domain, copy what works, drop what doesn't.",
        },
        {
          label: "Presentation Zen",
          url: "https://presentationzen.com/",
          desc: "Slide design philosophy that kills bullet-heavy decks.",
        },
      ],
    },
    {
      id: "negotiation",
      label: "Negotiation",
      icon: Handshake,
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["negotiation", "influence"],
      concepts: [
        {
          title: "Anchor First",
          body: "Whoever names the first number shapes the range. Research market data, then open at the high end of reasonable.",
        },
        {
          title: "Trade, Don't Concede",
          body: "Never give without getting. 'I can do that deadline if scope drops feature X' beats 'sure, no problem'.",
        },
        {
          title: "BATNA",
          body: "Know your Best Alternative To a Negotiated Agreement. If you have no walk-away option, you're not negotiating — you're begging.",
        },
      ],
    },
    {
      id: "leadership",
      label: "Leadership",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["leadership"],
      concepts: [
        {
          title: "Lead Without Authority",
          body: "Influence by demonstrating, not directing. Write the first RFC. Build the smallest reference implementation. Volunteer for the boring glue.",
        },
        {
          title: "Delegation",
          body: "Delegate outcomes, not steps. Give context, constraints, and a deadline. Trust the person to choose the path.",
        },
        {
          title: "Run Effective 1:1s",
          body: "Their agenda first, yours second. Weekly cadence, 30 minutes. Notes in a shared doc you both edit — career, blockers, feedback.",
        },
        {
          title: "Radical Candor",
          body: "Care personally + challenge directly. Praise in public, critique in private, always specific and timely.",
        },
      ],
      resources: [
        {
          label: "Extreme Ownership",
          url: "https://echelonfront.com/",
          desc: "Leadership principles from Navy SEALs.",
        },
        {
          label: "The Manager's Path",
          url: "https://www.oreilly.com/",
          desc: "Guide for tech leaders.",
        },
        {
          label: "Radical Candor",
          url: "https://www.radicalcandor.com/",
          desc: "Kim Scott's framework for honest, caring feedback.",
        },
      ],
    },
    {
      id: "problem-solving",
      label: "Problem Solving",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["problem-solving"],
      concepts: [
        {
          title: "First Principles",
          body: "Strip the problem to physical/logical truths. Rebuild from there. Avoid 'this is how we always do it' as a solution.",
        },
        {
          title: "5 Whys",
          body: "Ask 'why' five times to drive past symptoms to root cause. Pairs well with blameless post-mortems.",
        },
        {
          title: "Rubber Duck",
          body: "Explain the problem out loud to a duck (or a colleague who isn't even listening). The act of verbalizing exposes the gap.",
        },
        {
          title: "Inversion",
          body: "Instead of 'how do I succeed?', ask 'what guarantees failure?' — then avoid those. Often a faster path to the answer.",
        },
      ],
    },
    {
      id: "teamwork",
      label: "Teamwork",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["teamwork"],
      concepts: [
        {
          title: "Psychological Safety",
          body: "Reward 'I don't know' and 'I was wrong'. Punish blame, not mistakes.",
        },
        {
          title: "Assume Positive Intent",
          body: "Default to 'they had a reason' instead of 'they're an idiot'. Ask before you assume — 90% of the time it's missing context, not malice.",
        },
        {
          title: "Shared Ownership",
          body: "The team ships the feature, not the individual. Rotate ownership of modules so no single person is a bus factor.",
        },
      ],
      resources: [
        { label: "The Five Dysfunctions of a Team", url: "https://www.tablegroup.com/product/dysfunctions/", desc: "Patrick Lencioni's model for building trust and accountability." },
        { label: "Team Topologies", url: "https://teamtopologies.com/", desc: "Organising teams for fast flow of change." },
      ],
    },
    {
      id: "conflict",
      label: "Conflict Resolution",
      icon: Swords,
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["conflict", "teamwork"],
      concepts: [
        {
          title: "Separate People from Problems",
          body: "Attack the issue, not the person. 'This approach has a flaw' vs 'your idea is bad'. Keeps conversations productive.",
        },
        {
          title: "Identify Interests, Not Positions",
          body: "Ask 'why do you want that?' instead of debating 'what'. Shared interests often exist beneath opposing positions.",
        },
        {
          title: "Blameless Post-Mortems",
          body: "Focus on systems and processes that allowed a mistake, not the person who made it. Culture of learning over culture of fear.",
        },
        {
          title: "The Crucial Conversation Framework",
          body: "Notice when a conversation turns crucial (stakes + emotions + differing opinions). Create safety, share your path, explore others' paths.",
        },
        {
          title: "Disagree in Private, Align in Public",
          body: "Raise concerns before the decision is made, in the right forum. Once the team decides, present a unified front to stakeholders.",
        },
      ],
      resources: [
        { label: "Crucial Conversations", url: "https://cruciallearning.com/", desc: "Tools for high-stakes disagreements." },
        { label: "Nonviolent Communication", url: "https://www.cnvc.org/", desc: "Empathy-first framework for resolving tension." },
        { label: "Getting to Yes", url: "https://www.pon.harvard.edu/", desc: "Harvard negotiation project — principled conflict resolution." },
      ],
    },
    {
      id: "remote",
      label: "Remote Collaboration",
      icon: Wifi,
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["remote", "async", "teamwork"],
      concepts: [
        {
          title: "Async by Default",
          body: "Write it down before scheduling a meeting. Loom + Notion + Slack threads handle 80% of communication without synchronous cost.",
        },
        {
          title: "Overlap Hours Are Sacred",
          body: "Protect shared working hours for critical discussions and pairing. Everything else is async.",
        },
        {
          title: "Over-Communicate Context",
          body: "Remote removes hallway conversations. Add 'why' to every decision. Leave a trail of context in tickets, PRs, and docs.",
        },
        {
          title: "Camera On for Hard Conversations",
          body: "Tone is lost in text. Difficult feedback, disagreements, and 1:1s deserve a video call where facial cues are visible.",
        },
        {
          title: "Document Decisions, Not Just Outcomes",
          body: "Record what you decided AND why you rejected alternatives. Future teammates won't repeat the same discussions.",
        },
      ],
      resources: [
        { label: "GitLab Remote Playbook", url: "https://handbook.gitlab.com/handbook/company/culture/all-remote/", desc: "Industry-leading async remote culture guide." },
        { label: "Basecamp — Shape Up", url: "https://basecamp.com/shapeup", desc: "Async-first product development at scale." },
      ],
    },
    {
      id: "pairing",
      label: "Pair Programming",
      icon: Terminal,
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["pairing", "mob-programming", "teamwork"],
      concepts: [
        {
          title: "Driver / Navigator Pattern",
          body: "Driver types, navigator thinks ahead and reviews. Swap every 15–25 min with a timer. Never let one person drive for an hour.",
        },
        {
          title: "Strong-Style Pairing",
          body: "'For an idea to go from your head into the computer, it must go through someone else's hands.' The navigator holds all decisions.",
        },
        {
          title: "Mob Programming",
          body: "Whole team on one keyboard, one screen, rotating driver every few minutes. Extreme knowledge sharing — nothing gets siloed. Use for onboarding and complex problems.",
        },
        {
          title: "When to Pair",
          body: "Complex architecture decisions, debugging gnarly issues, onboarding new team members, or spreading knowledge of a critical system. Don't pair on trivial tasks — it's expensive.",
        },
      ],
      resources: [
        { label: "Martin Fowler — Pair Programming", url: "https://martinfowler.com/articles/on-pair-programming.html", desc: "Exhaustive guide to pairing styles, benefits, and practical patterns." },
      ],
    },
    {
      id: "code-review",
      label: "Code Review",
      icon: GitPullRequest,
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["code-review", "pr", "feedback"],
      concepts: [
        {
          title: "Review Intent, Then Implementation",
          body: "First check: does this PR do the right thing? Then: is it done the right way? A well-written PR that solves the wrong problem should be blocked, not merged and refactored.",
        },
        {
          title: "Nit vs Blocking",
          body: "Label comments: 'nit:' (take it or leave it), 'suggestion:' (worth considering), 'blocking:' (must fix). Reviewers who block on every nit slow teams and breed resentment.",
        },
        {
          title: "Small PRs",
          body: "A PR with 50 lines gets real review. A PR with 500 lines gets a rubber stamp. Break work into reviewable chunks. Feature flags let you merge incomplete features safely.",
        },
        {
          title: "Author Responsibility",
          body: "Don't submit PRs that you wouldn't review. Write a clear description — what, why, how to test. Add screenshots for UI changes. Make the reviewer's job easy.",
        },
      ],
    },
    {
      id: "continuous-learning",
      label: "Continuous Learning",
      icon: RefreshCw,
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["learning", "growth", "career"],
      concepts: [
        {
          title: "Deliberate Practice",
          body: "Reading about programming ≠ practicing programming. Build things at the edge of your ability. Katas, side projects, and open source contributions beat passive consumption.",
        },
        {
          title: "T-Shaped Skills",
          body: "Go deep in one area (your specialisation) while maintaining breadth across others (system design, testing, communication). Specialists who understand context are far more valuable.",
        },
        {
          title: "Public Learning",
          body: "Write about what you learn — blog posts, tweets, internal RFCs. Teaching forces clarity. It builds your reputation and helps others. The best engineers give more than they take.",
        },
        {
          title: "The 20% Rule",
          body: "Protect 20% of your time for learning, experimentation, and technical exploration. If you're always in delivery mode, you'll stagnate. Learning is not optional — it's part of the job.",
        },
      ],
    },
  ],
};
