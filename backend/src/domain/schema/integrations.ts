import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { ConnectorType, SocialPlatform, MailChannel } from "../enums.js";

export const connectors = pgTable(
  "connectors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    type: text("type").$type<ConnectorType>().notNull(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    notes: text("notes"),
    category: text("category").default(""),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("connectors_user_id_idx").on(t.userId)],
);

export const socialDrafts = pgTable(
  "social_drafts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    platform: text("platform").$type<SocialPlatform>().notNull(),
    content: text("content").notNull(),
    mediaUrls: text("media_urls").array().default([]),
    category: text("category").default(""),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("social_drafts_user_id_idx").on(t.userId)],
);

export const mailTemplates = pgTable(
  "mail_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    channel: text("channel").$type<MailChannel>().notNull(),
    subject: text("subject"),
    content: text("content").notNull(),
    category: text("category").default(""),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("mail_templates_user_id_idx").on(t.userId)],
);
