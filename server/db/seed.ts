import { db, pool } from "./index.js";
import { interviewQuestions } from "../../shared/schema/learning.js";
import { seedInterviewQuestions } from "../../src/data/seeds/interview-core.js";
import { seedInterviewExtra } from "../../src/data/seeds/interview-extra.js";
import { DEFAULT_QUESTIONS } from "../../src/constants/behavioral.js";

async function seedGlobalInterviewQuestions() {
  const existing = await db.select({ id: interviewQuestions.id }).from(interviewQuestions).limit(1);
  if (existing.length > 0) {
    console.log("Interview questions already seeded — skipping.");
    return;
  }

  const allQuestions = [...seedInterviewQuestions, ...seedInterviewExtra];

  const rows = [
    ...allQuestions.map((q) => ({
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty ?? "mid",
      area: q.area ?? "general",
      tags: q.tags ?? [],
      isGlobal: true,
      userId: null,
    })),
    ...DEFAULT_QUESTIONS.map((q) => ({
      id: q.id,
      question: q.title,
      answer: q.guide,
      difficulty: "mid" as const,
      area: "softskills" as const,
      tags: ["behavioral"],
      isGlobal: true,
      userId: null,
    }))
  ];

  await db.insert(interviewQuestions).values(rows as any[]);
  console.log(`Seeded ${rows.length} global interview questions.`);
}

async function main() {
  try {
    await seedGlobalInterviewQuestions();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
