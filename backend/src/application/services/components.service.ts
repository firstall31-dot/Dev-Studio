import { db } from "../../infrastructure/database/index.js";
import { components } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class ComponentsService {
  static async getAll(userId: string) {
    return await db.select().from(components).where(eq(components.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await db
          .select()
          .from(components)
          .where(and(eq(components.id, safeId), eq(components.userId, userId)))
      : [];

    if (existing.length > 0) {
      const [r] = await db
        .update(components)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(components.id, safeId!))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(components)
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
      .insert(components)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(components)
      .where(and(eq(components.id, id), eq(components.userId, userId)));
    return true;
  }
}
