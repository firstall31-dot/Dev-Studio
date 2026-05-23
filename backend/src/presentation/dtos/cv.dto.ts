import { z } from "zod";
import { CV_FOCUSES } from "../../domain/enums.js";

const uuidOptional = z.string().uuid().optional();
const tagsArray = z.array(z.string()).default([]);

const toJsonString = (fallback: string) =>
  z.preprocess(
    (v) => {
      if (v === undefined || v === null) return fallback;
      return typeof v === "string" ? v : JSON.stringify(v);
    },
    z.string(),
  );

// ── CV Profile ────────────────────────────────────────────────────────────────
export const CvProfileDto = z.object({
  id: uuidOptional,
  title: z.string().min(1, "Title is required").max(200).default("My CV"),
  focus: z.enum(CV_FOCUSES).default("general"),
  personalInfo: toJsonString("{}"),
  summary: z.string().default(""),
  experience: toJsonString("[]"),
  skills: toJsonString("{}"),
  education: toJsonString("[]"),
  projects: toJsonString("[]"),
  languages: toJsonString("[]"),
  category: z.string().max(80).default(""),
  tags: tagsArray,
  slug: z.string().max(120).default(""),
});

// ── ATS Check ─────────────────────────────────────────────────────────────────
export const AtsCheckDto = z.object({
  cvProfile: z.record(z.unknown()),
  jobDescription: z.string().min(10, "Job description is required"),
});

// ── Parse PDF ─────────────────────────────────────────────────────────────────
export const ParsePdfDto = z.object({
  fileBase64: z.string().min(1, "fileBase64 is required"),
});

export type CvProfileDtoType = z.infer<typeof CvProfileDto>;
export type AtsCheckDtoType = z.infer<typeof AtsCheckDto>;
export type ParsePdfDtoType = z.infer<typeof ParsePdfDto>;
