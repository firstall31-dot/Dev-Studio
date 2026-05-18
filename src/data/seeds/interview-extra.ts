import type { InterviewQuestion } from "../../types/skills";

const now = Date.now();
const q = (i: number) => `iqx_${i}`;

export const seedInterviewExtra: InterviewQuestion[] = [
  // ─── ANGULAR ─────────────────────────────────────────────────────────────
  {
    id: q(1),
    area: "frontend",
    difficulty: "junior",
    question: "What is Angular's component lifecycle and name the key hooks?",
    answer:
      "Angular components go through: ngOnChanges (input changes), ngOnInit (after first change detection), ngDoCheck, ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy. Most commonly used: ngOnInit (setup), ngOnDestroy (cleanup subscriptions), ngOnChanges (react to @Input changes).",
    tags: ["angular", "lifecycle", "components"],
    category: "Angular",
    createdAt: now,
  },
  {
    id: q(2),
    area: "frontend",
    difficulty: "mid",
    question: "How does Angular's dependency injection system work?",
    answer:
      "Angular has a hierarchical DI system. Services are registered in providers (root injector, module injector, or component injector). When a component requests a service via constructor injection, Angular walks up the injector tree to find a provider. `providedIn: 'root'` makes a service a singleton app-wide. Component-level providers create a new instance per component subtree.",
    tags: ["angular", "dependency-injection", "services"],
    category: "Angular",
    createdAt: now,
  },
  {
    id: q(3),
    area: "frontend",
    difficulty: "senior",
    question: "What is the difference between Default and OnPush change detection in Angular?",
    answer:
      "Default: Angular checks the entire component tree on every event/async operation (slow for large apps). OnPush: Angular only checks when 1) an @Input reference changes (immutable data), 2) an event originates from the component or its children, 3) async pipe emits, or 4) markForCheck() is called manually. OnPush requires immutable data patterns and delivers significant performance gains.",
    tags: ["angular", "change-detection", "performance"],
    category: "Angular",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(4),
    area: "frontend",
    difficulty: "junior",
    question: "What is the difference between structural and attribute directives in Angular?",
    answer:
      "Structural directives change DOM layout by adding/removing elements — prefixed with * (*ngIf, *ngFor, *ngSwitch). They use the `<ng-template>` syntax under the hood. Attribute directives change the appearance or behavior of an existing element without changing structure (ngClass, ngStyle, custom directives using @HostListener/@HostBinding).",
    tags: ["angular", "directives"],
    category: "Angular",
    createdAt: now,
  },
  {
    id: q(5),
    area: "frontend",
    difficulty: "mid",
    question: "What is RxJS and how is it central to Angular?",
    answer:
      "RxJS is a library for reactive programming using Observables. Angular uses it throughout: HttpClient returns Observables, Router events are streams, Forms have valueChanges/statusChanges Observables, EventEmitter extends Subject. Key operators: map, filter, switchMap (cancel previous), mergeMap (concurrent), takeUntil (cleanup), combineLatest, debounceTime. Always unsubscribe in ngOnDestroy or use async pipe.",
    tags: ["angular", "rxjs", "observables"],
    category: "Angular",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(6),
    area: "frontend",
    difficulty: "mid",
    question: "What are Angular Signals and how do they differ from RxJS?",
    answer:
      "Signals (Angular 16+) are reactive primitives — a signal holds a value and notifies consumers when it changes. Simpler than RxJS for synchronous state: `const count = signal(0); count.set(1); count.update(v => v+1); computed(() => count() * 2)`. Unlike RxJS, signals are synchronous, don't need subscription management, and integrate with OnPush change detection automatically. RxJS remains better for async event streams.",
    tags: ["angular", "signals", "reactivity"],
    category: "Angular",
    createdAt: now,
  },
  {
    id: q(7),
    area: "frontend",
    difficulty: "mid",
    question: "How does lazy loading work in Angular?",
    answer:
      "Lazy loading defers loading feature modules/components until their route is activated. In the router: `loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)` or with standalone components: `loadComponent: () => import('./feature.component')`. Reduces initial bundle size. Works with preloading strategies (PreloadAllModules, custom) to fetch lazy chunks in the background after initial load.",
    tags: ["angular", "lazy-loading", "performance", "routing"],
    category: "Angular",
    createdAt: now,
  },
  {
    id: q(8),
    area: "frontend",
    difficulty: "mid",
    question: "What is the difference between Template-driven and Reactive forms in Angular?",
    answer:
      "Template-driven: logic lives in the template (ngModel, ngForm), simple and familiar, less testable, async validation is complex. Reactive: form structure defined in component class (FormControl, FormGroup, FormArray), synchronous access to form tree, fully testable, better for complex dynamic forms. Both use `FormsModule` or `ReactiveFormsModule`. Reactive forms are preferred for non-trivial forms.",
    tags: ["angular", "forms"],
    category: "Angular",
    createdAt: now,
  },

  // ─── VUE.JS ───────────────────────────────────────────────────────────────
  {
    id: q(9),
    area: "frontend",
    difficulty: "mid",
    question: "What is the difference between Vue's Composition API and Options API?",
    answer:
      "Options API: organizes code by options (data, methods, computed, watch) — familiar but logic for one feature is scattered. Composition API (Vue 3): organizes code by logical concern using `setup()` and composables (reusable functions). Better TypeScript support, easier to extract/reuse logic. Both work in Vue 3; Composition API is recommended for new projects.",
    tags: ["vue", "composition-api", "options-api"],
    category: "Vue.js",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(10),
    area: "frontend",
    difficulty: "mid",
    question: "How does Vue 3's reactivity system work?",
    answer:
      "Vue 3 uses ES Proxy for reactivity. `reactive()` wraps an object in a Proxy that intercepts get/set to track dependencies and trigger updates. `ref()` wraps primitives in an object with a `.value` getter/setter. `computed()` creates lazy, cached derived values. `watch()` and `watchEffect()` run side effects when dependencies change. The tracking is automatic — accessing a reactive value inside a computed/watchEffect registers it as a dependency.",
    tags: ["vue", "reactivity", "proxy"],
    category: "Vue.js",
    createdAt: now,
  },
  {
    id: q(11),
    area: "frontend",
    difficulty: "junior",
    question: "What is Pinia and why is it preferred over Vuex?",
    answer:
      "Pinia is the official Vue state management library (successor to Vuex). Benefits over Vuex: no mutations (just actions and state), full TypeScript support out of the box, simpler API (no namespaced modules), devtools support, composables-based design. Store: `defineStore('id', { state: () => ({}), getters: {}, actions: {} })`. Lightweight and tree-shakeable.",
    tags: ["vue", "pinia", "state-management"],
    category: "Vue.js",
    createdAt: now,
  },
  {
    id: q(12),
    area: "frontend",
    difficulty: "junior",
    question: "What are Vue's key directives and what do they do?",
    answer:
      "v-if/v-else/v-else-if: conditionally renders (removes from DOM). v-show: toggles CSS display. v-for: list rendering (always add :key). v-bind (:): dynamically binds attributes/props. v-on (@): attaches event listeners. v-model: two-way data binding. v-slot: scoped slots. Rule: use v-show for frequent toggles (no DOM recreate); v-if for infrequent/conditional rendering.",
    tags: ["vue", "directives"],
    category: "Vue.js",
    createdAt: now,
  },
  {
    id: q(13),
    area: "frontend",
    difficulty: "mid",
    question: "What is the difference between computed properties and watchers in Vue?",
    answer:
      "Computed: declarative derived values, cached until dependencies change, returns a value, use for derived UI data. Watch: imperative side effects when a value changes, no return value, use when you need to perform async operations or call APIs in response to state change. watchEffect: runs immediately and re-runs when any reactive dependency changes. Prefer computed over watch when possible.",
    tags: ["vue", "computed", "watch"],
    category: "Vue.js",
    createdAt: now,
  },

  // ─── SVELTE ───────────────────────────────────────────────────────────────
  {
    id: q(14),
    area: "frontend",
    difficulty: "mid",
    question: "How does Svelte fundamentally differ from React and Vue?",
    answer:
      "Svelte is a compiler, not a runtime framework. It compiles components to highly optimized vanilla JavaScript at build time — no virtual DOM, no runtime diffing. Updates are surgical direct DOM operations. Results: smaller bundle size, faster runtime performance, no overhead. Tradeoff: smaller ecosystem, no runtime introspection, compilation step required.",
    tags: ["svelte", "compiler", "performance"],
    category: "Svelte",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(15),
    area: "frontend",
    difficulty: "mid",
    question: "What are Svelte stores and how do they enable state sharing?",
    answer:
      "Svelte stores are observable objects with a subscribe method. Built-ins: writable(value), readable(value, start), derived(stores, fn). Any store can be used in any component — not just Svelte. The `$` prefix auto-subscribes and unsubscribes: `$count` in a template subscribes automatically. Custom stores wrap writable with additional logic. No provider/context needed for global state.",
    tags: ["svelte", "stores", "state"],
    category: "Svelte",
    createdAt: now,
  },
  {
    id: q(16),
    area: "frontend",
    difficulty: "mid",
    question: "What are Svelte 5 Runes?",
    answer:
      "Runes (Svelte 5) replace the compiler magic with explicit reactive primitives: `$state()` for reactive state, `$derived()` for computed values, `$effect()` for side effects, `$props()` for component props. More explicit than Svelte 4's implicit reactivity (assigning to a variable = reactive). Better TypeScript support and clearer reactivity semantics. Similar intent to Vue's ref/computed/watchEffect but compiler-powered.",
    tags: ["svelte", "runes", "svelte5"],
    category: "Svelte",
    createdAt: now,
  },

  // ─── NEXT.JS ──────────────────────────────────────────────────────────────
  {
    id: q(17),
    area: "frontend",
    difficulty: "mid",
    question: "What is the difference between App Router and Pages Router in Next.js?",
    answer:
      "Pages Router (Next.js < 13): file-based routing in /pages, getServerSideProps/getStaticProps for data fetching, all components are client-side by default. App Router (Next.js 13+): file-based routing in /app, React Server Components by default, co-located layouts/loading/error files, Server Actions for mutations, streaming with Suspense. App Router is the recommended path for new projects.",
    tags: ["nextjs", "app-router", "pages-router"],
    category: "Next.js",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(18),
    area: "frontend",
    difficulty: "mid",
    question:
      "What are React Server Components (RSC) and how do they differ from Client Components?",
    answer:
      "Server Components render exclusively on the server — they can fetch data directly (DB, APIs), import server-only modules, and never ship their code to the client. Client Components (`'use client'`) run in the browser and can use hooks, event handlers, browser APIs. RSCs can render Client Components but not vice versa. RSCs reduce JS bundle size and enable direct data access without API layers.",
    tags: ["nextjs", "rsc", "server-components"],
    category: "Next.js",
    createdAt: now,
  },
  {
    id: q(19),
    area: "frontend",
    difficulty: "mid",
    question: "What is Incremental Static Regeneration (ISR) in Next.js?",
    answer:
      "ISR lets you create or update static pages after build time without a full rebuild. Configure with `revalidate` in App Router (`export const revalidate = 60`). On-demand revalidation via `revalidatePath()` or `revalidateTag()`. Pages are served from cache and regenerated in the background when stale. Best for: e-commerce product pages, blog posts, dashboards that tolerate slight staleness.",
    tags: ["nextjs", "isr", "ssg", "caching"],
    category: "Next.js",
    createdAt: now,
  },
  {
    id: q(20),
    area: "frontend",
    difficulty: "mid",
    question: "What are Server Actions in Next.js?",
    answer:
      "Server Actions (Next.js 14+) are async functions that run on the server, callable from Client Components. Decorated with `'use server'`. Used for form submissions, mutations, database writes — eliminating the need for API routes for simple mutations. They integrate with React's form action pattern, support progressive enhancement, and can be used with `useFormState` / `useFormStatus` hooks.",
    tags: ["nextjs", "server-actions", "mutations"],
    category: "Next.js",
    createdAt: now,
  },

  // ─── ASP.NET CORE ─────────────────────────────────────────────────────────
  {
    id: q(21),
    area: "backend",
    difficulty: "mid",
    question: "How does the ASP.NET Core middleware pipeline work?",
    answer:
      "Middleware are components assembled in a pipeline. Each has access to HttpContext and can call the next middleware. Registered via `app.Use()`, `app.Run()` (terminal), `app.Map()` (branch). Order matters: request flows in registration order, response flows in reverse. Common built-ins: UseRouting, UseAuthentication, UseAuthorization, UseCors, UseStaticFiles. Use `app.UseExceptionHandler()` early to catch downstream errors.",
    tags: ["aspnet", "middleware", "pipeline"],
    category: "ASP.NET Core",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(22),
    area: "backend",
    difficulty: "junior",
    question: "How does dependency injection work in ASP.NET Core?",
    answer:
      "ASP.NET Core has built-in DI via IServiceCollection. Register services with lifetimes: Transient (new instance per request), Scoped (one per HTTP request), Singleton (one for app lifetime). Inject via constructor parameters — the framework resolves the dependency graph. Use `services.AddScoped<IMyService, MyService>()`. Scoped services are the most common for request-based work like DB contexts.",
    tags: ["aspnet", "dependency-injection", "ioc"],
    category: "ASP.NET Core",
    createdAt: now,
  },
  {
    id: q(23),
    area: "backend",
    difficulty: "mid",
    question: "What are Minimal APIs in ASP.NET Core and when should you use them?",
    answer:
      "Minimal APIs (ASP.NET Core 6+) define endpoints with less ceremony than controllers: `app.MapGet('/items', (MyDb db) => db.Items.ToListAsync())`. No controller classes, attributes-light, co-located handler logic. Best for: microservices, simple CRUD endpoints, performance-critical APIs (lower overhead than controllers). Use controllers when you need complex filter pipelines, model binders, or large teams prefer MVC convention.",
    tags: ["aspnet", "minimal-apis", "endpoints"],
    category: "ASP.NET Core",
    createdAt: now,
  },
  {
    id: q(24),
    area: "backend",
    difficulty: "mid",
    question: "What is Entity Framework Core and what are its main approaches?",
    answer:
      "EF Core is the ORM for .NET. Two approaches: Code-First (define C# model classes, generate migrations with `dotnet ef migrations add`) and Database-First (scaffold models from existing DB). Key concepts: DbContext manages DB connections and change tracking, DbSet<T> represents a table, LINQ queries translate to SQL, migrations version the schema. Use AsNoTracking() for read-only queries for performance.",
    tags: ["aspnet", "efcore", "orm", "database"],
    category: "ASP.NET Core",
    createdAt: now,
  },
  {
    id: q(25),
    area: "backend",
    difficulty: "mid",
    question: "How does authentication and authorization work in ASP.NET Core?",
    answer:
      "Authentication: who are you? — `AddAuthentication()` + schemes (JWT Bearer, Cookie, OAuth). Use `[Authorize]` attribute or `RequireAuthorization()` for minimal APIs. Authorization: what can you do? — `AddAuthorization()` with policies. Claims-based: check user.HasClaim(). Policy-based: `RequireRole`, `RequireClaim`, custom `IAuthorizationRequirement`. JWT: validate with `AddJwtBearer()`, check signature, issuer, audience, expiry.",
    tags: ["aspnet", "auth", "jwt", "security"],
    category: "ASP.NET Core",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(26),
    area: "backend",
    difficulty: "senior",
    question: "What is the CQRS pattern and how is it implemented in .NET?",
    answer:
      "CQRS (Command Query Responsibility Segregation) separates read (Query) and write (Command) models. Commands mutate state and return nothing (or a minimal result). Queries read state and return data. Benefits: optimize reads/writes independently, different DB models for reads (denormalized) vs writes (normalized). In .NET: often implemented with MediatR library — handlers implement IRequestHandler<TCommand, TResult>. Pairs well with event sourcing.",
    tags: ["aspnet", "cqrs", "architecture", "mediatr"],
    category: "ASP.NET Core",
    createdAt: now,
  },
  {
    id: q(27),
    area: "backend",
    difficulty: "mid",
    question: "What are Background Services in ASP.NET Core?",
    answer:
      "Background services run long-running tasks alongside the web host. Implement `IHostedService` or extend `BackgroundService` (simpler — override `ExecuteAsync(CancellationToken)`). Registered with `services.AddHostedService<MyWorker>()`. Use cases: polling external APIs, processing message queues, scheduled jobs (use Quartz.NET or HangFire for scheduling). Always respect the CancellationToken for graceful shutdown.",
    tags: ["aspnet", "background-services", "workers"],
    category: "ASP.NET Core",
    createdAt: now,
  },
  {
    id: q(28),
    area: "backend",
    difficulty: "mid",
    question: "What is the difference between IActionResult and ActionResult<T> in ASP.NET Core?",
    answer:
      "IActionResult: returns any HTTP result (Ok(), NotFound(), BadRequest()). ActionResult<T>: adds generic type so return type is explicit — enables Swagger/OpenAPI to auto-document the success response schema and allows returning T directly (auto-wrapped in 200 OK) or IActionResult for error codes. Always prefer `ActionResult<T>` in controllers for better documentation and type safety.",
    tags: ["aspnet", "controllers", "api"],
    category: "ASP.NET Core",
    createdAt: now,
  },

  // ─── DATABASE AREA ────────────────────────────────────────────────────────
  {
    id: q(29),
    area: "database",
    difficulty: "junior",
    question: "What are the different types of SQL JOINs?",
    answer:
      "INNER JOIN: rows where condition matches in both tables. LEFT JOIN: all rows from left + matching rows from right (NULLs for non-matches). RIGHT JOIN: all rows from right + matching rows from left. FULL OUTER JOIN: all rows from both, NULLs where no match. CROSS JOIN: cartesian product (every combination). SELF JOIN: table joined with itself (hierarchies). LEFT JOIN is the most commonly used after INNER JOIN.",
    tags: ["sql", "joins", "fundamentals"],
    category: "SQL Fundamentals",
    createdAt: now,
  },
  {
    id: q(30),
    area: "database",
    difficulty: "mid",
    question: "What is database normalization? Explain 1NF, 2NF, 3NF.",
    answer:
      "Normalization reduces redundancy and improves integrity. 1NF: atomic columns (no arrays/repeating groups), each row unique. 2NF: 1NF + no partial dependencies (non-key columns depend on the full primary key, not just part of it — matters for composite keys). 3NF: 2NF + no transitive dependencies (non-key columns depend only on the primary key, not on other non-key columns). BCNF is a stricter form of 3NF.",
    tags: ["sql", "normalization", "schema-design"],
    category: "Schema Design",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(31),
    area: "database",
    difficulty: "mid",
    question:
      "What are the different transaction isolation levels and what problems do they prevent?",
    answer:
      "Problems: Dirty Read (read uncommitted data), Non-repeatable Read (same query gives different results), Phantom Read (new rows appear in range query). Levels (weakest → strongest): READ UNCOMMITTED (no protection), READ COMMITTED (prevents dirty reads — Postgres default), REPEATABLE READ (prevents dirty + non-repeatable — MySQL default for InnoDB), SERIALIZABLE (prevents all — slowest). Higher isolation = less concurrency.",
    tags: ["sql", "transactions", "isolation", "concurrency"],
    category: "Transactions & Concurrency",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(32),
    area: "database",
    difficulty: "junior",
    question: "What is the difference between WHERE and HAVING in SQL?",
    answer:
      "WHERE filters rows before grouping — it operates on individual rows and cannot use aggregate functions. HAVING filters groups after GROUP BY — it can use aggregate functions (HAVING COUNT(*) > 5). Rule: if you need to filter on an aggregate result, use HAVING; for all other row-level filters, use WHERE (it's faster as it reduces rows before aggregation).",
    tags: ["sql", "aggregation", "fundamentals"],
    category: "SQL Fundamentals",
    createdAt: now,
  },
  {
    id: q(33),
    area: "database",
    difficulty: "mid",
    question: "What is a Common Table Expression (CTE) and when should you use it?",
    answer:
      "A CTE (WITH clause) defines a named temporary result set scoped to the query. Benefits: readability (name complex subqueries), reusability within the same query, enables recursive queries (recursive CTE for hierarchies/trees). `WITH cte AS (SELECT ...) SELECT * FROM cte`. CTEs are not materialized by default in most DBs — they're inlined like views. Use when subqueries become deeply nested and hard to read.",
    tags: ["sql", "cte", "advanced"],
    category: "SQL Fundamentals",
    createdAt: now,
  },
  {
    id: q(34),
    area: "database",
    difficulty: "senior",
    question: "What is a covering index and how does it eliminate table lookups?",
    answer:
      "A covering index includes all columns needed to satisfy a query — the DB can answer the query entirely from the index without touching the main table (heap/cluster). Example: query `SELECT email FROM users WHERE status = 'active'` is covered by index `(status, email)`. This eliminates the I/O-heavy random access to table rows. In Postgres, use `INCLUDE` clause to add non-key columns: `CREATE INDEX ON users(status) INCLUDE (email)`.",
    tags: ["database", "indexing", "performance"],
    category: "Indexing & Performance",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(35),
    area: "database",
    difficulty: "mid",
    question: "What is a composite index and what is the prefix rule?",
    answer:
      "A composite index covers multiple columns: `CREATE INDEX ON orders(user_id, status, created_at)`. The prefix rule: the index is usable for queries that filter on a left-to-right prefix of the index columns. This index supports queries on (user_id), (user_id, status), (user_id, status, created_at) — but NOT on (status) alone or (status, created_at). Column order matters: put equality conditions before range conditions.",
    tags: ["database", "indexing", "composite-index"],
    category: "Indexing & Performance",
    createdAt: now,
  },
  {
    id: q(36),
    area: "database",
    difficulty: "mid",
    question: "What is Redis and what are its main use cases?",
    answer:
      "Redis is an in-memory data structure store (strings, hashes, lists, sets, sorted sets, streams). Use cases: Caching (TTL-based, LRU eviction), Session storage, Rate limiting (INCR + EXPIRE), Pub/Sub messaging, Leaderboards (sorted sets), Distributed locks (SET NX EX), Job queues (Lists, Streams). Data is optionally persisted (RDB snapshots or AOF log). Single-threaded command execution ensures atomicity.",
    tags: ["redis", "caching", "nosql"],
    category: "NoSQL & Redis",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(37),
    area: "database",
    difficulty: "mid",
    question: "When would you choose MongoDB over PostgreSQL?",
    answer:
      "MongoDB: flexible/evolving schema (content management, catalogs), document-centric data with nested structures, high write throughput, horizontal scaling from day one, when you don't need complex joins. PostgreSQL: relational data with complex queries and joins, ACID transactions, strong consistency requirements, analytics/reporting, JSON support (JSONB) for mixed workloads. For most SaaS apps, PostgreSQL with JSONB covers both needs without operational complexity of MongoDB.",
    tags: ["mongodb", "postgresql", "nosql", "sql"],
    category: "NoSQL & Redis",
    createdAt: now,
  },
  {
    id: q(38),
    area: "database",
    difficulty: "senior",
    question: "What is database sharding and what are its challenges?",
    answer:
      "Sharding partitions data horizontally across multiple database servers (shards) by a shard key (e.g., user_id % N). Enables horizontal write scaling beyond a single node's capacity. Challenges: cross-shard queries are expensive, joins across shards require application-level merging, resharding when adding nodes is complex, hot shards if key is poorly chosen (uneven distribution), no cross-shard ACID transactions. Alternatives: read replicas, vertical scaling, partitioning within one DB.",
    tags: ["database", "sharding", "scalability"],
    category: "Scaling & Architecture",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(39),
    area: "database",
    difficulty: "junior",
    question: "What is a database migration and why is it important?",
    answer:
      "A migration is a versioned, incremental change to the database schema (create table, add column, create index). Migrations are code-reviewed, committed to version control, and applied in order across all environments. Benefits: reproducible schema across dev/staging/production, rollback capability, team collaboration without schema conflicts. Tools: Flyway, Liquibase (language-agnostic), Alembic (Python), EF Core migrations, Drizzle Kit.",
    tags: ["database", "migrations", "devops"],
    category: "Schema Design",
    createdAt: now,
  },
  {
    id: q(40),
    area: "database",
    difficulty: "mid",
    question: "What is an ORM and what are its tradeoffs?",
    answer:
      "ORM (Object-Relational Mapper) maps database tables to classes/objects, enabling type-safe queries without raw SQL. Benefits: productivity, portability across DBs, migrations tooling, avoids SQL injection by default. Tradeoffs: N+1 query problem if eager loading not configured, generated SQL can be inefficient (use EXPLAIN to verify), abstraction leaks in complex queries, heavy reflection overhead. Solution: use ORM for standard CRUD, raw SQL / query builders for complex queries.",
    tags: ["orm", "database", "architecture"],
    category: "ORM & Tools",
    createdAt: now,
  },
  {
    id: q(41),
    area: "database",
    difficulty: "senior",
    question: "What is database denormalization and when is it justified?",
    answer:
      "Denormalization intentionally introduces redundancy (duplicating data, pre-computed aggregates) to speed up reads at the cost of write complexity and storage. Justified when: read performance is critical and joins are too slow, the data is mostly read-only, you need to support analytics queries on OLTP data, or building read models for CQRS. Examples: storing user name on orders table, pre-computed order totals. Always measure before denormalizing — premature optimization.",
    tags: ["database", "denormalization", "performance"],
    category: "Schema Design",
    createdAt: now,
  },
  {
    id: q(42),
    area: "database",
    difficulty: "senior",
    question: "What is Event Sourcing and how does it relate to databases?",
    answer:
      "Event Sourcing stores state as an immutable sequence of events rather than the current state. Instead of UPDATE users SET balance=100, you store BalanceDebited{amount:50}. Current state is derived by replaying events. Benefits: complete audit log, ability to rebuild state at any point, decoupled event consumers. Tradeoffs: complex queries (need projections/read models), eventual consistency, snapshot management for long event histories. Usually paired with CQRS.",
    tags: ["database", "event-sourcing", "architecture"],
    category: "Scaling & Architecture",
    createdAt: now,
  },
  {
    id: q(43),
    area: "database",
    difficulty: "mid",
    question:
      "What is the difference between optimistic and pessimistic concurrency control in databases?",
    answer:
      "Pessimistic: acquire a lock before reading/writing (SELECT FOR UPDATE). Blocks concurrent access — safe but reduces throughput. Use for high-contention scenarios like inventory deduction. Optimistic: read without lock, write with a version check (WHERE version = :expected). If version changed, abort and retry. Better throughput when conflicts are rare — common in web apps. Both prevent lost updates. Optimistic is the ORM default (version column).",
    tags: ["database", "concurrency", "transactions"],
    category: "Transactions & Concurrency",
    createdAt: now,
  },
  {
    id: q(44),
    area: "database",
    difficulty: "mid",
    question: "How does PostgreSQL's EXPLAIN ANALYZE work and what should you look for?",
    answer:
      "EXPLAIN ANALYZE executes the query and shows the actual execution plan with timing. Key things to look for: Sequential Scan on large tables (add index?), Nested Loop on large sets (may need HashJoin), rows estimate vs actual rows (bad statistics → run ANALYZE), high cost nodes at the top of the plan. Use `EXPLAIN (ANALYZE, BUFFERS)` to see cache hits/misses. Look for hash joins on big result sets, and index scans for filtered queries.",
    tags: ["postgresql", "query-optimization", "performance"],
    category: "Indexing & Performance",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(45),
    area: "database",
    difficulty: "junior",
    question: "What is the difference between a primary key and a unique index?",
    answer:
      "Primary key: uniquely identifies each row, cannot be NULL, only one per table, automatically creates a unique index, used as the default join target. Unique index: enforces uniqueness on one or more columns, can allow NULLs (multiple NULLs are allowed in most DBs since NULL ≠ NULL), multiple unique indexes per table, used for business-level uniqueness constraints (email, username). Foreign keys reference primary keys by default.",
    tags: ["sql", "indexing", "fundamentals"],
    category: "SQL Fundamentals",
    createdAt: now,
  },
  {
    id: q(46),
    area: "database",
    difficulty: "mid",
    question: "What is connection pooling in databases and how do you size the pool?",
    answer:
      "A connection pool maintains a set of pre-established connections reused across requests. Opening a DB connection is expensive (TCP handshake, auth, SSL). Without pooling, each request opens/closes a connection — at scale you hit DB connection limits. Sizing rule of thumb: pool_size = num_cores × 2 + effective_spindle_count (HDD) or just CPU cores × 2 for SSD. Use PgBouncer for Postgres in transaction mode. Monitor: pool exhaustion (requests queuing) = increase pool or reduce query time.",
    tags: ["database", "connection-pooling", "performance"],
    category: "ORM & Tools",
    createdAt: now,
  },

  // ─── BACKEND TESTING ──────────────────────────────────────────────────────
  {
    id: q(47),
    area: "testing",
    difficulty: "mid",
    question: "How do you write integration tests for an ASP.NET Core API?",
    answer:
      "Use `WebApplicationFactory<TProgram>` from Microsoft.AspNetCore.Mvc.Testing. It spins up the full app in-memory with a test HTTP client. Replace real services with fakes: `factory.WithWebHostBuilder(builder => builder.ConfigureTestServices(...))`. Use an in-memory DB or test DB that resets between tests. Assert on response status codes and deserialized body. Add xUnit's `IClassFixture<WebApplicationFactory<Program>>` for shared factory.",
    tags: ["aspnet", "testing", "integration-tests", "xunit"],
    category: "Backend Testing (.NET)",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(48),
    area: "testing",
    difficulty: "junior",
    question: "What is xUnit and how does it compare to NUnit in .NET?",
    answer:
      "Both are popular .NET test frameworks. xUnit: constructor injection for setup (no [SetUp]), IDisposable for cleanup, Theory/InlineData for parameterized tests, shared context via IClassFixture. NUnit: [SetUp]/[TearDown] attributes, [TestCase] for parameterized, more attribute-heavy. MSTest: Microsoft's built-in, less community features. xUnit is the most modern and is used by ASP.NET Core itself — prefer it for new projects. Fluent Assertions is a popular assertion library for all three.",
    tags: ["aspnet", "xunit", "nunit", "testing"],
    category: "Backend Testing (.NET)",
    createdAt: now,
  },
  {
    id: q(49),
    area: "testing",
    difficulty: "mid",
    question: "How do you mock dependencies in .NET unit tests?",
    answer:
      "Use Moq or NSubstitute for mocking interfaces. Moq: `var mock = new Mock<IMyService>(); mock.Setup(m => m.GetById(1)).ReturnsAsync(result); var sut = new MyController(mock.Object);`. Verify calls: `mock.Verify(m => m.Save(It.IsAny<Item>()), Times.Once)`. NSubstitute: cleaner syntax `var sub = Substitute.For<IMyService>()`. Never mock concrete classes — depend on interfaces (ISP principle). Mock at service boundaries, not deep implementation details.",
    tags: ["aspnet", "moq", "mocking", "unit-tests"],
    category: "Backend Testing (.NET)",
    createdAt: now,
  },
  {
    id: q(50),
    area: "testing",
    difficulty: "mid",
    question: "How do you test a Node.js/Express REST API?",
    answer:
      "Supertest: sends HTTP requests to the Express app without a real server. `const res = await request(app).post('/api/items').send({name:'test'}).expect(201)`. Use Jest or Vitest as the test runner. Mock DB calls with jest.mock() or a test-specific DB. Structure: test file per route, use beforeEach to reset state/mocks, afterAll to close DB connections. For integration tests, use a real test database (Postgres in Docker) that migrates and seeds before tests.",
    tags: ["nodejs", "supertest", "jest", "api-testing"],
    category: "Backend Testing (Node.js)",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(51),
    area: "testing",
    difficulty: "senior",
    question: "What is Testcontainers and when is it the right choice?",
    answer:
      "Testcontainers is a library that spins up real Docker containers (Postgres, Redis, Kafka) for integration tests. Instead of in-memory fakes (which don't replicate real DB behavior) or shared test DBs (shared state = flaky tests), each test suite gets an isolated real container. Supports .NET, Java, Node.js, Go. Best for: DB-heavy integration tests where you need real SQL semantics (constraints, indexes, transactions). Slower than in-memory but catches real bugs mocks miss.",
    tags: ["testcontainers", "integration-tests", "docker"],
    category: "Backend Testing (Node.js)",
    createdAt: now,
  },
  {
    id: q(52),
    area: "testing",
    difficulty: "mid",
    question: "How do you test async code in .NET (async/await)?",
    answer:
      "xUnit supports async test methods natively — just make the test method `async Task`. `[Fact] public async Task GetUser_ReturnsUser() { var result = await service.GetUserAsync(1); Assert.NotNull(result); }`. For testing exceptions in async: use `await Assert.ThrowsAsync<NotFoundException>(() => service.GetAsync(-1))`. Don't use `.Result` or `.Wait()` in tests — can cause deadlocks. Use CancellationToken where applicable.",
    tags: ["aspnet", "async", "xunit", "testing"],
    category: "Backend Testing (.NET)",
    createdAt: now,
  },
  {
    id: q(53),
    area: "testing",
    difficulty: "mid",
    question: "What is pytest and what makes it powerful for Python backend testing?",
    answer:
      "pytest is Python's most popular test framework. Key features: fixtures (reusable setup with dependency injection — `@pytest.fixture`), parametrize (`@pytest.mark.parametrize`), auto-discovery of test files. For FastAPI: use `TestClient` or `httpx.AsyncClient` with `anyio`. Fixtures for DB: create a test DB, apply migrations, yield client, teardown. Popular plugins: pytest-asyncio (async tests), pytest-cov (coverage), factory-boy (test data factories), pytest-mock (mock wrapper).",
    tags: ["python", "pytest", "fastapi", "testing"],
    category: "Backend Testing (Python)",
    createdAt: now,
  },

  // ─── DRIZZLE & POSTGRES ──────────────────────────────────────────────────
  {
    id: q(54),
    area: "backend",
    difficulty: "junior",
    question: "What is Drizzle ORM and how does it differ from traditional ORMs?",
    answer:
      "Drizzle ORM is a lightweight, edge-ready TypeScript ORM that closely mirrors SQL. Unlike traditional ORMs (like Prisma) that use an intermediate schema language and an abstraction layer, Drizzle allows you to write SQL-like queries in TypeScript with full type safety. This results in zero hidden queries, predictable performance, and no need for a heavy query engine, making it ideal for serverless environments.",
    tags: ["drizzle", "orm", "postgres", "typescript"],
    category: "Database (Postgres)",
    createdAt: now,
  },
  {
    id: q(55),
    area: "backend",
    difficulty: "mid",
    question: "How do you handle schema migrations with Drizzle ORM?",
    answer:
      "Schema migrations in Drizzle are handled using 'drizzle-kit'. You define your schema in TypeScript files (e.g., using `pgTable`). Then, you run `drizzle-kit generate` to read your TypeScript schema and automatically generate the necessary SQL migration files. These SQL files can then be applied to your Postgres database using `drizzle-kit push` or through a custom migration runner like `migrate()` provided by Drizzle's database drivers.",
    tags: ["drizzle", "migrations", "database", "postgresql"],
    category: "Database (Postgres)",
    favorite: true,
    createdAt: now,
  },
  {
    id: q(56),
    area: "backend",
    difficulty: "senior",
    question: "What are the performance benefits of using connection pooling (like pg-pool or neon-serverless) with Postgres in a serverless environment?",
    answer:
      "In a serverless environment, applications scale dynamically, potentially opening thousands of simultaneous connections to the database. Postgres typically forks a new process for each connection, which consumes significant memory (around 10MB per connection) and connection setup time. Connection pooling mitigates this by maintaining a pool of persistent connections that serverless functions can reuse, significantly reducing latency and preventing the database server from running out of memory or connection slots under high load.",
    tags: ["postgres", "performance", "serverless", "architecture"],
    category: "Database (Postgres)",
    createdAt: now,
  },
];
