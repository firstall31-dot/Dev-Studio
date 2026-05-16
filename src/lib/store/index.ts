import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ForgeState } from "./types";
import { createCoreSlice } from "./slices/core";
import { createPromptSlice } from "./slices/prompts";
import { createAgentSlice } from "./slices/agents";
import { createComponentSlice } from "./slices/components";
import { createIntegrationSlice } from "./slices/integrations";
import { createInterviewSlice } from "./slices/interview";
import { createCVSlice } from "./slices/cv";

export const useForge = create<ForgeState>()(
  persist(
    (...a) => ({
      prompts: [],
      agents: [],
      components: [],
      templates: [],
      snippets: [],
      interviewQuestions: [],
      connectors: [],
      socialDrafts: [],
      mailTemplates: [],
      cvProfiles: [],
      userProgress: {},
      isLoading: false,
      initialized: false,
      ...createCoreSlice(...a),
      ...createPromptSlice(...a),
      ...createAgentSlice(...a),
      ...createComponentSlice(...a),
      ...createIntegrationSlice(...a),
      ...createInterviewSlice(...a),
      ...createCVSlice(...a),
    } as ForgeState),
    {
      name: "forgedev-store-v3",
      partialize: (state) => ({ userProgress: state.userProgress }),
    }
  )
);

export function fillVariables(body: string, values: Record<string, string>) {
  return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => values[k] ?? `{{${k}}}`);
}

export function newId(_prefix?: string) {
  return crypto.randomUUID();
}
