import { myServices } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class MyServicesService {
  static async getAll(userId: string) {
    return await uow.myServices.findAll(eq(myServices.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;

    if (safeId) {
      const existing = await uow.myServices.findAll(
        and(eq(myServices.id, safeId), eq(myServices.userId, userId))
      );

      if (existing.length > 0) {
        const r = await uow.myServices.update(safeId, data);
        return r;
      }
    }

    const r = await uow.myServices.create({
      ...data,
      userId,
      ...(safeId ? { id: safeId } : {}),
    } as any);

    return r;
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const serv = await uow.myServices.findById(id);
    if (serv && serv.userId === userId) {
      await uow.myServices.delete(id);
    }
    return true;
  }
}
