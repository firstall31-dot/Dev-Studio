import { templates } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class TemplatesService {
  static async getAll(userId: string) {
    return await uow.templates.findAll(eq(templates.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.templates.findAll(
          and(eq(templates.id, safeId), eq(templates.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.templates.update(safeId!, data);
      return r;
    } else {
      const r = await uow.templates.create({
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

    return await uow.templates.createMany(values);
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const templ = await uow.templates.findById(id);
    if (templ && templ.userId === userId) {
      await uow.templates.delete(id);
    }
    return true;
  }
}
