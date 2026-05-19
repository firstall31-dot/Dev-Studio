
import { interviewQuestions, userProgress } from "../../domain/schema.js";
import { eq, and, or } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";

export class InterviewService {
  static async getQuestions(userId: string) {
    return await uow.interviewQuestions.findAll(
      or(
        eq(interviewQuestions.isGlobal, true),
        eq(interviewQuestions.userId, userId),
      )
    );
  }

  static async createQuestion(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.interviewQuestions.findAll(eq(interviewQuestions.id, safeId))
      : [];

    if (existing.length > 0 && existing[0].userId === userId) {
      const r = await uow.interviewQuestions.update(safeId!, data);
      return r;
    } else {
      const r = await uow.interviewQuestions.create({
        ...data,
        userId,
        ...(safeId ? { id: safeId } : {}),
      } as any);
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

    return await uow.interviewQuestions.createMany(values);
  }

  static async deleteQuestionById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    const question = await uow.interviewQuestions.findById(id);
    if (question && question.userId === userId) {
      await uow.interviewQuestions.delete(id);
    }
    return true;
  }

  static async getProgress(userId: string) {
    return await uow.userProgress.findAll(eq(userProgress.userId, userId));
  }

  static async toggleProgress(
    userId: string,
    itemId: string,
    areaId: string,
    completed: boolean,
  ) {
    const existing = await uow.userProgress.findAll(
      and(eq(userProgress.userId, userId), eq(userProgress.itemId, itemId)),
    );

    if (existing.length > 0) {
      const [r] = await uow.userProgress.updateMany(
        and(eq(userProgress.userId, userId), eq(userProgress.itemId, itemId)),
        { completed }
      );
      return r;
    } else {
      const r = await uow.userProgress.create({
        userId,
        itemId,
        areaId,
        completed,
      });
      return r;
    }
  }
}
