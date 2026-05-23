-- ============================================================
-- Migration: Activity / Audit Log
-- Table: activity_logs
-- ============================================================

CREATE TABLE IF NOT EXISTS "activity_logs" (
  "id"           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"      TEXT        NOT NULL,
  "action"       TEXT        NOT NULL,
  "entity_type"  TEXT        NOT NULL,
  "entity_id"    UUID,
  "entity_name"  TEXT,
  "metadata"     JSONB,
  "ip_address"   TEXT,
  "user_agent"   TEXT,
  "created_at"   TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

-- 1. User timeline — paginated feed, newest first
CREATE INDEX IF NOT EXISTS "idx_activity_logs_user_created"
  ON "activity_logs" ("user_id", "created_at" DESC);

-- 2. Resource history — "who touched this item?"
CREATE INDEX IF NOT EXISTS "idx_activity_logs_entity"
  ON "activity_logs" ("entity_type", "entity_id");

-- 3. Filter by action type for a specific user
CREATE INDEX IF NOT EXISTS "idx_activity_logs_user_action"
  ON "activity_logs" ("user_id", "action");

-- 4. Filter by entity type for a specific user
CREATE INDEX IF NOT EXISTS "idx_activity_logs_user_entity_type"
  ON "activity_logs" ("user_id", "entity_type");

-- 5. Time-range scans and scheduled cleanup jobs
CREATE INDEX IF NOT EXISTS "idx_activity_logs_created_at"
  ON "activity_logs" ("created_at");

-- ============================================================
-- Row-Level Security
-- ============================================================

ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;

-- Users may only read their own activity.
-- The app sets app.current_user_id via SET LOCAL before every query.
CREATE POLICY "activity_logs_select_own"
  ON "activity_logs"
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', TRUE));

-- Only the backend service role may insert rows.
-- No direct client inserts are permitted.
CREATE POLICY "activity_logs_insert_service"
  ON "activity_logs"
  FOR INSERT
  WITH CHECK (TRUE);   -- enforced at network level; client has no INSERT grant

-- Explicitly deny UPDATE and DELETE for all roles.
-- Audit logs are immutable by design.
CREATE POLICY "activity_logs_no_update"
  ON "activity_logs"
  FOR UPDATE
  USING (FALSE);

CREATE POLICY "activity_logs_no_delete"
  ON "activity_logs"
  FOR DELETE
  USING (FALSE);
