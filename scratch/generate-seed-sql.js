import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seedInterviewQuestions } from "../src/data/seeds/interview-core.js";
import { seedInterviewExtra } from "../src/data/seeds/interview-extra.js";

const allQuestions = [...seedInterviewQuestions, ...seedInterviewExtra];

let sql = "INSERT INTO public.interview_questions (question, answer, difficulty, area, category, tags, favorite, is_global, created_at) VALUES \n";

const escapeSql = (str) => {
  if (!str) return "NULL";
  return "'" + str.replace(/'/g, "''") + "'";
};

const rows = allQuestions.map((q) => {
  const qText = escapeSql(q.question);
  const aText = escapeSql(q.answer);
  const diff = escapeSql(q.difficulty ?? "mid");
  const area = escapeSql(q.area ?? "general");
  const cat = escapeSql(q.category ?? q.area ?? "general");
  const tagsStr = "'{" + (q.tags ?? []).map(t => `"${t.replace(/"/g, '\\"')}"`).join(",") + "}'::text[]";
  const fav = q.favorite ? "true" : "false";
  return `(${qText}, ${aText}, ${diff}, ${area}, ${cat}, ${tagsStr}, ${fav}, true, now())`;
});

sql += rows.join(",\n") + ";";

fs.writeFileSync("scratch/seed.sql", sql, "utf8");
console.log(`Generated SQL with ${rows.length} rows inside scratch/seed.sql`);
