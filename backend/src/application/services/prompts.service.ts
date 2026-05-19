import { prompts } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class PromptsService {
  static async getAll(userId: string) {
    return await uow.prompts.findAll(eq(prompts.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.prompts.findAll(
          and(eq(prompts.id, safeId), eq(prompts.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.prompts.update(safeId!, data);
      return r;
    } else {
      const r = await uow.prompts.create({
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

    return await uow.prompts.createMany(values);
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const pmt = await uow.prompts.findById(id);
    if (pmt && pmt.userId === userId) {
      await uow.prompts.delete(id);
    }
    return true;
  }
}
