import { db, pool } from "./index.js";
import { count as countFn } from "drizzle-orm";
import { interviewQuestions } from "../../domain/schema/learning.js";
import { prompts, agents, components, snippets, templates } from "../../domain/schema/core.js";
import { connectors, socialDrafts, mailTemplates } from "../../domain/schema/integrations.js";
import { cvProfiles } from "../../domain/schema/cv.js";
import { savedJobs, freelanceOffers, myServices } from "../../domain/schema/career.js";
import { plannerTasks } from "../../domain/schema/planner.js";
import { conversations, messages } from "../../domain/schema/chat.js";

import { seedInterviewQuestions } from "./seeds/interview-questions.js";
import { defaultQuestions, suggestedQuestions } from "./seeds/behavioral.js";
import { seedPrompts } from "./seeds/prompts.js";
import { seedAgents } from "./seeds/agents.js";
import { seedComponents } from "./seeds/components.js";
import { seedSnippets } from "./seeds/snippets.js";
import { seedTemplates } from "./seeds/templates.js";
import { seedConnectors } from "./seeds/connectors.js";
import { seedSocialDrafts } from "./seeds/social-drafts.js";
import { seedMailTemplates } from "./seeds/mail-templates.js";
import { seedCvProfiles } from "./seeds/cv.js";
import { seedJobs } from "./seeds/jobs.js";
import { seedFreelanceOffers } from "./seeds/freelance-offers.js";
import { seedMyServices } from "./seeds/my-services.js";
import { seedPlannerTasks } from "./seeds/planner-tasks.js";
import { seedConversations, seedMessagesForConversations } from "./seeds/conversations.js";

async function seedGlobalInterviewQuestions() {
  const existing = await db
    .select({ id: interviewQuestions.id })
    .from(interviewQuestions)
    .limit(1);
  if (existing.length > 0) {
    console.log("Interview questions already seeded — skipping.");
    return;
  }

  const allTechQuestions = seedInterviewQuestions;
  const allBehavioralQuestions = [...defaultQuestions, ...suggestedQuestions];

  const rows = [
    ...allTechQuestions.map((q) => ({
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty ?? "mid",
      area: q.area === "testing" ? ("testing" as const) : (q.area as any),
      tags: q.tags ?? [],
      isGlobal: true,
      userId: null,
    })),
    ...allBehavioralQuestions.map((q) => ({
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty ?? "mid",
      area: "softskills" as const,
      tags: q.tags ?? [],
      isGlobal: true,
      userId: null,
    })),
  ];

  await db.insert(interviewQuestions).values(rows as any[]);
  console.log(`Seeded ${rows.length} global interview questions.`);
}

/**
 * Seeds a table when the current row count is below the seed data count.
 * Inserts only rows that are missing (by comparing existing count vs seed count).
 * This allows adding new seed rows without wiping existing user data.
 */
async function seedTableIfNeeded(table: any, data: any[], name: string) {
  const [row] = await db.select({ n: countFn() }).from(table);
  const existing = Number(row?.n ?? 0);

  if (existing >= data.length) {
    console.log(`${name} already seeded (${existing} rows) — skipping.`);
    return;
  }

  console.log(`${name}: found ${existing} rows, seed has ${data.length} — upserting new entries…`);

  // Map seed data to DB rows
  const rows = data.map(({ id: _id, ...rest }) => {
    const mapped: any = { ...rest, userId: "local" };
    if (rest.createdAt) mapped.createdAt = new Date(rest.createdAt);
    if (rest.updatedAt) mapped.updatedAt = new Date(rest.updatedAt);
    return mapped;
  });

  // Insert all — on conflict do nothing (existing rows are preserved)
  await db.insert(table).values(rows).onConflictDoNothing();
  console.log(`Seeded ${rows.length} rows into ${name}.`);
}

