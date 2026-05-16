import type { Prompt, Agent, ComponentAsset, Template, Snippet, Connector, SocialDraft, MailTemplate } from "../../types/tools";
import type { InterviewQuestion } from "../../types/skills";
import type { CVProfile } from "../../types/cv";

export interface ForgeState {
  prompts: Prompt[];
  agents: Agent[];
  components: ComponentAsset[];
  templates: Template[];
  snippets: Snippet[];
  interviewQuestions: InterviewQuestion[];
  connectors: Connector[];
  socialDrafts: SocialDraft[];
  mailTemplates: MailTemplate[];
  cvProfiles: CVProfile[];
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

  upsertCVProfile: (cv: CVProfile) => Promise<void>;
  deleteCVProfile: (id: string) => Promise<void>;

  toggleProgress: (itemId: string, areaId: string) => Promise<void>;
  
  upsertInterviewQuestion: (q: InterviewQuestion) => Promise<void>;
  deleteInterviewQuestion: (id: string) => Promise<void>;
  toggleFavoriteInterviewQuestion: (id: string) => Promise<void>;
  seedIfEmpty: () => Promise<void>;
  seedExtrasIfEmpty: () => Promise<void>;
  hardReset: () => void;
}
