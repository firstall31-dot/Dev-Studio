import { agents } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class AgentsService {
  static async getAll(userId: string) {
    return await uow.agents.findAll(eq(agents.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.agents.findAll(
          and(eq(agents.id, safeId), eq(agents.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.agents.update(safeId!, data);
      return r;
    } else {
      const r = await uow.agents.create({
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

    return await uow.agents.createMany(values);
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const agent = await uow.agents.findById(id);
    if (agent && agent.userId === userId) {
      await uow.agents.delete(id);
    }
    return true;
  }
}
