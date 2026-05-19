import { freelanceOffers } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class OffersService {
  static async getAll(userId: string) {
    return await uow.freelanceOffers.findAll(eq(freelanceOffers.userId, userId));
  }

  static async create(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;

    if (safeId) {
      const existing = await uow.freelanceOffers.findAll(
        and(eq(freelanceOffers.id, safeId), eq(freelanceOffers.userId, userId))
      );

      if (existing.length > 0) {
        const r = await uow.freelanceOffers.update(safeId, data);
        return r;
      }
    }

    const r = await uow.freelanceOffers.create({
      ...data,
      userId,
      ...(safeId ? { id: safeId } : {}),
    } as any);

    return r;
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) return true;
    const offer = await uow.freelanceOffers.findById(id);
    if (offer && offer.userId === userId) {
      await uow.freelanceOffers.delete(id);
    }
    return true;
  }
}
