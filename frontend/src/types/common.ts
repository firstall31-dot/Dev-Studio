import type { QuestionDifficulty as Difficulty, QuestionArea as FocusArea } from "@shared/enums";

export type { Difficulty, FocusArea };

export type AssetKind = "prompt" | "agent" | "component" | "template" | "snippet";

export interface AnswerDepth {
  id: string;
  label: string;
  body: string;
}
