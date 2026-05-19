import { mailTemplates } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class MailService {
  static async getAll(userId: string) {
    return await uow.mailTemplates.findAll(eq(mailTemplates.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.mailTemplates.findAll(
          and(eq(mailTemplates.id, safeId), eq(mailTemplates.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.mailTemplates.update(safeId!, data);
      return r;
    } else {
      const r = await uow.mailTemplates.create({
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

    return await uow.mailTemplates.createMany(values);
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const mailTemplate = await uow.mailTemplates.findById(id);
    if (mailTemplate && mailTemplate.userId === userId) {
      await uow.mailTemplates.delete(id);
    }
    return true;
  }
}
