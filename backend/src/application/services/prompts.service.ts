import { db } from "../../infrastructure/database/index.js";
import { prompts } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class PromptsService {
  static async getAll(userId: string) {
    return await db.select().from(prompts).where(eq(prompts.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await db
          .select()
          .from(prompts)
          .where(and(eq(prompts.id, safeId), eq(prompts.userId, userId)))
      : [];

    if (existing.length > 0) {
      const [r] = await db
        .update(prompts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(prompts.id, safeId!))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(prompts)
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
      .insert(prompts)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(prompts)
      .where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
    return true;
  }
}
