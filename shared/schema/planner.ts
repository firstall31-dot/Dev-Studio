import { pgTable, text, uuid, integer, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "in-progress", "done"]);
export const taskCategoryEnum = pgEnum("task_category", ["activities", "work", "learning", "general"]);

export const plannerTasks = pgTable("planner_tasks", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("planner_tasks_user_date_idx").on(t.userId, t.date)]);
