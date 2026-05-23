import {
  pgTable,
  text,
  uuid,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { ActivityAction, ActivityEntityType } from "../enums.js";

/**
 * activity_logs
 *
 * Append-only audit trail of every meaningful user action in the app.
 * Rows are NEVER updated or deleted — treat this table as immutable.
 *
 * Query patterns optimised by indexes:
 *   1. User timeline (paginated, newest first)  → idx_activity_logs_user_created
 *   2. Who touched a specific resource?         → idx_activity_logs_entity
 *   3. Filter by action type for a user         → idx_activity_logs_user_action
 *   4. Filter by entity type for a user         → idx_activity_logs_user_entity_type
 *   5. Time-range scans / scheduled cleanup     → idx_activity_logs_created_at
 */
export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: text("user_id").notNull(),

    action: text("action").$type<ActivityAction>().notNull(),

    entityType: text("entity_type").$type<ActivityEntityType>().notNull(),

    entityId: uuid("entity_id"),

    entityName: text("entity_name"),

    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    ipAddress: text("ip_address"),

    userAgent: text("user_agent"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_activity_logs_user_created").on(t.userId, t.createdAt),

    index("idx_activity_logs_entity").on(t.entityType, t.entityId),

    index("idx_activity_logs_user_action").on(t.userId, t.action),

    index("idx_activity_logs_user_entity_type").on(t.userId, t.entityType),

    index("idx_activity_logs_created_at").on(t.createdAt),
  ],
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
