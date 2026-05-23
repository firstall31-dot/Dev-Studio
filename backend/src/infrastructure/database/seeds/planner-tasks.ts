/**
 * Planner task seeds.
 * Dates are generated relative to today so tasks always appear
 * in a sensible window around the current date.
 */

function dateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

export interface PlannerTaskSeed {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  category: "work" | "learning" | "activities" | "general";
  estimatedMinutes: number;
  tags: string[];
  date: string;
  order: number;
}

export const seedPlannerTasks: PlannerTaskSeed[] = [
  // ── Today ──────────────────────────────────────────────────────────────────
  {
    title: "Morning review & daily planning",
    description: "Set 3 top priorities, review messages, and block time on calendar.",
    priority: "high",
    status: "done",
    category: "activities",
    estimatedMinutes: 15,
    tags: ["routine", "planning"],
    date: dateStr(0),
    order: 0,
  },
  {
    title: "Code review — open PRs",
    description: "Review 3 open pull requests and leave detailed comments.",
    priority: "high",
    status: "in-progress",
    category: "work",
    estimatedMinutes: 60,
    tags: ["code-review", "team"],
    date: dateStr(0),
    order: 1,
  },
  {
    title: "Write unit tests for auth module",
    description: "Aim for 80%+ branch coverage on the login/register flow.",
    priority: "high",
    status: "todo",
    category: "work",
    estimatedMinutes: 90,
    tags: ["testing", "auth", "vitest"],
    date: dateStr(0),
    order: 2,
  },
  {
    title: "Read: OWASP Top 10 — Broken Auth",
    description: "Study the latest broken authentication section and take notes.",
    priority: "medium",
    status: "todo",
    category: "learning",
    estimatedMinutes: 45,
    tags: ["security", "owasp"],
    date: dateStr(0),
    order: 3,
  },
  {
    title: "Exercise — 30 min walk",
    description: "Take a midday walk to reset focus.",
    priority: "medium",
    status: "done",
    category: "activities",
    estimatedMinutes: 30,
    tags: ["health", "routine"],
    date: dateStr(0),
    order: 4,
  },
  {
    title: "End-of-day wrap-up",
    description: "Log wins, blockers, and set tomorrow's top 3 priorities.",
    priority: "medium",
    status: "todo",
    category: "activities",
    estimatedMinutes: 15,
    tags: ["routine", "reflection"],
    date: dateStr(0),
    order: 5,
  },

  // ── Yesterday (done tasks) ─────────────────────────────────────────────────
  {
    title: "Set up Docker Compose environment",
    description: "Containerise dev stack: app, db, redis.",
    priority: "high",
    status: "done",
    category: "work",
    estimatedMinutes: 90,
    tags: ["docker", "devops"],
    date: dateStr(-1),
    order: 0,
  },
  {
    title: "LeetCode: 2 medium problems",
    description: "Sliding window and binary search patterns.",
    priority: "medium",
    status: "done",
    category: "learning",
    estimatedMinutes: 60,
    tags: ["algorithms", "leetcode"],
    date: dateStr(-1),
    order: 1,
  },
  {
    title: "Organise Obsidian notes",
    description: "Consolidate week's learnings, add tags and links.",
    priority: "low",
    status: "done",
    category: "learning",
    estimatedMinutes: 30,
    tags: ["notes", "knowledge-management"],
    date: dateStr(-1),
    order: 2,
  },

  // ── Tomorrow ───────────────────────────────────────────────────────────────
  {
    title: "Implement Redis caching layer",
    description: "Cache hot API responses with TTL policies. Use ioredis.",
    priority: "high",
    status: "todo",
    category: "work",
    estimatedMinutes: 90,
    tags: ["redis", "performance", "backend"],
    date: dateStr(1),
    order: 0,
  },
  {
    title: "Study Kubernetes — pods & services",
    description: "Watch KCNA prep video and take structured notes.",
    priority: "medium",
    status: "todo",
    category: "learning",
    estimatedMinutes: 60,
    tags: ["kubernetes", "devops"],
    date: dateStr(1),
    order: 1,
  },
  {
    title: "Update freelance portfolio",
    description: "Add last 2 completed projects with screenshots and descriptions.",
    priority: "medium",
    status: "todo",
    category: "work",
    estimatedMinutes: 45,
    tags: ["portfolio", "freelance"],
    date: dateStr(1),
    order: 2,
  },
  {
    title: "Strength training session",
    description: "Upper body day: bench, rows, shoulder press.",
    priority: "medium",
    status: "todo",
    category: "activities",
    estimatedMinutes: 60,
    tags: ["health", "gym"],
    date: dateStr(1),
    order: 3,
  },

  // ── Day +2 ─────────────────────────────────────────────────────────────────
  {
    title: "Optimise slow PostgreSQL queries",
    description: "Run EXPLAIN ANALYZE on top 5 endpoints and add missing indexes.",
    priority: "high",
    status: "todo",
    category: "work",
    estimatedMinutes: 90,
    tags: ["postgresql", "performance", "database"],
    date: dateStr(2),
    order: 0,
  },
  {
    title: "Read Clean Code — chapters 3 & 4",
    description: "Functions and comments chapters. Write 5 takeaway notes.",
    priority: "medium",
    status: "todo",
    category: "learning",
    estimatedMinutes: 60,
    tags: ["clean-code", "books", "best-practices"],
    date: dateStr(2),
    order: 1,
  },
  {
    title: "Send follow-up to GitHub offer",
    description: "Email recruiter with salary counter-offer and equity clarification.",
    priority: "high",
    status: "todo",
    category: "general",
    estimatedMinutes: 20,
    tags: ["job-search", "negotiation"],
    date: dateStr(2),
    order: 2,
  },

  // ── Day +3 ─────────────────────────────────────────────────────────────────
  {
    title: "Harden Nginx server config",
    description: "TLS 1.3 only, security headers (CSP, HSTS), rate limiting.",
    priority: "high",
    status: "todo",
    category: "work",
    estimatedMinutes: 75,
    tags: ["nginx", "security", "devops"],
    date: dateStr(3),
    order: 0,
  },
  {
    title: "Practice: Ansible playbook",
    description: "Write a playbook to automate Nginx install and config on Ubuntu.",
    priority: "medium",
    status: "todo",
    category: "learning",
    estimatedMinutes: 90,
    tags: ["ansible", "devops", "automation"],
    date: dateStr(3),
    order: 1,
  },
  {
    title: "Morning run — 5K",
    description: "Easy pace. Focus on breathing.",
    priority: "medium",
    status: "todo",
    category: "activities",
    estimatedMinutes: 35,
    tags: ["health", "running"],
    date: dateStr(3),
    order: 2,
  },

  // ── Day +4 ─────────────────────────────────────────────────────────────────
  {
    title: "Build web scraper with Playwright",
    description: "Scrape job listings from 3 sites, output structured JSON.",
    priority: "medium",
    status: "todo",
    category: "work",
    estimatedMinutes: 120,
    tags: ["playwright", "scraping", "node"],
    date: dateStr(4),
    order: 0,
  },
  {
    title: "Study SQL indexing strategies",
    description: "B-tree, GiST, partial indexes, and INCLUDE columns deep dive.",
    priority: "high",
    status: "todo",
    category: "learning",
    estimatedMinutes: 60,
    tags: ["sql", "indexing", "postgresql"],
    date: dateStr(4),
    order: 1,
  },

  // ── Day +5 ─────────────────────────────────────────────────────────────────
  {
    title: "Refactoring: remove service layer duplication",
    description: "Extract shared logic into base service class. Apply DRY.",
    priority: "medium",
    status: "todo",
    category: "work",
    estimatedMinutes: 90,
    tags: ["refactoring", "clean-code", "typescript"],
    date: dateStr(5),
    order: 0,
  },
  {
    title: "System design: URL shortener",
    description: "Watch end-to-end video and sketch architecture diagram.",
    priority: "medium",
    status: "todo",
    category: "learning",
    estimatedMinutes: 60,
    tags: ["system-design", "interview-prep"],
    date: dateStr(5),
    order: 1,
  },
  {
    title: "Weekly review",
    description: "Review completed tasks, update job tracker, plan next week's top 5.",
    priority: "high",
    status: "todo",
    category: "general",
    estimatedMinutes: 30,
    tags: ["planning", "review", "productivity"],
    date: dateStr(5),
    order: 2,
  },

  // ── Day +7 ─────────────────────────────────────────────────────────────────
  {
    title: "Lighthouse performance audit",
    description: "Run audit on all main pages. Aim for 95+ score.",
    priority: "high",
    status: "todo",
    category: "work",
    estimatedMinutes: 60,
    tags: ["performance", "lighthouse", "frontend"],
    date: dateStr(7),
    order: 0,
  },
  {
    title: "Study Next.js App Router",
    description: "Server components, layouts, and route handlers documentation.",
    priority: "high",
    status: "todo",
    category: "learning",
    estimatedMinutes: 75,
    tags: ["next.js", "react", "server-components"],
    date: dateStr(7),
    order: 1,
  },
  {
    title: "Yoga / mobility session",
    description: "Full body flexibility routine. 30 minutes.",
    priority: "low",
    status: "todo",
    category: "activities",
    estimatedMinutes: 30,
    tags: ["health", "yoga", "recovery"],
    date: dateStr(7),
    order: 2,
  },

  // ── Day +10 ────────────────────────────────────────────────────────────────
  {
    title: "Configure GitHub Actions CI pipeline",
    description: "Build, lint, test, and Docker push stages. Trigger on PR.",
    priority: "high",
    status: "todo",
    category: "work",
    estimatedMinutes: 120,
    tags: ["github-actions", "ci/cd", "docker"],
    date: dateStr(10),
    order: 0,
  },
  {
    title: "Read: Database Internals — Chapter 5",
    description: "Storage engines, WAL, and MVCC concepts.",
    priority: "medium",
    status: "todo",
    category: "learning",
    estimatedMinutes: 60,
    tags: ["databases", "books", "internals"],
    date: dateStr(10),
    order: 1,
  },
];
