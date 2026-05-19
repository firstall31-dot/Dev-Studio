import {
  pgTable,
  text,
  uuid,
  timestamp,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const authUsers = pgTable(
  "auth_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").unique(),
    passwordHash: text("password_hash"),
    googleId: text("google_id").unique(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    isVerified: boolean("is_verified").default(false).notNull(),
    verificationToken: text("verification_token"),
    verificationTokenExpires: timestamp("verification_token_expires"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("auth_users_email_idx").on(t.email),
    index("auth_users_google_id_idx").on(t.googleId),
  ],
);
