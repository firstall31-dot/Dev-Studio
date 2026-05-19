/**
 * Pure Domain Enums
 *
 * These constants and types have NO dependencies on the database or backend frameworks.
 * They are safe to be imported directly by the frontend to ensure strict typing across the stack.
 */

// --- Planner Enums ---

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_CATEGORIES = [
  "activities",
  "work",
  "learning",
  "general",
] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

// --- Learning / Interview Enums ---

export const QUESTION_DIFFICULTIES = ["junior", "mid", "senior"] as const;
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];

export const QUESTION_AREAS = [
  "frontend",
  "backend",
  "devops",
  "testing",
  "database",
  "softskills",
  "general",
] as const;
export type QuestionArea = (typeof QUESTION_AREAS)[number];

// --- Career & Jobs Enums ---

export const JOB_STATUSES = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const OFFER_STATUSES = [
  "new",
  "in_review",
  "accepted",
  "rejected",
  "completed",
] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

export const SERVICE_STATUSES = ["active", "paused", "draft"] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const JOB_PLATFORMS = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "RemoteOK",
  "Upwork",
  "We Work Remotely",
  "AngelList",
  "Other",
] as const;
export type JobPlatform = (typeof JOB_PLATFORMS)[number];

export const OFFER_PLATFORMS = [
  "Mostaql",
  "Upwork",
  "Freelancer",
  "Khamsat",
  "Toptal",
  "PeoplePerHour",
  "Fiverr",
  "Other",
] as const;
export type OfferPlatform = (typeof OFFER_PLATFORMS)[number];

export const SERVICE_PLATFORMS = [
  "Fiverr",
  "Mostaql",
  "Khamsat",
  "Upwork",
  "PeoplePerHour",
  "Freelancer",
  "Other",
] as const;
export type ServicePlatform = (typeof SERVICE_PLATFORMS)[number];

// --- CV Enums ---

export const CV_FOCUSES = [
  "frontend",
  "backend",
  "fullstack",
  "general",
] as const;
export type CVFocus = (typeof CV_FOCUSES)[number];

export const CV_LANGUAGE_LEVELS = [
  "native",
  "fluent",
  "advanced",
  "intermediate",
  "basic",
] as const;
export type CVLanguageLevel = (typeof CV_LANGUAGE_LEVELS)[number];

export const ATS_GRADES = ["Excellent", "Good", "Fair", "Weak"] as const;
export type ATSGrade = (typeof ATS_GRADES)[number];

// --- Core & Asset Enums ---

export const AGENT_STATUSES = ["active", "idle", "draft"] as const;
export type AgentStatus = (typeof AGENT_STATUSES)[number];

export const ASSET_KINDS = [
  "prompt",
  "agent",
  "component",
  "template",
  "snippet",
] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

// --- Integrations Enums ---

export const CONNECTOR_TYPES = ["companies", "hr", "clients"] as const;
export type ConnectorType = (typeof CONNECTOR_TYPES)[number];

export const SOCIAL_PLATFORMS = ["linkedin", "twitter", "instagram"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const MAIL_CHANNELS = ["cover-letter", "gmail", "whatsapp"] as const;
export type MailChannel = (typeof MAIL_CHANNELS)[number];
