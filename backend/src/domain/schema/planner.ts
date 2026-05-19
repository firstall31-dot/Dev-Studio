import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

import { TASK_PRIORITIES, TASK_STATUSES, TASK_CATEGORIES } from "../enums.js";

export const taskPriorityEnum = pgEnum("task_priority", TASK_PRIORITIES);
export const taskStatusEnum = pgEnum("task_status", TASK_STATUSES);
export const taskCategoryEnum = pgEnum("task_category", TASK_CATEGORIES);

export const plannerTasks = pgTable(
  "planner_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    date: text("date").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    priority: taskPriorityEnum("priority").default("medium"),
    status: taskStatusEnum("status").default("todo"),
    category: taskCategoryEnum("category").default("general"),
    order: integer("order").default(0),
    estimatedMinutes: integer("estimated_minutes"),
    tags: text("tags").array().default([]),
    slug: text("slug").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index("planner_tasks_user_date_idx").on(t.userId, t.date)],
);
