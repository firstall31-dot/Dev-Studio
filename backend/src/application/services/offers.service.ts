import { db } from "../../infrastructure/database/index.js";
import { freelanceOffers } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class OffersService {
  static async getAll(userId: string) {
    return await db
      .select()
      .from(freelanceOffers)
      .where(eq(freelanceOffers.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    
    if (safeId) {
      const existing = await db
        .select()
        .from(freelanceOffers)
        .where(
          and(eq(freelanceOffers.id, safeId), eq(freelanceOffers.userId, userId)),
        );
        
      if (existing.length > 0) {
        const [r] = await db
          .update(freelanceOffers)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(freelanceOffers.id, safeId))
          .returning();
        return r;
      }
    }
    
    const [r] = await db
      .insert(freelanceOffers)
      .values({ ...data, userId, ...(safeId ? { id: safeId } : {}) } as any)
      .returning();
      
    return r;
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) return true;
    await db
      .delete(freelanceOffers)
      .where(
        and(
          eq(freelanceOffers.id, id),
          eq(freelanceOffers.userId, userId),
        ),
      );
    return true;
  }
}
