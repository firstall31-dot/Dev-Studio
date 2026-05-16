type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FocusArea, Difficulty } from "../types/common";
import type { Prompt, Agent, ComponentAsset, Template, Snippet, Connector, SocialDraft, MailTemplate } from "../types/tools";
import type { InterviewQuestion } from "../types/skills";
import * as db from "@/lib/api";
import { toast } from "sonner";
import { seedPrompts, seedAgents, seedComponents, seedTemplates, seedSnippets } from "@/data/seeds/tools";
import { seedInterviewQuestions } from "@/data/seeds/interview-core";
import { seedInterviewExtra } from "@/data/seeds/interview-extra";
import { seedConnectors, seedSocialDrafts, seedMailTemplates } from "@/data/seeds/extras";

interface ForgeState {
  prompts: Prompt[];
  agents: Agent[];
  components: ComponentAsset[];
  templates: Template[];
  snippets: Snippet[];
  interviewQuestions: InterviewQuestion[];
  connectors: Connector[];
  socialDrafts: SocialDraft[];
  mailTemplates: MailTemplate[];
  userProgress: Record<string, boolean>;
  isLoading: boolean;
  initialized: boolean;

  init: () => Promise<void>;
  
  upsertPrompt: (p: Prompt) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  toggleFavoritePrompt: (id: string) => Promise<void>;
  incrementPromptUsage: (id: string) => Promise<void>;

  upsertAgent: (a: Agent) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;

  upsertComponent: (c: ComponentAsset) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  toggleFavoriteComponent: (id: string) => Promise<void>;

  upsertTemplate: (t: Template) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;

