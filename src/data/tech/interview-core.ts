/**
 * interview-core.ts — THIN ASSEMBLER
 * The questions have been split into ./interviews/ for clarity.
 * This file composes them back into a single export for backward compatibility.
 */
import type { InterviewQuestion } from "../../types/skills";
import {
  frontendCoreQuestions,
  backendCoreQuestions,
  devopsCoreQuestions,
  testingCoreQuestions,
  generalCoreQuestions,
} from "./interviews";

export const seedInterviewQuestions: InterviewQuestion[] = [
  ...frontendCoreQuestions,
  ...backendCoreQuestions,
  ...devopsCoreQuestions,
  ...testingCoreQuestions,
  ...generalCoreQuestions,
];
