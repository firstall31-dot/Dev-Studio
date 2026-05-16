import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { toast } from "sonner";

export const createCVSlice: StateCreator<ForgeState, [["zustand/persist", unknown]], [], Partial<ForgeState>> = (set, get) => ({
  cvProfiles: [],

  upsertCVProfile: async (cv) => {
    const previous = get().cvProfiles;
    set((s) => ({
      cvProfiles: s.cvProfiles.some((x) => x.id === cv.id)
        ? s.cvProfiles.map((x) => (x.id === cv.id ? cv : x))
        : [cv, ...s.cvProfiles],
    }));
    try {
      const saved = await db.upsertCVProfile(cv);
      if (saved?.id && saved.id !== cv.id) {
        set((s) => ({ cvProfiles: s.cvProfiles.map((x) => (x.id === cv.id ? { ...x, id: saved.id } : x)) }));
      }
      toast.success("CV saved!");
    } catch (err: any) {
      set({ cvProfiles: previous });
      toast.error(`Failed to save CV: ${err.message}`);
    }
  },

  deleteCVProfile: async (id) => {
    const previous = get().cvProfiles;
    set((s) => ({ cvProfiles: s.cvProfiles.filter((x) => x.id !== id) }));
    toast.promise(db.deleteCVProfile(id), {
      loading: "Deleting CV...",
      success: "CV deleted!",
      error: (err) => {
        set({ cvProfiles: previous });
        return `Failed to delete: ${err.message}`;
      },
    });
  },
});
