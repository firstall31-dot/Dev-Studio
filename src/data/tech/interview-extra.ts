/**
 * interview-extra.ts — THIN ASSEMBLER
 * Framework-specific questions have been split into ./interviews/ for clarity.
 * This file composes them back into a single export for backward compatibility.
 */
import type { InterviewQuestion } from "../../types/skills";
import {
  angularQuestions,
  vueQuestions,
  svelteQuestions,
  nextjsQuestions,
  aspnetQuestions,
  databaseExtraQuestions,
  backendTestingQuestions,
  drizzlePostgresQuestions,
} from "./interviews";

export const seedInterviewExtra: InterviewQuestion[] = [
  ...angularQuestions,
  ...vueQuestions,
  ...svelteQuestions,
  ...nextjsQuestions,
  ...aspnetQuestions,
  ...databaseExtraQuestions,
  ...backendTestingQuestions,
  ...drizzlePostgresQuestions,
];
