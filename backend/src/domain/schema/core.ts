import {
  pgTable,
  text,
  uuid,
  boolean,
  integer,
  real,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { AgentStatus } from "../enums.js";

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    role: text("role"),
    systemPrompt: text("system_prompt").notNull(),
    tools: text("tools").array().default([]),
    model: text("model"),
    temperature: real("temperature").default(0.7),
    status: text("status").$type<AgentStatus>().default("draft"),
    category: text("category").default(""),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("agents_user_id_idx").on(t.userId)],
);

export const prompts = pgTable(
  "prompts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category"),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    body: text("body").notNull(),
    variables: text("variables").array().default([]),
    model: text("model"),
    favorite: boolean("favorite").default(false),
    usageCount: integer("usage_count").default(0),
    versions: jsonb("versions").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("prompts_user_id_idx").on(t.userId)],
);

export const snippets = pgTable(
  "snippets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    language: text("language").notNull(),
    description: text("description"),
    code: text("code").notNull(),
    category: text("category").default(""),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("snippets_user_id_idx").on(t.userId)],
);

export const templates = pgTable(
  "templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    stack: text("stack").array().default([]),
    category: text("category").default(""),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    structure: text("structure"),
    notes: text("notes"),
    files: jsonb("files").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("templates_user_id_idx").on(t.userId)],
);

export const components = pgTable(
  "components",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category"),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    code: text("code").notNull(),
    dependencies: text("dependencies").array().default([]),
    favorite: boolean("favorite").default(false),
    usageCount: integer("usage_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("components_user_id_idx").on(t.userId)],
);
