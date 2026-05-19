import { db } from "../../infrastructure/database/index.js";
import { myServices } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class MyServicesService {
  static async getAll(userId: string) {
    return await db.select().from(myServices).where(eq(myServices.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    
    if (safeId) {
      const existing = await db
        .select()
        .from(myServices)
        .where(and(eq(myServices.id, safeId), eq(myServices.userId, userId)));
        
      if (existing.length > 0) {
        const [r] = await db
          .update(myServices)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(myServices.id, safeId))
          .returning();
        return r;
      }
    }
    
    const [r] = await db
      .insert(myServices)
      .values({ ...data, userId, ...(safeId ? { id: safeId } : {}) } as any)
      .returning();
      
    return r;
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(myServices)
      .where(and(eq(myServices.id, id), eq(myServices.userId, userId)));
    return true;
  }
}
