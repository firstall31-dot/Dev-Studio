import { db } from "../../infrastructure/database/index.js";
import { userProfiles } from "../../domain/schema.js";
import { eq } from "drizzle-orm";

export class ProfileService {
  static async getByUserId(userId: string) {
    const rows = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return rows[0] ?? null;
  }

  static async upsert(userId: string, data: { displayName?: string; avatarUrl?: string; location?: string }) {
    const existing = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    if (existing.length > 0) {
      const [r] = await db
        .update(userProfiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userProfiles.userId, userId))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(userProfiles)
        .values({ userId, ...data })
        .returning();
      return r;
    }
  }
}
