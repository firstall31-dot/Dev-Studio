import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../../domain/schema.js";

const { Pool } = pg;

// Use a placeholder URL if DATABASE_URL is missing to prevent startup crashes.
// Database operations will fail at runtime if the connection is actually attempted.
// We strip out sslmode and channel_binding query parameters to suppress libpq warnings from pg.
const rawUrl =
  process.env.DATABASE_URL || "postgres://localhost:5432/placeholder";
const connectionString = rawUrl
  .replace(/(\?|&)sslmode=require/g, "")
  .replace(/(\?|&)channel_binding=require/g, "")
  .replace(/\?$/, "");

if (!process.env.DATABASE_URL) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "WARNING: DATABASE_URL is not set. Database operations will fail if called.",
  );
}

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
  // Required for Neon PostgreSQL (TLS-only endpoint)
  ssl: process.env.DATABASE_URL?.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

export const db = drizzle(pool, { schema });
