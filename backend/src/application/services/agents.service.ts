import { db } from "../../infrastructure/database/index.js";
import { agents } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class AgentsService {
  static async getAll(userId: string) {
    return await db.select().from(agents).where(eq(agents.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await db
          .select()
          .from(agents)
          .where(and(eq(agents.id, safeId), eq(agents.userId, userId)))
      : [];

    if (existing.length > 0) {
      const [r] = await db
        .update(agents)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(agents.id, safeId!))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(agents)
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
      .insert(agents)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(agents)
      .where(and(eq(agents.id, id), eq(agents.userId, userId)));
    return true;
  }
}
