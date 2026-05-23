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

// --- Tech Skill Area IDs (matches frontend TechAreaId) ---

export const TECH_AREA_IDS = [
  "frontend",
  "backend",
  "devops",
  "testing",
  "database",
  "design-patterns",
  "architecture",
  "system-design",
  "microservices",
  "security",
  "performance",
] as const;
export type TechAreaId = (typeof TECH_AREA_IDS)[number];

// --- Skill Item Types ---

export const SKILL_ITEM_PRIORITIES = ["low", "medium", "high"] as const;
export type SkillItemPriority = (typeof SKILL_ITEM_PRIORITIES)[number];

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
  "Mostaql",
  "Khamsat",
  "Wuzzuf",
  "Bayt",
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

// --- Notification Enums ---

export const NOTIFICATION_TYPES = [
  "agent_completed",
  "job_status_changed",
  "interview_reminder",
  "cv_generated",
  "planner_due",
  "offer_updated",
  "service_updated",
  "chat_reply",
  "system_info",
  "system_warning",
  "system_error",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

// --- Activity / Audit Log Enums ---

export const ACTIVITY_ACTIONS = [
  "create",
  "update",
  "delete",
  "view",
  "login",
  "logout",
  "export",
  "import",
  "run",
  "share",
] as const;
export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

export const ACTIVITY_ENTITY_TYPES = [
  "prompt",
  "agent",
  "snippet",
  "template",
  "component",
  "saved_job",
  "freelance_offer",
  "my_service",
  "connector",
  "social_draft",
  "mail_template",
  "cv",
  "planner_task",
  "chat",
  "interview",
  "profile",
  "auth",
] as const;
export type ActivityEntityType = (typeof ACTIVITY_ENTITY_TYPES)[number];

// --- Integrations Enums ---

export const CONNECTOR_TYPES = ["companies", "hr", "clients"] as const;
export type ConnectorType = (typeof CONNECTOR_TYPES)[number];

export const SOCIAL_PLATFORMS = ["linkedin", "twitter", "instagram"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const MAIL_CHANNELS = ["cover-letter", "gmail", "whatsapp"] as const;
export type MailChannel = (typeof MAIL_CHANNELS)[number];
