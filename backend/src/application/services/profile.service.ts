import { userProfiles } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class ProfileService {
  static async getByUserId(userId: string) {
    const rows = await uow.userProfiles.findAll(eq(userProfiles.userId, userId));
    return rows[0] ?? null;
  }

  static async upsert(
    userId: string,
    data: { displayName?: string; avatarUrl?: string; location?: string },
  ) {
    const existing = await uow.userProfiles.findAll(eq(userProfiles.userId, userId));

    if (existing.length > 0) {
      // Find the profile ID to perform an ID-based update
      const profileId = existing[0].id;
      const r = await uow.userProfiles.update(profileId, data);
      return r;
    } else {
      const r = await uow.userProfiles.create({ userId, ...data });
      return r;
    }
  }
}
