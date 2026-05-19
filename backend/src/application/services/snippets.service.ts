import { db } from "../../infrastructure/database/index.js";
import { snippets } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class SnippetsService {
  static async getAll(userId: string) {
    return await db.select().from(snippets).where(eq(snippets.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await db
          .select()
          .from(snippets)
          .where(and(eq(snippets.id, safeId), eq(snippets.userId, userId)))
      : [];

    if (existing.length > 0) {
      const [r] = await db
        .update(snippets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(snippets.id, safeId!))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(snippets)
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
      .insert(snippets)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(snippets)
      .where(and(eq(snippets.id, id), eq(snippets.userId, userId)));
    return true;
  }
}
