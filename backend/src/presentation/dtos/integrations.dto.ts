import { z } from "zod";
import {
  CONNECTOR_TYPES,
  SOCIAL_PLATFORMS,
  MAIL_CHANNELS,
} from "../../domain/enums.js";

const uuidOptional = z.string().uuid().optional();
const tagsArray = z.array(z.string()).default([]);

// ── Connector ─────────────────────────────────────────────────────────────────
export const ConnectorDto = z.object({
  id: uuidOptional,
  type: z.enum(CONNECTOR_TYPES),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  notes: z.string().max(1000).optional(),
  category: z.string().max(80).default(""),
  tags: tagsArray,
  slug: z.string().max(120).default(""),
});

// ── Social Draft ──────────────────────────────────────────────────────────────
export const SocialDraftDto = z.object({
  id: uuidOptional,
  platform: z.enum(SOCIAL_PLATFORMS),
  content: z.string().min(1, "Content is required").max(5000),
  mediaUrls: z.array(z.string()).default([]),
  category: z.string().max(80).default(""),
  tags: tagsArray,
  slug: z.string().max(120).default(""),
});

// ── Mail Template ─────────────────────────────────────────────────────────────
export const MailTemplateDto = z.object({
  id: uuidOptional,
  channel: z.enum(MAIL_CHANNELS),
  subject: z.string().max(300).optional(),
  content: z.string().min(1, "Content is required"),
  category: z.string().max(80).default(""),
  tags: tagsArray,
  slug: z.string().max(120).default(""),
});

export type ConnectorDtoType = z.infer<typeof ConnectorDto>;
export type SocialDraftDtoType = z.infer<typeof SocialDraftDto>;
export type MailTemplateDtoType = z.infer<typeof MailTemplateDto>;
