import { db } from "../database/index.js";
import {
  agents,
  components,
  connectors,
  prompts,
  templates,
  snippets,
  mailTemplates,
  socialDrafts,
  savedJobs,
  freelanceOffers,
  myServices,
  interviewQuestions,
  cvProfiles,
  plannerTasks,
  authUsers,
  userProfiles,
  userProgress,
} from "../../domain/schema.js";
import { DrizzleBaseRepository } from "./drizzle-base.repository.js";
import { IUnitOfWork } from "../../domain/repositories/unit-of-work.interface.js";
import { IRepository } from "../../domain/repositories/base.repository.js";

export class DrizzleUnitOfWork implements IUnitOfWork {
  public agents: IRepository<any, any>;
  public components: IRepository<any, any>;
  public connectors: IRepository<any, any>;
  public prompts: IRepository<any, any>;
  public templates: IRepository<any, any>;
  public snippets: IRepository<any, any>;
  public mailTemplates: IRepository<any, any>;
  public socialDrafts: IRepository<any, any>;
  public savedJobs: IRepository<any, any>;
  public freelanceOffers: IRepository<any, any>;
  public myServices: IRepository<any, any>;
  public interviewQuestions: IRepository<any, any>;
  public cvProfiles: IRepository<any, any>;
  public plannerTasks: IRepository<any, any>;
  public authUsers: IRepository<any, any>;
  public userProfiles: IRepository<any, any>;
  public userProgress: IRepository<any, any>;

  constructor(private client: any = db) {
    this.agents = new DrizzleBaseRepository(agents, this.client);
    this.components = new DrizzleBaseRepository(components, this.client);
    this.connectors = new DrizzleBaseRepository(connectors, this.client);
    this.prompts = new DrizzleBaseRepository(prompts, this.client);
    this.templates = new DrizzleBaseRepository(templates, this.client);
    this.snippets = new DrizzleBaseRepository(snippets, this.client);
    this.mailTemplates = new DrizzleBaseRepository(mailTemplates, this.client);
    this.socialDrafts = new DrizzleBaseRepository(socialDrafts, this.client);
    this.savedJobs = new DrizzleBaseRepository(savedJobs, this.client);
    this.freelanceOffers = new DrizzleBaseRepository(freelanceOffers, this.client);
    this.myServices = new DrizzleBaseRepository(myServices, this.client);
    this.interviewQuestions = new DrizzleBaseRepository(interviewQuestions, this.client);
    this.cvProfiles = new DrizzleBaseRepository(cvProfiles, this.client);
    this.plannerTasks = new DrizzleBaseRepository(plannerTasks, this.client);
    this.authUsers = new DrizzleBaseRepository(authUsers, this.client);
    this.userProfiles = new DrizzleBaseRepository(userProfiles, this.client);
    this.userProgress = new DrizzleBaseRepository(userProgress, this.client);
  }

  async transaction<T>(callback: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    // If the client is already a transaction client, reuse it
    if (this.client !== db) {
      return await callback(this);
    }
    return await db.transaction(async (tx) => {
      const txUow = new DrizzleUnitOfWork(tx);
      return await callback(txUow);
    });
  }
}

// Export a singleton instance for direct use outside of transaction scopes
export const uow = new DrizzleUnitOfWork();
