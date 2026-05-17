import { pgTable, text, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";

export const plannerTasks = pgTable("planner_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("medium"),
  status: text("status").default("todo"),
  category: text("category").default("general"),
  order: integer("order").default(0),
  estimatedMinutes: integer("estimated_minutes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("planner_tasks_user_date_idx").on(t.userId, t.date)]);