/**
 * Seeds planner tasks (no fixed id — uses auto-generated UUID).
 * Tasks are user-scoped and date-bound. Dates are generated relative to today.
 */
async function seedPlannerIfNeeded() {
  const [row] = await db.select({ n: countFn() }).from(plannerTasks);
  const existing = Number(row?.n ?? 0);

  if (existing >= seedPlannerTasks.length) {
    console.log(`plannerTasks already seeded (${existing} rows) — skipping.`);
    return;
  }

  console.log(`plannerTasks: found ${existing} rows, seeding ${seedPlannerTasks.length} tasks…`);

  const rows = seedPlannerTasks.map((t) => ({
    userId: "local",
    date: t.date,
    title: t.title,
    description: t.description,
    priority: t.priority as any,
    status: t.status as any,
    category: t.category as any,
    order: t.order,
    estimatedMinutes: t.estimatedMinutes,
    tags: t.tags,
    slug: "",
  }));

  await db.insert(plannerTasks).values(rows);
  console.log(`Seeded ${rows.length} planner tasks.`);
}

/**
 * Seeds conversations + messages.
 * conversations has serial PK (no userId) — special handling needed.
 */
async function seedConversationsIfNeeded() {
  const [row] = await db.select({ n: countFn() }).from(conversations);
  const existing = Number(row?.n ?? 0);

  if (existing >= seedConversations.length) {
    console.log(`conversations already seeded (${existing} rows) — skipping.`);
    return;
  }

  console.log(`conversations: seeding ${seedConversations.length} conversations with messages…`);

  for (let i = 0; i < seedConversations.length; i++) {
    const [conv] = await db
      .insert(conversations)
      .values({ title: seedConversations[i].title })
      .returning({ id: conversations.id });

    if (!conv) continue;

    const msgs = seedMessagesForConversations
      .filter((m) => m.conversationIndex === i)
      .map(({ conversationIndex: _ci, ...rest }) => ({
        ...rest,
        conversationId: conv.id,
      }));

    if (msgs.length > 0) {
      await db.insert(messages).values(msgs);
    }
  }

  console.log(`Seeded ${seedConversations.length} conversations with messages.`);
}

export async function runSeeding() {
  // 1. Seed global interview questions
  await seedGlobalInterviewQuestions();

  // 2. Seed core assets — will re-seed if new entries were added to seed files
  await seedTableIfNeeded(prompts, seedPrompts, "prompts");
  await seedTableIfNeeded(agents, seedAgents, "agents");
  await seedTableIfNeeded(components, seedComponents, "components");
  await seedTableIfNeeded(snippets, seedSnippets, "snippets");
  await seedTableIfNeeded(templates, seedTemplates, "templates");

  // 3. Seed integration assets
  await seedTableIfNeeded(connectors, seedConnectors, "connectors");
  await seedTableIfNeeded(socialDrafts, seedSocialDrafts, "socialDrafts");
  await seedTableIfNeeded(mailTemplates, seedMailTemplates, "mailTemplates");

  // 4. Seed CV profiles
  await seedTableIfNeeded(cvProfiles, seedCvProfiles, "cvProfiles");

  // 5. Seed career / freelance data
  await seedTableIfNeeded(savedJobs, seedJobs, "savedJobs");
  await seedTableIfNeeded(freelanceOffers, seedFreelanceOffers, "freelanceOffers");
  await seedTableIfNeeded(myServices, seedMyServices, "myServices");

  // 6. Seed planner tasks (date-relative, no fixed id)
  await seedPlannerIfNeeded();

  // 7. Seed AI conversations + messages
  await seedConversationsIfNeeded();
}

async function main() {
  try {
    await runSeeding();
    console.log("Database seeding completed successfully.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith("seed.ts") || 
  process.argv[1].endsWith("seed.js") || 
  process.argv[1].includes("/seed") || 
  process.argv[1].includes("\\seed")
);

if (isDirectRun) {
  main();
}
