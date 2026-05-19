import { db } from "../../infrastructure/database/index.js";
import { interviewQuestions, userProgress } from "../../domain/schema.js";
import { eq, and, or } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils

export class InterviewService {
  static async getQuestions(userId: string) {
    return await db
      .select()
      .from(interviewQuestions)
      .where(
        or(
          eq(interviewQuestions.isGlobal, true),
          eq(interviewQuestions.userId, userId),
        ),
      );
  }

  static async createQuestion(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await db
          .select()
          .from(interviewQuestions)
          .where(eq(interviewQuestions.id, safeId))
      : [];

    if (existing.length > 0 && existing[0].userId === userId) {
      const [r] = await db
        .update(interviewQuestions)
        .set(data)
        .where(eq(interviewQuestions.id, safeId!))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(interviewQuestions)
        .values({
          ...data,
          userId,
          ...(safeId ? { id: safeId } : {}),
        } as any)
        .returning();
      return r;
    }
  }

  static async createQuestionsBulk(userId: string, items: any[]) {
    if (!items.length) {
      return [];
    }
    const values = items.map(({ id, ...raw }) => {
      const data = stripDates(raw);
      const safeId = isUUID(id) ? id : undefined;
      return { ...data, userId, ...(safeId ? { id: safeId } : {}) } as any;
    });
    
    return await db
      .insert(interviewQuestions)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }

  static async deleteQuestionById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(interviewQuestions)
      .where(
        and(
          eq(interviewQuestions.id, id),
          eq(interviewQuestions.userId, userId),
        ),
      );
    return true;
  }

  static async getProgress(userId: string) {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  static async toggleProgress(userId: string, itemId: string, areaId: string, completed: boolean) {
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.itemId, itemId)));

    if (existing.length > 0) {
      const [r] = await db
        .update(userProgress)
        .set({ completed, updatedAt: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.itemId, itemId)))
        .returning();
      return r;
    } else {
      const [r] = await db
        .insert(userProgress)
        .values({ userId, itemId, areaId, completed })
        .returning();
      return r;
    }
  }
}
