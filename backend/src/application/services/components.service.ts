import { components } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class ComponentsService {
  static async getAll(userId: string) {
    return await uow.components.findAll(eq(components.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.components.findAll(
          and(eq(components.id, safeId), eq(components.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.components.update(safeId!, data);
      return r;
    } else {
      const r = await uow.components.create({
        ...data,
        userId,
        ...(safeId ? { id: safeId } : {}),
      } as any);
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

    return await uow.components.createMany(values);
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const comp = await uow.components.findById(id);
    if (comp && comp.userId === userId) {
      await uow.components.delete(id);
    }
    return true;
  }
}
