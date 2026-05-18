import { ElementType } from "react";
import { FocusArea, Difficulty, AnswerDepth } from "./common";

export interface Scenario {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  createdAt: number;
}

export interface Question {
  id: string;
  title: string;
  guide: string;
  scenarios: Scenario[];
  isDefault?: boolean;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  answerDepths?: any[];
  area: FocusArea;
  difficulty: Difficulty;
  tags: string[];
  category?: string;
  favorite?: boolean;
  isGlobal?: boolean;
  userId?: string;
  createdAt: number;
}

export type TechAreaId =
  | "frontend"
  | "backend"
  | "devops"
  | "testing"
  | "database"
  | "design-patterns"
  | "architecture"
  | "system-design"
  | "microservices"
  | "security"
  | "performance";

export type SoftAreaId = "softskills";
export type AreaId = TechAreaId | SoftAreaId;

export interface SkillConcept {
  title: string;
  body: string;
}

export interface SkillResource {
  label: string;
  url: string;
  desc: string;
}

export interface SkillChecklistItem {
  id: string;
  label: string;
}

export interface SkillAreaData {
  id: AreaId;
  label: string;
  icon: ElementType;
  description: string;
  concepts: SkillConcept[];
  resources: SkillResource[];
  checklist: SkillChecklistItem[];
  subAreasLabel?: string;
  subAreas?: {
    id: string;
    label: string;
    icon?: ElementType;
    color: string;
    accent: string;
    tags: string[];
    concepts?: SkillConcept[];
    resources?: SkillResource[];
    checklist?: SkillChecklistItem[];
  }[];
}
