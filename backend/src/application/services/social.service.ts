import { socialDrafts } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class SocialService {
  static async getAll(userId: string) {
    return await uow.socialDrafts.findAll(eq(socialDrafts.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.socialDrafts.findAll(
          and(eq(socialDrafts.id, safeId), eq(socialDrafts.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.socialDrafts.update(safeId!, data);
      return r;
    } else {
      const r = await uow.socialDrafts.create({
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

    return await uow.socialDrafts.createMany(values);
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const draft = await uow.socialDrafts.findById(id);
    if (draft && draft.userId === userId) {
      await uow.socialDrafts.delete(id);
    }
    return true;
  }
}
