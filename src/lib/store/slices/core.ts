import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { Difficulty, FocusArea } from "@/types/common";
import { Prompt, Agent } from "@/types/tools";
import { seedPrompts, seedAgents, seedComponents, seedSnippets, seedTemplates } from "@/data/seeds/tools";
import { seedInterviewQuestions } from "@/data/seeds/interview-core";
import { seedInterviewExtra } from "@/data/seeds/interview-extra";
import { seedConnectors, seedSocialDrafts, seedMailTemplates } from "@/data/seeds/extras";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

let _initInFlight = false;

export const createCoreSlice: StateCreator<ForgeState, [["zustand/persist", unknown]], [], Partial<ForgeState>> = (set, get) => ({
  init: async () => {
    if (get().initialized || _initInFlight) return;
    _initInFlight = true;
    set({ isLoading: true });
    try {
      const [p, a, c, t, s, conn, soc, mail, q, prog, cvs] = await Promise.all([
        db.getPrompts(),
        db.getAgents(),
        db.getComponents(),
        db.getTemplates(),
        db.getSnippets(),
        db.getConnectors(),
        db.getSocialDrafts(),
        db.getMailTemplates(),
        db.getInterviewQuestions(),
        db.getUserProgress(),
        db.getCVProfiles(),
      ]);
      
      const progressMap: Record<string, boolean> = {};
      prog.forEach((i: any) => progressMap[i.item_id] = i.completed ?? true);

      set({
        prompts: p.map((x: any) => ({
          id: x.id,
          title: x.title,
          body: x.body,
          description: x.description || "",
          category: x.category || "General",
          tags: x.tags || [],
          variables: x.variables || [],
          favorite: x.favorite || false,
          usageCount: x.usage_count ?? 0,
          versions: (x.versions as unknown as Prompt['versions']) || [],
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(),
        })),
        agents: a.map((x: any) => ({
          id: x.id,
          name: x.name,
          role: x.role || "",
          systemPrompt: x.system_prompt,
          tools: x.tools || [],
          model: x.model || "gpt-4",
          temperature: x.temperature ?? 0.7,
          status: (x.status as Agent['status']) || "idle",
          tags: x.tags || [],
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        components: c.map((x: any) => ({
          id: x.id,
          name: x.name,
          description: x.description || "",
          category: x.category || "General",
          tags: x.tags || [],
          code: x.code,
          dependencies: x.dependencies || [],
          favorite: x.favorite || false,
          usageCount: x.usage_count ?? 0,
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        templates: t.map((x: any) => ({
          id: x.id,
          name: x.name,
          description: x.description || "",
          stack: x.stack || [],
          tags: x.tags || [],
          structure: x.structure || "",
          notes: x.notes || "",
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(),
        })),
        snippets: s.map((x: any) => ({
          id: x.id,
          title: x.title,
          language: x.language,
          description: x.description || "",
          code: x.code,
          tags: x.tags || [],
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        connectors: conn.map((x: any) => ({
          id: x.id,
          type: x.type,
          name: x.name,
          email: x.email || undefined,
          phone: x.phone || undefined,
          notes: x.notes || undefined,
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        socialDrafts: soc.map((x: any) => ({
          id: x.id,
          platform: x.platform,
          content: x.content,
          mediaUrls: x.media_urls || [],
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        mailTemplates: mail.map((x: any) => ({
          id: x.id,
          channel: x.channel,
          subject: x.subject || undefined,
          content: x.content,
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        interviewQuestions: q.map((x: any) => ({
          id: x.id,
          question: x.question,
          answer: x.answer,
          difficulty: (x.difficulty as Difficulty) || "mid",
          area: (x.domain as FocusArea) || "frontend",
          category: x.domain || "frontend",
          tags: x.tags || [],
          favorite: x.is_global ?? false,
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now()
        })),
        cvProfiles: cvs,
        userProgress: progressMap,
        initialized: true
      });

      if (p.length === 0 && a.length === 0) {
        await get().seedIfEmpty();
      } else if (conn.length === 0 || soc.length === 0 || mail.length === 0) {
        await get().seedExtrasIfEmpty();
      }
    } catch (e) {
      console.error("Init store error:", e);
    } finally {
      _initInFlight = false;
      set({ isLoading: false });
    }
  },

  seedIfEmpty: async () => {
    console.log("Seeding initial data...");

    const promptsData = seedPrompts.map(({ id, ...p }) => ({ 
      ...p, 
      user_id: 'local',
      body: p.body, 
      system_prompt: "" 
    }));
    const agentsData = seedAgents.map(({ id, ...a }) => ({ 
      ...a, 
      user_id: 'local',
      system_prompt: a.systemPrompt 
    }));
    const componentsData = seedComponents.map(({ id, ...c }) => ({
      ...c,
      user_id: 'local'
    }));
    const snippetsData = seedSnippets.map(({ id, ...s }) => ({
      ...s,
      user_id: 'local'
    }));
    const templatesData = seedTemplates.map(({ id, ...t }) => ({
      ...t,
      user_id: 'local'
    }));
    const interviewQsData = [...seedInterviewQuestions, ...seedInterviewExtra].map(({ id, ...q }) => ({
      ...q,
      user_id: 'local',
      domain: q.area || q.category || 'frontend',
      answer_depths: (q.answerDepths || []) as unknown as Json
    }));
    const connectorsData = seedConnectors.map(({ id: _id, ...c }) => ({
      ...c,
      user_id: 'local',
    }));
    const socialDraftsData = seedSocialDrafts.map(({ id: _id, ...d }) => ({
      ...d,
      media_urls: d.mediaUrls,
      user_id: 'local',
    }));
    const mailTemplatesData = seedMailTemplates.map(({ id: _id, ...m }) => ({
      ...m,
      user_id: 'local',
    }));

    try {
      await Promise.all([
        db.upsertPrompts(promptsData),
        db.upsertAgents(agentsData),
        db.upsertComponents(componentsData),
        db.upsertSnippets(snippetsData),
        db.upsertTemplates(templatesData),
        db.upsertInterviewQuestions(interviewQsData),
        db.upsertConnectors(connectorsData),
        db.upsertSocialDrafts(socialDraftsData),
        db.upsertMailTemplates(mailTemplatesData),
      ]);

      // Force refresh by re-initializing (or just updating state directly)
      set({ initialized: false });
      await get().init();
    } catch (e) {
      console.error("Seeding error:", e);
    }
  },

  seedExtrasIfEmpty: async () => {
    console.log("Seeding extras (connectors / social / mail)...");
    const state = get();

    const connectorsData = state.connectors.length === 0
      ? seedConnectors.map(({ id: _id, ...c }) => ({ ...c, user_id: 'local' }))
      : [];
    const socialDraftsData = state.socialDrafts.length === 0
      ? seedSocialDrafts.map(({ id: _id, ...d }) => ({ ...d, media_urls: d.mediaUrls, user_id: 'local' }))
      : [];
    const mailTemplatesData = state.mailTemplates.length === 0
      ? seedMailTemplates.map(({ id: _id, ...m }) => ({ ...m, user_id: 'local' }))
      : [];

    try {
      await Promise.all([
        connectorsData.length > 0 ? db.upsertConnectors(connectorsData) : Promise.resolve([]),
        socialDraftsData.length > 0 ? db.upsertSocialDrafts(socialDraftsData) : Promise.resolve([]),
        mailTemplatesData.length > 0 ? db.upsertMailTemplates(mailTemplatesData) : Promise.resolve([]),
      ]);

      // Partial refresh
      const [conn, soc, mail] = await Promise.all([
        db.getConnectors(),
        db.getSocialDrafts(),
        db.getMailTemplates(),
      ]);

      set({
        connectors: conn.map((x: any) => ({
          id: x.id,
          type: x.type,
          name: x.name,
          email: x.email || undefined,
          phone: x.phone || undefined,
          notes: x.notes || undefined,
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        socialDrafts: soc.map((x: any) => ({
          id: x.id,
          platform: x.platform,
          content: x.content,
          mediaUrls: x.media_urls || [],
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
        mailTemplates: mail.map((x: any) => ({
          id: x.id,
          channel: x.channel,
          subject: x.subject || undefined,
          content: x.content,
          createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
          updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
        })),
      });
    } catch (e) {
      console.error("Extras seeding error:", e);
    }
  },

  hardReset: () => {
    localStorage.removeItem("forgedev-store-v3");
    window.location.reload();
  },
});
