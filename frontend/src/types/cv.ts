import type { CVFocus, CVLanguageLevel } from "@shared/enums";
import { CV_FOCUSES, CV_LANGUAGE_LEVELS } from "@shared/enums";

export type { CVFocus, CVLanguageLevel };
export { CV_FOCUSES };

export interface CVPersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  title?: string;
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  bullets: string[];
  tags: string[];
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  grade?: string;
  notes?: string;
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  url?: string;
  repo?: string;
  tags: string[];
  bullets: string[];
}

export interface CVSkills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export interface CVLanguage {
  id: string;
  language: string;
  level: CVLanguageLevel;
}

export interface CVProfile {
  id: string;
  title: string;
  focus: CVFocus;
  personalInfo: CVPersonalInfo;
  summary: string;
  experience: CVExperience[];
  skills: CVSkills;
  education: CVEducation[];
  projects: CVProject[];
  languages: CVLanguage[];
  createdAt: number;
  updatedAt: number;
}

export interface ATSSectionScore {
  score: number;
  feedback: string;
}

export interface ATSResult {
  score: number;
  grade: "Excellent" | "Good" | "Fair" | "Weak";
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  sectionScores: {
    summary: ATSSectionScore;
    experience: ATSSectionScore;
    skills: ATSSectionScore;
    education: ATSSectionScore;
    projects: ATSSectionScore;
  };
  focusInsights: string[];
  jobTitle?: string;
  detectedFocus?: CVFocus;
}

export const FOCUS_LABELS: Record<CVFocus, string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
  general: "General",
};

export const FOCUS_COLORS: Record<CVFocus, string> = {
  frontend: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  backend: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  fullstack: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  general: "bg-muted text-muted-foreground border-border",
};

export const FOCUS_KEYWORDS: Record<CVFocus, string[]> = {
  frontend: [
    "React",
    "Vue",
    "Angular",
    "TypeScript",
    "JavaScript",
    "CSS",
    "HTML",
    "Tailwind",
    "Next.js",
    "Webpack",
    "Vite",
    "Redux",
    "Zustand",
    "GraphQL",
    "REST API",
    "responsive",
    "accessibility",
    "UI/UX",
    "SASS",
    "styled-components",
  ],
  backend: [
    "Node.js",
    "Python",
    "Java",
    "Go",
    "Rust",
    "Express",
    "FastAPI",
    "Django",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "REST API",
    "GraphQL",
    "microservices",
    "authentication",
    "authorization",
    "CI/CD",
  ],
  fullstack: [
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "REST API",
    "GraphQL",
    "Docker",
    "AWS",
    "Next.js",
    "Express",
    "MongoDB",
    "Redis",
    "CI/CD",
    "full-stack",
    "frontend",
    "backend",
    "database",
  ],
  general: [
    "problem-solving",
    "communication",
    "teamwork",
    "agile",
    "scrum",
    "git",
    "version control",
    "code review",
    "documentation",
    "testing",
  ],
};

export const LANGUAGE_LEVELS = CV_LANGUAGE_LEVELS;
