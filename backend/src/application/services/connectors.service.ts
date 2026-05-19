import { connectors } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class ConnectorsService {
  static async getAll(userId: string) {
    return await uow.connectors.findAll(eq(connectors.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.connectors.findAll(
          and(eq(connectors.id, safeId), eq(connectors.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.connectors.update(safeId!, data);
      return r;
    } else {
      const r = await uow.connectors.create({
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

    return await uow.connectors.createMany(values);
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const conn = await uow.connectors.findById(id);
    if (conn && conn.userId === userId) {
      await uow.connectors.delete(id);
    }
    return true;
  }
}
