import { db } from "../../infrastructure/database/index.js";
import { socialDrafts } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class SocialService {
  static async getAll(userId: string) {
    return await db.select().from(socialDrafts).where(eq(socialDrafts.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await db
          .select()
          .from(socialDrafts)
          .where(and(eq(socialDrafts.id, safeId), eq(socialDrafts.userId, userId)))
      : [];

    if (existing.length > 0) {
      const [r] = await db
        .update(socialDrafts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(socialDrafts.id, safeId!))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(socialDrafts)
        .values({
          ...data,
          userId,
          ...(safeId ? { id: safeId } : {}),
        } as any)
        .returning();
      return r;
    }
  }

  static async createBulk(userId: string, items: any[]) {
    if (!items.length) {
      return [];
    }
    const values = items.map(({ id, ...raw }) => {
      const data = stripDates(raw);
      const safeId = isUUID(id) ? id : undefined;
      return { ...data, userId, ...(safeId ? { id: safeId } : {}) } as any;
    });
    
    return await db
      .insert(socialDrafts)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(socialDrafts)
      .where(and(eq(socialDrafts.id, id), eq(socialDrafts.userId, userId)));
    return true;
  }
}
