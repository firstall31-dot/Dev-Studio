const now = Date.now();
const id = (p: string, i: number) => `${p}_${i}`;

export interface PromptSeed {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  body: string;
  variables: string[];
  model?: string;
  favorite?: boolean;
  usageCount: number;
  versions: { id: string; createdAt: number; body: string; note?: string }[];
  createdAt: number;
  updatedAt: number;
}

export const seedPrompts: PromptSeed[] = [
  {
    id: id("p", 1),
    title: "Database Schema Architect",
    description:
      "Generates production-ready PostgreSQL schemas with RLS, relations, indexes, and audit columns.",
    category: "Backend",
    tags: ["postgres", "drizzle", "schema", "database"],
    body: `Act as a senior database architect. Design a production-ready PostgreSQL schema for {{project_name}} using {{tech_stack}}.

Requirements:
1. snake_case table names, UUID primary keys with defaultRandom()
2. created_at / updated_at timestamps with defaultNow()
3. Drizzle ORM definitions with full TypeScript types
4. Indexes on all foreign keys and high-cardinality query columns
5. Row-Level Security policies for user-scoped tables
6. Provide migration SQL and a brief ER diagram in text form

Domain context: {{domain_description}}`,
    variables: ["project_name", "tech_stack", "domain_description"],
    model: "claude-3.5-sonnet",
    favorite: true,
    usageCount: 27,
    versions: [
      {
        id: "v1",
        createdAt: now - 86400000 * 14,
        body: "Act as a database architect. Design a PostgreSQL schema for {{project_name}}.",
        note: "Initial version — no RLS",
      },
    ],
    createdAt: now - 86400000 * 14,
    updatedAt: now - 3600000 * 2,
  },
  {
    id: id("p", 2),
    title: "Next.js Auth Wrapper",
    description:
      "Generates a complete NextAuth v5 setup with providers, middleware, session typing, and protected route helpers.",
    category: "System Prompts",
    tags: ["nextjs", "auth", "typescript", "middleware"],
    body: `You are an expert Next.js engineer. Generate a NextAuth v5 (Auth.js) setup for {{project_name}}.

Providers to configure: {{providers}}

Include:
- auth.ts config with all providers, callbacks, and session strategy
- Middleware for protecting routes matching {{protected_routes}}
- TypeScript module augmentation for session types
- useSession hook wrapper with loading/unauthenticated states
- A signIn/signOut UI component
- Environment variable documentation in .env.example format`,
    variables: ["project_name", "providers", "protected_routes"],
    model: "gpt-5",
    usageCount: 14,
    versions: [],
    createdAt: now - 86400000 * 21,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: id("p", 3),
    title: "Radix + Motion Component Generator",
    description: "Wraps Radix UI primitives with Framer Motion entrance and exit animations.",
    category: "UI/UX",
    tags: ["radix", "framer-motion", "react", "animation"],
    body: `Build a {{component_type}} using Radix UI + Framer Motion. Requirements:
- Tailwind CSS styling with dark mode support
- Framer Motion AnimatePresence for mount/unmount transitions
- Variants: {{variants}}
- Full keyboard accessibility (Radix handles this by default)
- TypeScript props interface with JSDoc comments
- CVA (class-variance-authority) for variant management
- Export both the component and its variant types`,
    variables: ["component_type", "variants"],
    model: "claude-3.5-sonnet",
    usageCount: 8,
    versions: [],
    createdAt: now - 86400000 * 30,
    updatedAt: now - 86400000 * 21,
  },
  {
    id: id("p", 4),
    title: "SaaS Full Launch Pack",
    description: "Scaffolds a complete SaaS including landing page, dashboard, auth, and billing stub.",
    category: "SaaS Prompts",
    tags: ["saas", "boilerplate", "landing", "dashboard"],
    body: `Build {{product_name}} — a SaaS for {{audience}}.

Pages to generate:
1. Landing page: hero, features grid, pricing table ({{pricing_tiers}} tiers), testimonials, FAQ, footer
2. Auth: sign up, sign in, forgot password, email verification
3. Dashboard: sidebar nav, overview with KPI cards, and a main data view
4. Settings: profile, notifications, billing (Stripe stub), danger zone

Design direction: {{design_style}}
Brand primary color: {{brand_color}}
Tech stack: Next.js App Router, Tailwind, shadcn/ui, Drizzle, NextAuth

Include a component file structure and routing plan before generating code.`,
    variables: ["product_name", "audience", "pricing_tiers", "design_style", "brand_color"],
    favorite: true,
    usageCount: 42,
    versions: [],
    createdAt: now - 86400000 * 5,
    updatedAt: now - 3600000 * 12,
  },
  {
    id: id("p", 5),
    title: "Bug Hunter — Stack Trace Forensics",
    description: "Analyzes a stack trace and code snippet, then proposes 3 ranked root-cause hypotheses.",
    category: "Debugging",
    tags: ["debug", "errors", "typescript", "analysis"],
    body: `You are a debugging expert. Analyze the following and identify the root cause.

Stack trace:
\`\`\`
{{stack_trace}}
\`\`\`

Relevant code:
\`\`\`{{language}}
{{code}}
\`\`\`

Environment: {{environment}}

Produce exactly 3 hypotheses, ranked by likelihood:
1. **Hypothesis** — one-sentence explanation
   - Evidence supporting this
   - How to verify: specific command or log to check
   - Fix if confirmed: code snippet or config change

End with a "Most likely" summary and the single first debugging step to take.`,
    variables: ["stack_trace", "language", "code", "environment"],
    usageCount: 19,
    versions: [],
    createdAt: now - 86400000 * 10,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: id("p", 6),
    title: "API Contract Designer",
    description: "Designs RESTful or tRPC API contracts with Zod schemas, error envelopes, and OpenAPI export.",
    category: "Architecture",
    tags: ["api", "zod", "openapi", "rest"],
    body: `Design a {{style}} API for the {{domain}} domain.

Resources to cover: {{resources}}

For each resource provide:
- Full CRUD endpoint list (method, path, description)
- Request body Zod schema
- Response envelope: \`{ data, meta?, error? }\`
- Error codes and their meanings
- Pagination strategy (cursor-based preferred)
- Idempotency key requirement (yes/no + rationale)

Output: (1) OpenAPI 3.1 YAML, (2) Zod schema file, (3) TypeScript client types.`,
    variables: ["style", "domain", "resources"],
    usageCount: 6,
    versions: [],
    createdAt: now - 86400000 * 40,
    updatedAt: now - 86400000 * 12,
  },
  {
    id: id("p", 7),
    title: "PR Description Generator",
    description: "Writes a structured, informative pull request description from a git diff and ticket context.",
    category: "Productivity",
    tags: ["git", "pr", "writing", "productivity"],
    body: `Write a clear pull request description for the following change.

Ticket: {{ticket_id}} — {{ticket_title}}
Type of change: {{change_type}}

Git diff summary:
{{diff_summary}}

Generate a PR description with these sections:
## What
One-paragraph plain-English summary of what changed and why.

## How
Bullet points of the key technical decisions made.

## Testing
How was this tested? Include commands to reproduce.

## Screenshots
[placeholder if UI changed]

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] No breaking changes (or migration notes added)`,
    variables: ["ticket_id", "ticket_title", "change_type", "diff_summary"],
    usageCount: 31,
    versions: [],
    createdAt: now - 86400000 * 18,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: id("p", 8),
    title: "Technical Interview Prep",
    description: "Generates a mock technical interview session with tailored questions, hints, and ideal answers.",
    category: "Career",
    tags: ["interview", "career", "practice", "preparation"],
    body: `Act as a senior {{role}} interviewer at a {{company_type}} company. Conduct a mock technical interview session for me.

My background: {{candidate_background}}
Target role level: {{level}}
Focus areas: {{focus_areas}}

Session format:
1. Start with one warm-up question to ease in
2. Ask 3–4 progressively harder technical questions in the focus areas
3. For each question: wait for my answer, then give structured feedback: what was good, what was missing, the ideal answer, and a follow-up question if my answer was strong
4. End with one system design or architecture question appropriate for {{level}}
5. Close with 2 questions I should ask the interviewer

Begin the session now with the warm-up question.`,
    variables: ["role", "company_type", "candidate_background", "level", "focus_areas"],
    favorite: true,
    usageCount: 53,
    versions: [],
    createdAt: now - 86400000 * 8,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: id("p", 9),
    title: "Refactor to Clean Architecture",
    description: "Breaks a monolithic file into domain, application, and infrastructure layers.",
    category: "Refactoring",
    tags: ["refactoring", "clean-architecture", "typescript", "backend"],
    body: `Refactor the following {{language}} code into Clean Architecture layers.

Original code:
\`\`\`{{language}}
{{original_code}}
\`\`\`

Target structure:
- **Domain**: entities, value objects, repository interfaces (no framework dependencies)
- **Application**: use cases, DTOs, service interfaces
- **Infrastructure**: DB adapters, external API clients, concrete repository implementations
- **Presentation**: controllers/routes, input validation

Rules:
1. Domain must have zero external imports
2. Each use case is a single class with an \`execute()\` method
3. Use dependency injection — no singletons
4. Maintain identical external behavior
5. Add TypeScript interfaces for every dependency boundary

Output each file separately with its full path.`,
    variables: ["language", "original_code"],
    usageCount: 11,
    versions: [],
    createdAt: now - 86400000 * 25,
    updatedAt: now - 86400000 * 9,
  },
  {
    id: id("p", 10),
    title: "Landing Page Copy Writer",
    description: "Writes conversion-optimized landing page copy from a product brief.",
    category: "Marketing",
    tags: ["copy", "marketing", "saas", "landing-page"],
    body: `Write conversion-optimized landing page copy for {{product_name}}.

Product: {{product_description}}
Target audience: {{target_audience}}
Primary pain point solved: {{pain_point}}
Key differentiator vs competitors: {{differentiator}}
Tone: {{tone}}

Generate copy for:
1. **Hero**: H1 headline (max 8 words), sub-headline (max 20 words), CTA button text
2. **Social proof bar**: 3 company name placeholders + metric
3. **Features section**: 3 features, each with icon suggestion, title, and 2-sentence description
4. **How it works**: 3 numbered steps
5. **Testimonials**: 2 realistic quotes with name/role/company
6. **Pricing section**: 3 tier names + 1-line description each
7. **Final CTA**: Headline + sub-copy + button

Apply copywriting principles: clarity over cleverness, benefits over features, specific over vague.`,
    variables: ["product_name", "product_description", "target_audience", "pain_point", "differentiator", "tone"],
    usageCount: 16,
    versions: [],
    createdAt: now - 86400000 * 12,
    updatedAt: now - 86400000 * 3,
  },

  // ── NEW PROMPTS ──────────────────────────────────────────────────────────

  {
    id: id("p", 11),
    title: "System Design Deep Dive",
    description: "Walks through a full system design for a given product, covering scalability, data flow, and trade-offs.",
    category: "Architecture",
    tags: ["system-design", "scalability", "architecture", "interview"],
    body: `You are a principal engineer. Walk me through a complete system design for {{system_name}}.

Scale requirements: {{scale}} (users / requests per second / data volume)
Key constraints: {{constraints}}

Cover these areas in order:
1. **Requirements clarification** — functional and non-functional requirements
2. **High-level design** — ASCII architecture diagram with all major components
3. **Data model** — database choice(s) with rationale, key tables/collections
4. **API design** — top 5 critical endpoints
5. **Scalability** — where bottlenecks will appear and how to address them
6. **Caching strategy** — what to cache, eviction policy, invalidation
7. **Failure modes** — top 3 failure scenarios and mitigation
8. **Trade-offs made** — what was sacrificed and why

Be opinionated. Recommend specific technologies with brief rationale.`,
    variables: ["system_name", "scale", "constraints"],
    model: "o3",
    favorite: true,
    usageCount: 34,
    versions: [],
    createdAt: now - 86400000 * 6,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: id("p", 12),
    title: "Code Review — Deep Analysis",
    description: "Performs a thorough security, performance, and maintainability review of a code block.",
    category: "Debugging",
    tags: ["code-review", "security", "performance", "typescript"],
    body: `Perform a senior-level code review on the following {{language}} code.

\`\`\`{{language}}
{{code}}
\`\`\`

Context: {{context}}

Review across these dimensions:
**Security** — injection vulnerabilities, insecure defaults, exposed secrets, auth bypass risks
**Performance** — N+1 queries, blocking calls, memory leaks, unnecessary re-renders
**Correctness** — edge cases, off-by-one errors, race conditions, null/undefined handling
**Maintainability** — naming, complexity, DRY violations, missing abstractions
**Testing gaps** — which scenarios have no coverage

Format output as:
🔴 BLOCKER — [issue]: [explanation] → [fix]
🟡 WARNING — [issue]: [explanation] → [suggestion]
🟢 SUGGESTION — [issue]: [explanation] → [improvement]

End with an overall health score (1–10) and one sentence summary.`,
    variables: ["language", "code", "context"],
    model: "claude-3.5-sonnet",
    usageCount: 22,
    versions: [],
    createdAt: now - 86400000 * 7,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: id("p", 13),
    title: "React Hook Extractor",
    description: "Identifies and extracts all reusable logic from a React component into clean custom hooks.",
    category: "Refactoring",
    tags: ["react", "hooks", "refactoring", "typescript"],
    body: `Analyze the following React component and extract all reusable logic into custom hooks.

\`\`\`tsx
{{component_code}}
\`\`\`

For each hook you extract:
1. Name it with the \`use\` prefix and a descriptive name
2. Define a clean TypeScript interface for its return value
3. Add JSDoc explaining what it does and when to use it
4. Ensure zero coupling to the parent component's specific concerns
5. Handle loading, error, and success states explicitly

After extracting all hooks, show the refactored component using them.
The component should read as a clean orchestration layer — no logic inline.`,
    variables: ["component_code"],
    model: "gpt-5",
    usageCount: 9,
    versions: [],
    createdAt: now - 86400000 * 11,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: id("p", 14),
    title: "TypeScript Type Wizard",
    description: "Converts raw data shapes, JSON payloads, or descriptions into precise TypeScript types.",
    category: "Backend",
    tags: ["typescript", "types", "zod", "inference"],
    body: `Convert the following into precise TypeScript types and Zod schemas.

Input (JSON / description / existing code):
\`\`\`
{{input}}
\`\`\`

Requirements:
1. Infer the most accurate TypeScript types (prefer \`string\` literals over \`string\` where possible)
2. Handle optional vs required fields correctly
3. Create a Zod schema that mirrors the types for runtime validation
4. Add a \`z.infer<typeof Schema>\` type alias for each schema
5. If the input has nested objects, create separate named schemas and compose them
6. Add JSDoc comments explaining non-obvious fields

Output in this order: (1) TypeScript interfaces/types, (2) Zod schemas, (3) Example usage.`,
    variables: ["input"],
    model: "gpt-5",
    usageCount: 18,
    versions: [],
    createdAt: now - 86400000 * 9,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: id("p", 15),
    title: "Microservice Decomposition",
    description: "Identifies bounded contexts in a monolith and proposes a microservice split strategy.",
    category: "Architecture",
    tags: ["microservices", "ddd", "architecture", "bounded-context"],
    body: `Analyze the following monolith and propose a microservice decomposition strategy.

Current codebase structure / domain description:
{{monolith_description}}

Team size: {{team_size}}
Current pain points: {{pain_points}}

Produce:
1. **Bounded Context Map** — identify 3–6 natural domain boundaries with brief rationale
2. **Service Registry** — for each proposed service: name, responsibility, owned data, exposed APIs
3. **Communication patterns** — which services call each other synchronously vs asynchronously
4. **Migration sequence** — which service to extract first (strangler fig pattern), and why
5. **Data isolation plan** — how to split the shared database per service
6. **Risk assessment** — top 3 risks of this decomposition

Only propose what the given team size can realistically maintain.`,
    variables: ["monolith_description", "team_size", "pain_points"],
    model: "o3",
    usageCount: 5,
    versions: [],
    createdAt: now - 86400000 * 15,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: id("p", 16),
    title: "Test Suite Generator",
    description: "Writes comprehensive Vitest unit and integration tests for any TypeScript function or module.",
    category: "Testing",
    tags: ["vitest", "testing", "typescript", "tdd"],
    body: `Write a comprehensive Vitest test suite for the following {{language}} code.

\`\`\`{{language}}
{{code_to_test}}
\`\`\`

Test requirements:
1. **Happy path** — all documented success scenarios
2. **Edge cases** — empty/null inputs, boundary values, max/min, special characters
3. **Error paths** — every thrown error, network failures, invalid states
4. **Async behavior** — proper \`await\`, rejection handling, timeout scenarios
5. Mock all external dependencies using \`vi.mock()\`
6. Use \`describe\` blocks to group related tests
7. Follow AAA pattern: // Arrange / // Act / // Assert comments
8. Add a brief comment on any non-obvious test case

Target: 100% branch coverage. Show the coverage report import at the top.`,
    variables: ["language", "code_to_test"],
    model: "claude-3.5-sonnet",
    usageCount: 13,
    versions: [],
    createdAt: now - 86400000 * 13,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: id("p", 17),
    title: "Performance Audit & Fix",
    description: "Identifies performance bottlenecks in frontend code and outputs optimized versions with metrics.",
    category: "Debugging",
    tags: ["performance", "react", "optimization", "profiling"],
    body: `Audit the following {{framework}} code for performance issues and provide optimizations.

\`\`\`{{language}}
{{code}}
\`\`\`

Current symptoms: {{symptoms}}

Analyze for:
- Unnecessary re-renders (React: missing memo, unstable references)
- Expensive computations not memoized
- Waterfall data fetching that could be parallelized
- Bundle size issues (large imports, no tree-shaking)
- DOM manipulation anti-patterns
- Memory leaks (unremoved listeners, uncancelled effects)

For each issue found:
1. Describe the problem and its impact
2. Provide the optimized code
3. Estimate the improvement (e.g., "~40% fewer renders")

End with a prioritized fix list (biggest win first).`,
    variables: ["framework", "language", "code", "symptoms"],
    model: "claude-3.5-sonnet",
    usageCount: 11,
    versions: [],
    createdAt: now - 86400000 * 8,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: id("p", 18),
    title: "Commit Message Standardizer",
    description: "Converts messy git history or diff summaries into Conventional Commits format.",
    category: "Productivity",
    tags: ["git", "commits", "conventional-commits", "automation"],
    body: `Convert the following raw commit messages or diff summary into Conventional Commits format.

Input:
{{raw_commits}}

Rules:
- Format: \`type(scope): description\`
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Scope: the affected module/component (lowercase, kebab-case)
- Description: imperative mood, lowercase, no period, max 72 chars
- If a commit has breaking changes, add \`!\` after type/scope and a \`BREAKING CHANGE:\` footer
- Group related small commits into one meaningful commit

Output:
1. The cleaned commit list
2. A summary of changes suitable for a CHANGELOG entry
3. Flag any commits that seem to be missing context`,
    variables: ["raw_commits"],
    model: "gpt-5-mini",
    usageCount: 24,
    versions: [],
    createdAt: now - 86400000 * 4,
    updatedAt: now - 3600000 * 6,
  },
  {
    id: id("p", 19),
    title: "Documentation Generator",
    description: "Generates JSDoc, README sections, and inline comments for undocumented code.",
    category: "Productivity",
    tags: ["docs", "jsdoc", "readme", "typescript"],
    body: `Generate comprehensive documentation for the following {{language}} code.

\`\`\`{{language}}
{{code}}
\`\`\`

Produce:
1. **JSDoc / TSDoc comments** for every exported function, class, and type:
   - @param with type and description for each parameter
   - @returns with type and description
   - @throws for any exceptions
   - @example with a realistic usage example
2. **README section** (markdown) describing what this module does, when to use it, and a quick-start example
3. **Inline comments** for any non-obvious logic (no comment = obvious, yes comment = needs explanation)

Style: technical but readable. Assume the reader is a mid-level developer unfamiliar with this codebase.`,
    variables: ["language", "code"],
    model: "gpt-5",
    usageCount: 8,
    versions: [],
    createdAt: now - 86400000 * 17,
    updatedAt: now - 86400000 * 5,
  },
  {
    id: id("p", 20),
    title: "Feature Flag Strategy",
    description: "Designs a complete feature flag system for gradual rollouts, A/B testing, and kill switches.",
    category: "Architecture",
    tags: ["feature-flags", "rollout", "ab-testing", "devops"],
    body: `Design a feature flag system for {{product_name}}.

Tech stack: {{tech_stack}}
Features to gate: {{features_list}}
Target rollout strategy: {{rollout_strategy}} (e.g., percentage-based, user-segment, geographic)

Provide:
1. **Flag schema** — data model for storing flags (name, type, rules, variants)
2. **Evaluation logic** — how flags are resolved per request/user
3. **Server integration** — middleware or service layer code
4. **Client integration** — React hook \`useFlag(flagName)\` with loading state
5. **Admin UI spec** — what controls should be in a flag management dashboard
6. **Rollback procedure** — how to instantly kill a flag without a deployment
7. **Observability** — what metrics to track per flag

Keep it simple enough to self-host, no third-party SDK required.`,
    variables: ["product_name", "tech_stack", "features_list", "rollout_strategy"],
    model: "o3",
    usageCount: 7,
    versions: [],
    createdAt: now - 86400000 * 20,
    updatedAt: now - 86400000 * 6,
  },
  {
    id: id("p", 21),
    title: "CV / Resume Optimizer",
    description: "Rewrites a CV section or full resume to maximize ATS score and recruiter impact.",
    category: "Career",
    tags: ["cv", "resume", "career", "ats", "job-search"],
    body: `Optimize the following CV content for the role of {{target_role}} at a {{company_type}} company.

Current CV content:
{{cv_content}}

Target job description keywords: {{jd_keywords}}

Optimization goals:
1. **ATS compatibility** — ensure keywords from the JD appear naturally
2. **Impact metrics** — convert every responsibility into a quantified achievement (X% improvement, $Y saved, Z users served)
3. **Clarity** — rewrite in active voice, strong action verbs (built, designed, reduced, led)
4. **Relevance** — prioritize bullets that match {{target_role}} requirements, trim irrelevant ones
5. **Length** — keep to {{target_pages}} page(s)

Output:
- Rewritten content with tracked changes highlighted
- ATS keyword coverage analysis
- 3 additional bullets I should consider adding based on typical {{target_role}} expectations`,
    variables: ["target_role", "company_type", "cv_content", "jd_keywords", "target_pages"],
    model: "gpt-5",
    favorite: true,
    usageCount: 38,
    versions: [],
    createdAt: now - 86400000 * 3,
    updatedAt: now - 3600000 * 4,
  },
  {
    id: id("p", 22),
    title: "Thinking — Deep Problem Solver",
    description: "Uses extended reasoning to tackle ambiguous, multi-step technical problems with full chain-of-thought.",
    category: "Reasoning",
    tags: ["thinking", "reasoning", "problem-solving", "o3"],
    body: `<thinking>
Work through this problem step by step before giving your final answer. Consider multiple approaches, identify assumptions, check for edge cases, and explain your reasoning at each step.
</thinking>

Problem statement:
{{problem}}

Context and constraints:
{{context}}

Before answering, explicitly:
1. Restate the problem in your own words to confirm understanding
2. Identify all ambiguities and state your assumptions
3. Enumerate at least 3 different approaches
4. Analyze trade-offs of each approach
5. Select the best approach with full justification
6. Work through the solution step by step
7. Verify the solution handles all stated constraints
8. Identify potential failure modes

Then provide your final answer clearly separated from the reasoning.`,
    variables: ["problem", "context"],
    model: "o3",
    favorite: true,
    usageCount: 29,
    versions: [],
    createdAt: now - 86400000 * 2,
    updatedAt: now - 3600000 * 1,
  },
  {
    id: id("p", 23),
    title: "Docker & DevOps Setup",
    description: "Generates production Docker configs, compose files, and CI/CD pipelines for any stack.",
    category: "DevOps",
    tags: ["docker", "devops", "ci-cd", "deployment"],
    body: `Generate a complete Docker and CI/CD setup for {{project_name}}.

Stack: {{stack}}
Deployment target: {{deployment_target}} (e.g., Fly.io, AWS ECS, Railway, VPS)
Services needed: {{services}} (e.g., app, postgres, redis, worker)

Produce:
1. **Dockerfile** — multi-stage build optimized for size and cache efficiency
2. **docker-compose.yml** — local development with hot reload, named volumes, health checks
3. **docker-compose.prod.yml** — production overrides
4. **.dockerignore** — exclude dev artifacts
5. **GitHub Actions CI** — lint, test, build, push to registry on main
6. **Deploy workflow** — auto-deploy on successful CI
7. **Environment variable template** — all required env vars with descriptions

Include health check endpoints and graceful shutdown handling in the app configuration.`,
    variables: ["project_name", "stack", "deployment_target", "services"],
    model: "gpt-5",
    usageCount: 20,
    versions: [],
    createdAt: now - 86400000 * 16,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: id("p", 24),
    title: "Soft Skills Interview Coach",
    description: "Prepares STAR-format answers for behavioral interview questions tailored to your background.",
    category: "Career",
    tags: ["interview", "behavioral", "star", "soft-skills"],
    body: `Coach me on answering this behavioral interview question using the STAR method.

Question: {{interview_question}}

My background: {{background}}
Target role: {{target_role}}

For this question:
1. **Identify the competency being tested** (e.g., leadership, conflict resolution, adaptability)
2. **Suggest 2 story angles** from my background that would work well
3. **Draft a STAR answer** for the best story angle:
   - Situation (2–3 sentences, enough context)
   - Task (what was my specific responsibility)
   - Action (3–4 specific things I did, using "I" not "we")
   - Result (quantified outcome + what I learned)
4. **Warn me** about common pitfalls for this question type
5. **Suggest 1 follow-up question** the interviewer might ask and how to answer it

Total answer should be 90–120 seconds when spoken.`,
    variables: ["interview_question", "background", "target_role"],
    model: "gpt-5",
    usageCount: 41,
    versions: [],
    createdAt: now - 86400000 * 5,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: id("p", 25),
    title: "Error Message Designer",
    description: "Rewrites cryptic technical errors into clear, actionable user-facing messages.",
    category: "UI/UX",
    tags: ["ux-writing", "error-handling", "copy", "accessibility"],
    body: `Rewrite the following technical errors into clear, user-friendly messages for {{product_name}}.

Errors to rewrite:
{{error_list}}

User persona: {{user_persona}} (e.g., non-technical end user, developer, admin)

For each error, produce:
1. **User-facing title** — max 5 words, no tech jargon
2. **User-facing description** — 1–2 sentences explaining what happened and what to do next
3. **Recovery action** — a specific CTA button label or next step
4. **Technical log message** — the internal version for developers (keep original technical detail)
5. **Error code** — short slug (e.g., AUTH_TOKEN_EXPIRED)

Principles: Be specific not vague. Be helpful not apologetic. Never say "something went wrong".`,
    variables: ["product_name", "error_list", "user_persona"],
    model: "gpt-5",
    usageCount: 12,
    versions: [],
    createdAt: now - 86400000 * 14,
    updatedAt: now - 86400000 * 3,
  },
];
