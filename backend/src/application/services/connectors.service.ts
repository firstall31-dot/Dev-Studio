import { db } from "../../infrastructure/database/index.js";
import { connectors } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class ConnectorsService {
  static async getAll(userId: string) {
    return await db.select().from(connectors).where(eq(connectors.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await db
          .select()
          .from(connectors)
          .where(and(eq(connectors.id, safeId), eq(connectors.userId, userId)))
      : [];

    if (existing.length > 0) {
      const [r] = await db
        .update(connectors)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(connectors.id, safeId!))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(connectors)
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
      .insert(connectors)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(connectors)
      .where(and(eq(connectors.id, id), eq(connectors.userId, userId)));
    return true;
  }
}
