import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";

export const cvProfiles = pgTable("cv_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title").notNull().default("My CV"),
  focus: text("focus").notNull().default("general"),
  personalInfo: text("personal_info").notNull().default("{}"),
  summary: text("summary").notNull().default(""),
  experience: text("experience").notNull().default("[]"),
  skills: text("skills").notNull().default("{}"),
  education: text("education").notNull().default("[]"),
  projects: text("projects").notNull().default("[]"),
  languages: text("languages").notNull().default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("cv_profiles_user_id_idx").on(t.userId)]);
