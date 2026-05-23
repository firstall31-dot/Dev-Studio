import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Json } from "@/integrations/supabase/types";
import type { FocusArea, Difficulty } from "../types/common";
import type { Prompt, Agent, ComponentAsset, Template, Snippet, Connector, SocialDraft, MailTemplate } from "../types/tools";
import type { InterviewQuestion } from "../types/skills";
import * as db from "@/integrations/supabase/actions";
import { toast } from "sonner";
import { seedPrompts, seedAgents, seedComponents, seedTemplates, seedSnippets } from "@/data/seeds/tools";
import { seedInterviewQuestions } from "@/data/seeds/interview-core";
import { seedInterviewExtra } from "@/data/seeds/interview-extra";

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
  reset: () => void;
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
          const user = await db.getCurrentUser();
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

            // Seed if empty
            if (p.length === 0 && a.length === 0) {
              await get().seedIfEmpty();
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
        
        toast.promise(
          db.upsertPrompt({ 
            ...p, 
            usage_count: p.usageCount, 
            versions: p.versions as unknown as Json, 
            user_id: '' 
          }),
          {
            loading: 'Saving prompt...',
            success: 'Prompt saved!',
            error: (err) => {
              set({ prompts: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertAgent({ ...a, system_prompt: a.systemPrompt, user_id: '' }),
          {
            loading: 'Saving agent...',
            success: 'Agent saved!',
            error: (err) => {
              set({ agents: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertComponent({ ...c, usage_count: c.usageCount, user_id: '' }),
          {
            loading: 'Saving component...',
            success: 'Component saved!',
            error: (err) => {
              set({ components: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertSnippet({ ...snip, user_id: '' }),
          {
            loading: 'Saving snippet...',
            success: 'Snippet saved!',
            error: (err) => {
              set({ snippets: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertConnector({ ...conn, user_id: '', type: conn.type as "github" | "google" | "discord" | "slack" }),
          {
            loading: 'Saving connector...',
            success: 'Connector saved!',
            error: (err) => {
              set({ connectors: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertSocialDraft({ ...soc, user_id: '', platform: (soc.platform as string) || "linkedin", media_urls: soc.mediaUrls || [] }),
          {
            loading: 'Saving draft...',
            success: 'Draft saved!',
            error: (err) => {
              set({ socialDrafts: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertMailTemplate({ ...mail, user_id: '', channel: mail.channel as "email" | "sms" | "whatsapp" }),
          {
            loading: 'Saving template...',
            success: 'Template saved!',
            error: (err) => {
              set({ mailTemplates: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertTemplate({ ...t, user_id: '' }),
          {
            loading: 'Saving template...',
            success: 'Template saved!',
            error: (err) => {
              set({ templates: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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

        toast.promise(
          db.upsertInterviewQuestion({ 
            ...q, 
            user_id: '', 
            domain: (q.area || q.category || 'frontend'),
            tags: q.tags || []
          }),
          {
            loading: 'Saving question...',
            success: 'Question saved!',
            error: (err) => {
              set({ interviewQuestions: previous });
              return `Failed to save: ${err.message}`;
            }
          }
        );
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
        const user = await db.getCurrentUser();
        if (!user) return;

        console.log("Seeding initial data...");

        const promptsData = seedPrompts.map(({ id, ...p }) => ({ 
          ...p, 
          user_id: user.id,
          body: p.body, 
          system_prompt: "" 
        }));
        const agentsData = seedAgents.map(({ id, ...a }) => ({ 
          ...a, 
          user_id: user.id,
          system_prompt: a.systemPrompt 
        }));
        const componentsData = seedComponents.map(({ id, ...c }) => ({
          ...c,
          user_id: user.id
        }));
        const snippetsData = seedSnippets.map(({ id, ...s }) => ({
          ...s,
          user_id: user.id
        }));
        const templatesData = seedTemplates.map(({ id, ...t }) => ({
          ...t,
          user_id: user.id
        }));
        const interviewQsData = [...seedInterviewQuestions, ...seedInterviewExtra].map(({ id, ...q }) => ({
          ...q,
          user_id: user.id,
          domain: q.area || q.category || 'frontend',
          answer_depths: (q.answerDepths || []) as unknown as Json
        }));

        try {
          await Promise.all([
            db.upsertPrompts(promptsData),
            db.upsertAgents(agentsData),
            db.upsertComponents(componentsData),
            db.upsertSnippets(snippetsData),
            db.upsertTemplates(templatesData),
            db.upsertInterviewQuestions(interviewQsData),
          ]);

          // Refresh data
          const [p, a, c, s, t, iq] = await Promise.all([
            db.getPrompts(),
            db.getAgents(),
            db.getComponents(),
            db.getSnippets(),
            db.getTemplates(),
            db.getInterviewQuestions(),
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
          });
          toast.success("Initial data synchronized!");
        } catch (e) {
          console.error("Seeding error:", e);
        }
      },

      reset: () => {
        set({
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
        });
      },
    }),
    { name: "forgedev-store-supabase-v2" },
  ),
);

export function fillVariables(body: string, values: Record<string, string>) {
  return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => values[k] ?? `{{${k}}}`);
}

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
