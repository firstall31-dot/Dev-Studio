
import { plannerTasks } from "../../domain/schema.js";
import { eq, and, gte, lte, isNull } from "drizzle-orm";
import { getOpenAI } from "../../infrastructure/lib/openai.js";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";
import { PlannerMapper } from "../../domain/mappers/planner.mapper.js";

export class PlannerService {
  static async getAll(userId: string, from?: string, to?: string) {
    let rows;
    if (from && to) {
      rows = await uow.plannerTasks.findAll(
        and(
          eq(plannerTasks.userId, userId),
          gte(plannerTasks.date, from),
          lte(plannerTasks.date, to)
        )
      );
    } else {
      rows = await uow.plannerTasks.findAll(eq(plannerTasks.userId, userId));
    }
    return rows.map(PlannerMapper.toDomain);
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw) as Record<string, unknown>;

    // Validate required fields
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      throw new Error("title is required");
    }
    if (
      !data.date ||
      typeof data.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date as string)
    ) {
      throw new Error("date is required (YYYY-MM-DD)");
    }

    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.plannerTasks.findAll(
          and(eq(plannerTasks.id, safeId), eq(plannerTasks.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.plannerTasks.update(safeId!, data);
      return PlannerMapper.toDomain(r);
    } else {
      const r = await uow.plannerTasks.create({
        ...data,
        userId,
        ...(safeId ? { id: safeId } : {}),
      } as any);
      return PlannerMapper.toDomain(r);
    }
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) return true;
    const task = await uow.plannerTasks.findById(id);
    if (task && task.userId === userId) {
      await uow.plannerTasks.delete(id);
    }
    return true;
  }

  static async suggest(date: string, tasks: any[]) {
    const taskList =
      (tasks || [])
        .map(
          (t: any) =>
            `- [${t.status}] ${t.title} (${t.priority} priority, ${t.category})${t.description ? `: ${t.description}` : ""}`,
        )
        .join("\n") || "No tasks yet for this day.";

    const systemPrompt = `You are a personal productivity coach for a software developer. Analyze their task list and provide helpful, practical suggestions to improve their schedule and productivity. Be concise and actionable.

Return ONLY a valid JSON object with this exact structure:
{
  "suggestions": ["<actionable suggestion>", "<actionable suggestion>", "<actionable suggestion>"],
  "schedule": "<A suggested daily schedule in plain text, e.g. 09:00 Deep work - [task]. 11:00 Meetings. etc.>"
}`;

    const userPrompt = `Date: ${date}\n\nCurrent tasks:\n${taskList}\n\nPlease analyze and suggest improvements.`;

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini", // fallback to mini for safety, "gpt-5-mini" from previous codebase was a typo/unsupported model in real life usually unless standard
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });
    const content = response.choices[0]?.message?.content ?? "{}";
    return JSON.parse(content);
  }

  static async seed(userId: string, month?: string, clear?: boolean) {
    const now = new Date();
    const ym =
      month ??
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const [yr, mo] = ym.split("-").map(Number);

    const daysInMonth = new Date(yr, mo, 0).getDate();

    if (clear) {
      const from = `${ym}-01`;
      const to = `${ym}-${String(daysInMonth).padStart(2, "0")}`;
      await uow.plannerTasks.deleteMany(
        and(
          eq(plannerTasks.userId, userId),
          gte(plannerTasks.date, from),
          lte(plannerTasks.date, to)
        )
      );
    }

    type Seed = {
      title: string;
      description?: string;
      priority: string;
      category: string;
      estimatedMinutes?: number;
    };

    const W1_WORK: Seed[] = [
      {
        title: "Set up Docker environment",
        description: "Containerise dev stack with docker-compose",
        priority: "high",
        category: "work",
        estimatedMinutes: 90,
      },
      {
        title: "Configure CI/CD pipeline",
        description: "GitHub Actions: build, test, deploy stages",
        priority: "high",
        category: "work",
        estimatedMinutes: 120,
      },
      {
        title: "Review SSH key rotation policy",
        description: "Audit and rotate all access credentials",
        priority: "medium",
        category: "work",
        estimatedMinutes: 60,
      },
      {
        title: "Harden Nginx server config",
        description: "TLS 1.3, security headers, rate limiting",
        priority: "medium",
        category: "work",
        estimatedMinutes: 60,
      },
      {
        title: "Audit firewall rules & open ports",
        description: "UFW review and close unnecessary ports",
        priority: "high",
        category: "work",
        estimatedMinutes: 45,
      },
    ];
    const W1_LEARN: Seed[] = [
      {
        title: "Study Kubernetes architecture",
        description: "Pods, services, deployments overview",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 60,
      },
      {
        title: "Read OWASP Top 10 2024",
        description: "Focus on injection & broken auth sections",
        priority: "high",
        category: "learning",
        estimatedMinutes: 45,
      },
      {
        title: "Practice: write Ansible playbook",
        description: "Automate nginx install on Ubuntu",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 90,
      },
    ];

    const W2_WORK: Seed[] = [
      {
        title: "Optimize slow PostgreSQL queries",
        description: "Use EXPLAIN ANALYZE on top 5 heavy queries",
        priority: "high",
        category: "work",
        estimatedMinutes: 90,
      },
      {
        title: "Design normalised DB schema",
        description: "3NF for new feature — draw ER diagram first",
        priority: "high",
        category: "work",
        estimatedMinutes: 120,
      },
      {
        title: "Build web scraper with Playwright",
        description: "Scrape product listings, output to JSON",
        priority: "medium",
        category: "work",
        estimatedMinutes: 120,
      },
      {
        title: "Set up ETL data pipeline",
        description: "Extract → transform → load into PostgreSQL",
        priority: "medium",
        category: "work",
        estimatedMinutes: 90,
      },
      {
        title: "Add Redis caching layer",
        description: "Cache hot API responses, set TTL policies",
        priority: "medium",
        category: "work",
        estimatedMinutes: 60,
      },
    ];
    const W2_LEARN: Seed[] = [
      {
        title: "Study SQL indexing strategies",
        description: "B-tree vs GiST, partial indexes, INCLUDE columns",
        priority: "high",
        category: "learning",
        estimatedMinutes: 60,
      },
      {
        title: "Scrapy vs Playwright — deep dive",
        description: "When to use each, anti-bot evasion basics",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 45,
      },
      {
        title: "Read: database internals chapter",
        description: "Storage engines, WAL, MVCC concepts",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 60,
      },
    ];

    const W3_WORK: Seed[] = [
      {
        title: "Refactoring session: remove duplication",
        description: "Apply DRY principle across service layer",
        priority: "medium",
        category: "work",
        estimatedMinutes: 90,
      },
      {
        title: "LeetCode: 3 medium problems",
        description: "Focus: trees, sliding window, binary search",
        priority: "medium",
        category: "work",
        estimatedMinutes: 90,
      },
      {
        title: "Code review & PR feedback",
        description: "Review team PRs with thorough comments",
        priority: "high",
        category: "work",
        estimatedMinutes: 60,
      },
      {
        title: "Write unit tests for core module",
        description: "Aim for 80%+ coverage on business logic",
        priority: "high",
        category: "work",
        estimatedMinutes: 90,
      },
      {
        title: "Organise study materials & notes",
        description: "Consolidate Obsidian notes, add tags",
        priority: "low",
        category: "work",
        estimatedMinutes: 30,
      },
    ];
    const W3_LEARN: Seed[] = [
      {
        title: "Read Clean Code — 2 chapters",
        description: "Focus: functions & comments chapters",
        priority: "high",
        category: "learning",
        estimatedMinutes: 60,
      },
      {
        title: "Study SOLID principles with examples",
        description: "Write code examples for each principle",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 60,
      },
      {
        title: "Watch: system design interview video",
        description: "Design a URL shortener end-to-end",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 45,
      },
    ];

    const W4_WORK: Seed[] = [
      {
        title: "Build React component library",
        description: "Button, Input, Modal with Storybook docs",
        priority: "high",
        category: "work",
        estimatedMinutes: 120,
      },
      {
        title: "Implement global state with Zustand",
        description: "Auth, theme, notifications store slices",
        priority: "medium",
        category: "work",
        estimatedMinutes: 90,
      },
      {
        title: "CSS animations: micro-interactions",
        description: "Hover effects, skeleton loaders, transitions",
        priority: "medium",
        category: "work",
        estimatedMinutes: 60,
      },
      {
        title: "Performance audit with Lighthouse",
        description: "Aim for 95+ score on all metrics",
        priority: "high",
        category: "work",
        estimatedMinutes: 60,
      },
      {
        title: "Responsive layout: mobile-first pass",
        description: "Review all pages on 375px and 768px",
        priority: "medium",
        category: "work",
        estimatedMinutes: 60,
      },
    ];
    const W4_LEARN: Seed[] = [
      {
        title: "Study Next.js App Router docs",
        description: "Server components, layouts, route handlers",
        priority: "high",
        category: "learning",
        estimatedMinutes: 60,
      },
      {
        title: "Tailwind CSS v4 — new features",
        description: "CSS variables theming, logical properties",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 45,
      },
      {
        title: "Accessibility: WCAG 2.2 checklist",
        description: "Apply Level AA to current project",
        priority: "medium",
        category: "learning",
        estimatedMinutes: 60,
      },
    ];

    const ACTIVITIES: Seed[] = [
      {
        title: "Morning review & daily planning",
        description: "Set 3 priorities, check messages, review plan",
        priority: "high",
        category: "activities",
        estimatedMinutes: 15,
      },
      {
        title: "Exercise / movement break",
        description: "30 min walk, gym, or stretching session",
        priority: "medium",
        category: "activities",
        estimatedMinutes: 30,
      },
      {
        title: "End-of-day wrap-up & reflection",
        description: "Log wins, blockers, and tomorrow's top task",
        priority: "medium",
        category: "activities",
        estimatedMinutes: 15,
      },
    ];

    const rows: any[] = [];
    let order = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${ym}-${String(day).padStart(2, "0")}`;
      const d = new Date(`${dateStr}T00:00:00`);
      const dow = d.getDay(); // 0=Sun,1=Mon..6=Sat
      const isWeekend = dow === 0 || dow === 6;
      if (isWeekend) continue;

      const week = Math.min(Math.ceil(day / 7), 4);
      const workSeeds =
        week === 1
          ? W1_WORK
          : week === 2
            ? W2_WORK
            : week === 3
              ? W3_WORK
              : W4_WORK;
      const learnSeeds =
        week === 1
          ? W1_LEARN
          : week === 2
            ? W2_LEARN
            : week === 3
              ? W3_LEARN
              : W4_LEARN;

      const dowIdx = dow - 1;

      const actTask = ACTIVITIES[dowIdx % ACTIVITIES.length];
      const workTask = workSeeds[dowIdx % workSeeds.length];
      const learnTask = learnSeeds[dowIdx % learnSeeds.length];

      for (const seed of [actTask, workTask, learnTask]) {
        rows.push({
          userId,
          date: dateStr,
          title: seed.title,
          description: seed.description ?? null,
          priority: seed.priority,
          status: "todo",
          category: seed.category,
          order: order++,
          estimatedMinutes: seed.estimatedMinutes ?? null,
        });
      }
    }

    if (rows.length > 0) {
      await uow.plannerTasks.createMany(rows as any[]);
    }

    return { count: rows.length };
  }
}