  upsertSnippet: (s: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;

  upsertConnector: (c: Connector) => Promise<void>;
  deleteConnector: (id: string) => Promise<void>;

  upsertSocialDraft: (d: SocialDraft) => Promise<void>;
  deleteSocialDraft: (id: string) => Promise<void>;

  upsertMailTemplate: (m: MailTemplate) => Promise<void>;
  deleteMailTemplate: (id: string) => Promise<void>;

  toggleProgress: (itemId: string, areaId: string) => Promise<void>;
  
  upsertInterviewQuestion: (q: InterviewQuestion) => Promise<void>;
  deleteInterviewQuestion: (id: string) => Promise<void>;
  toggleFavoriteInterviewQuestion: (id: string) => Promise<void>;
  seedIfEmpty: () => Promise<void>;
  seedExtrasIfEmpty: () => Promise<void>;
}

export const useForge = create<ForgeState>()(
  persist(
    (set, get) => ({
      prompts: [],
      agents: [],
      components: [],
      templates: [],
      snippets: [],
      interviewQuestions: [],
      connectors: [],
      socialDrafts: [],
      mailTemplates: [],
      userProgress: {},
      isLoading: false,
      initialized: false,

      init: async () => {
        if (get().initialized) return;
        set({ isLoading: true });
        try {
          const user = true;
          if (user) {
            const [p, a, c, s, conn, soc, mail, q, prog] = await Promise.all([
              db.getPrompts(),
              db.getAgents(),
              db.getComponents(),
              db.getSnippets(),
              db.getConnectors(),
              db.getSocialDrafts(),
              db.getMailTemplates(),
              db.getInterviewQuestions(),
              db.getUserProgress(),
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
              userProgress: progressMap,
              initialized: true
            });

            // Full seed on a completely fresh account
            if (p.length === 0 && a.length === 0) {
              await get().seedIfEmpty();
            } else if (conn.length === 0 || soc.length === 0 || mail.length === 0) {
              // Existing account missing the newer asset types — seed only those
              await get().seedExtrasIfEmpty();
            }
          }
        } catch (e) {
          console.error("Init store error:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      upsertPrompt: async (p) => {
        const previous = get().prompts;
        set((s) => ({
          prompts: s.prompts.some(x => x.id === p.id)
            ? s.prompts.map((x: any) => x.id === p.id ? p : x)
            : [p, ...s.prompts]
        }));
        try {
          const saved = await db.upsertPrompt({
            ...p,
            usage_count: p.usageCount,
            versions: p.versions as unknown as Json,
            user_id: ''
          });
          if (saved?.id && saved.id !== p.id) {
            set((s) => ({ prompts: s.prompts.map(x => x.id === p.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Prompt saved!');
        } catch (err: any) {
          set({ prompts: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deletePrompt: async (id) => {
        const previous = get().prompts;
        set((s) => ({ prompts: s.prompts.filter(p => p.id !== id) }));
        
        toast.promise(
          db.deletePrompt(id),
          {
            loading: 'Deleting prompt...',
            success: 'Prompt deleted!',
            error: (err) => {
              set({ prompts: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
      },
      toggleFavoritePrompt: async (id) => {
        const p = get().prompts.find(x => x.id === id);
        if (p) await get().upsertPrompt({ ...p, favorite: !p.favorite });
      },
      incrementPromptUsage: async (id) => {
        const p = get().prompts.find(x => x.id === id);
        if (p) await get().upsertPrompt({ ...p, usageCount: (p.usageCount || 0) + 1 });
      },

      upsertAgent: async (a) => {
        const previous = get().agents;
        set((s) => ({
          agents: s.agents.some(x => x.id === a.id)
            ? s.agents.map((x: any) => x.id === a.id ? a : x)
            : [a, ...s.agents]
        }));
        try {
          const saved = await db.upsertAgent({ ...a, system_prompt: a.systemPrompt, user_id: '' });
          if (saved?.id && saved.id !== a.id) {
            set((s) => ({ agents: s.agents.map(x => x.id === a.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Agent saved!');
        } catch (err: any) {
          set({ agents: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deleteAgent: async (id) => {
        const previous = get().agents;
        set((s) => ({ agents: s.agents.filter(a => a.id !== id) }));

        toast.promise(
          db.deleteAgent(id),
          {
            loading: 'Deleting agent...',
            success: 'Agent deleted!',
            error: (err) => {
              set({ agents: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
      },

      upsertComponent: async (c) => {
        const previous = get().components;
        set((s) => ({
          components: s.components.some(x => x.id === c.id)
            ? s.components.map((x: any) => x.id === c.id ? c : x)
            : [c, ...s.components]
        }));
        try {
          const saved = await db.upsertComponent({ ...c, usage_count: c.usageCount, user_id: '' });
          if (saved?.id && saved.id !== c.id) {
            set((s) => ({ components: s.components.map(x => x.id === c.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Component saved!');
        } catch (err: any) {
          set({ components: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deleteComponent: async (id) => {
        const previous = get().components;
        set((s) => ({ components: s.components.filter(c => c.id !== id) }));

        toast.promise(
          db.deleteComponent(id),
          {
            loading: 'Deleting component...',
            success: 'Component deleted!',
            error: (err) => {
              set({ components: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
      },
      toggleFavoriteComponent: async (id) => {
        const c = get().components.find(x => x.id === id);
        if (c) await get().upsertComponent({ ...c, favorite: !c.favorite });
      },

      upsertSnippet: async (snip) => {
        const previous = get().snippets;
        set((s) => ({
          snippets: s.snippets.some(x => x.id === snip.id)
            ? s.snippets.map((x: any) => x.id === snip.id ? snip : x)
            : [snip, ...s.snippets]
        }));
        try {
          const saved = await db.upsertSnippet({ ...snip, user_id: '' });
          if (saved?.id && saved.id !== snip.id) {
            set((s) => ({ snippets: s.snippets.map(x => x.id === snip.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Snippet saved!');
        } catch (err: any) {
          set({ snippets: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deleteSnippet: async (id) => {
        const previous = get().snippets;
        set((s) => ({ snippets: s.snippets.filter(x => x.id !== id) }));

        toast.promise(
          db.deleteSnippet(id),
          {
            loading: 'Deleting snippet...',
            success: 'Snippet deleted!',
            error: (err) => {
              set({ snippets: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
      },

      upsertConnector: async (conn) => {
        const previous = get().connectors;
        set((s) => ({
          connectors: s.connectors.some(x => x.id === conn.id)
            ? s.connectors.map((x: any) => x.id === conn.id ? conn : x)
            : [conn, ...s.connectors]
        }));
        try {
          const saved = await db.upsertConnector({ ...conn, user_id: '', type: conn.type as "github" | "google" | "discord" | "slack" });
          if (saved?.id && saved.id !== conn.id) {
            set((s) => ({ connectors: s.connectors.map(x => x.id === conn.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Connector saved!');
        } catch (err: any) {
          set({ connectors: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deleteConnector: async (id) => {
        const previous = get().connectors;
        set((s) => ({ connectors: s.connectors.filter(x => x.id !== id) }));

        toast.promise(
          db.deleteConnector(id),
          {
            loading: 'Deleting connector...',
            success: 'Connector deleted!',
            error: (err) => {
              set({ connectors: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
      },

      upsertSocialDraft: async (soc) => {
        const previous = get().socialDrafts;
        set((s) => ({
          socialDrafts: s.socialDrafts.some(x => x.id === soc.id)
            ? s.socialDrafts.map((x: any) => x.id === soc.id ? soc : x)
            : [soc, ...s.socialDrafts]
        }));
        try {
          const saved = await db.upsertSocialDraft({ ...soc, user_id: '', platform: (soc.platform as string) || "linkedin", media_urls: soc.mediaUrls || [] });
          if (saved?.id && saved.id !== soc.id) {
            set((s) => ({ socialDrafts: s.socialDrafts.map(x => x.id === soc.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Draft saved!');
        } catch (err: any) {
          set({ socialDrafts: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deleteSocialDraft: async (id) => {
        const previous = get().socialDrafts;
        set((s) => ({ socialDrafts: s.socialDrafts.filter(x => x.id !== id) }));

        toast.promise(
          db.deleteSocialDraft(id),
          {
            loading: 'Deleting draft...',
            success: 'Draft deleted!',
            error: (err) => {
              set({ socialDrafts: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
      },

      upsertMailTemplate: async (mail) => {
        const previous = get().mailTemplates;
        set((s) => ({
          mailTemplates: s.mailTemplates.some(x => x.id === mail.id)
            ? s.mailTemplates.map((x: any) => x.id === mail.id ? mail : x)
            : [mail, ...s.mailTemplates]
        }));
        try {
          const saved = await db.upsertMailTemplate({ ...mail, user_id: '', channel: mail.channel as "email" | "sms" | "whatsapp" });
          if (saved?.id && saved.id !== mail.id) {
            set((s) => ({ mailTemplates: s.mailTemplates.map(x => x.id === mail.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Template saved!');
        } catch (err: any) {
          set({ mailTemplates: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deleteMailTemplate: async (id) => {
        const previous = get().mailTemplates;
        set((s) => ({ mailTemplates: s.mailTemplates.filter(x => x.id !== id) }));

        toast.promise(
          db.deleteMailTemplate(id),
          {
            loading: 'Deleting template...',
            success: 'Template deleted!',
            error: (err) => {
              set({ mailTemplates: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
      },

      toggleProgress: async (itemId, areaId) => {
        const current = !!get().userProgress[itemId];
        set((s) => ({ userProgress: { ...s.userProgress, [itemId]: !current } }));
        try { await db.toggleProgress(itemId, areaId, !current); } catch (e) { console.error(e); }
      },

      // Placeholder for remaining methods
      upsertTemplate: async (t) => {
        const previous = get().templates;
        set((s) => ({
          templates: s.templates.some(x => x.id === t.id)
            ? s.templates.map((x: any) => x.id === t.id ? t : x)
            : [t, ...s.templates]
        }));
        try {
          const saved = await db.upsertTemplate({ ...t, user_id: '' });
          if (saved?.id && saved.id !== t.id) {
            set((s) => ({ templates: s.templates.map(x => x.id === t.id ? { ...x, id: saved.id } : x) }));
          }
          toast.success('Template saved!');
        } catch (err: any) {
          set({ templates: previous });
          toast.error(`Failed to save: ${err.message}`);
        }
      },
      deleteTemplate: async (id) => {
        const previous = get().templates;
        set((s) => ({ templates: s.templates.filter(x => x.id !== id) }));

        toast.promise(
          db.deleteTemplate(id),
          {
            loading: 'Deleting template...',
            success: 'Template deleted!',
            error: (err) => {
              set({ templates: previous });
              return `Failed to delete: ${err.message}`;
            }
          }
        );
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
            user_id: '',
            domain: (q.area || q.category || 'frontend'),
            tags: q.tags || []
          });
          if (saved?.id && saved.id !== q.id) {
            set((s) => ({ interviewQuestions: s.interviewQuestions.map(x => x.id === q.id ? { ...x, id: saved.id } : x) }));
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

          // Refresh data
          const [p, a, c, s, t, iq, conn, soc, mail] = await Promise.all([
            db.getPrompts(),
            db.getAgents(),
            db.getComponents(),
            db.getSnippets(),
            db.getTemplates(),
            db.getInterviewQuestions(),
            db.getConnectors(),
            db.getSocialDrafts(),
            db.getMailTemplates(),
          ]);

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
            templates: t.map((x: any) => ({
              id: x.id,
              name: x.name,
              description: x.description || "",
              stack: x.stack || [],
              tags: x.tags || [],
              structure: x.structure || "",
              notes: x.notes || "",
              createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
              updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
            })),
            interviewQuestions: iq.map((x: any) => ({
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
          toast.success("Initial data synchronized!");
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
          toast.success("Network & comms data ready!");
        } catch (e) {
          console.error("Extras seeding error:", e);
        }
      },
    }),
    { name: "forgedev-store-v2" },
  ),
);

export function fillVariables(body: string, values: Record<string, string>) {
  return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => values[k] ?? `{{${k}}}`);
}

export function newId(_prefix?: string) {
  return crypto.randomUUID();
}
