import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { toast } from "sonner";
import { Difficulty } from "@/types/common";

export const createInterviewSlice: StateCreator<ForgeState, [["zustand/persist", unknown]], [], Partial<ForgeState>> = (set, get) => ({
  toggleProgress: async (itemId, areaId) => {
    const current = !!get().userProgress[itemId];
    set((s) => ({
      userProgress: {
        ...s.userProgress,
        [itemId]: !current
      }
    }));
    try {
      await db.toggleProgress(itemId, areaId, !current);
    } catch (err) {
      console.error("Toggle progress error:", err);
      // Revert on fail
      set((s) => ({
        userProgress: {
          ...s.userProgress,
          [itemId]: current
        }
      }));
    }
  },

  upsertInterviewQuestion: async (q) => {
    const previous = get().interviewQuestions;
    set((s) => ({
      interviewQuestions: s.interviewQuestions.some(x => x.id === q.id)
        ? s.interviewQuestions.map((x: any) => x.id === q.id ? q : x)
        : [q, ...s.interviewQuestions]
    }));
    try {
      const saved = await db.upsertInterviewQuestion({
        ...q,
        isGlobal: false,
      });
      if (saved?.id && saved.id !== q.id) {
        set((s) => ({ interviewQuestions: s.interviewQuestions.map(x => x.id === q.id ? { ...x, id: saved.id as string } : x) }));
      }
      toast.success('Question saved!');
    } catch (err: any) {
      set({ interviewQuestions: previous });
      toast.error(`Failed to save: ${err.message}`);
    }
  },
  deleteInterviewQuestion: async (id) => {
    const previous = get().interviewQuestions;
    set((s) => ({ interviewQuestions: s.interviewQuestions.filter(x => x.id !== id) }));

    toast.promise(
      db.deleteInterviewQuestion(id),
      {
        loading: 'Deleting question...',
        success: 'Question deleted!',
        error: (err) => {
          set({ interviewQuestions: previous });
          return `Failed to delete: ${err.message}`;
        }
      }
    );
  },
  toggleFavoriteInterviewQuestion: async (id) => {
    const q = get().interviewQuestions.find(x => x.id === id);
    if (q) await get().upsertInterviewQuestion({ ...q, favorite: !q.favorite });
  },
});
