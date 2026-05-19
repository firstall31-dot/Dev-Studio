import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { CVFocus } from "../enums.js";

export const cvProfiles = pgTable(
  "cv_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    title: text("title").notNull().default("My CV"),
    focus: text("focus").$type<CVFocus>().notNull().default("general"),
    personalInfo: text("personal_info").notNull().default("{}"),
    summary: text("summary").notNull().default(""),
    experience: text("experience").notNull().default("[]"),
    skills: text("skills").notNull().default("{}"),
    education: text("education").notNull().default("[]"),
    projects: text("projects").notNull().default("[]"),
    languages: text("languages").notNull().default("[]"),
    category: text("category").default(""),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("cv_profiles_user_id_idx").on(t.userId)],
);
