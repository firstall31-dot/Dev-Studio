import { IRepository } from "./base.repository.js";

export interface IUnitOfWork {
  agents: IRepository<any, any>;
  components: IRepository<any, any>;
  connectors: IRepository<any, any>;
  prompts: IRepository<any, any>;
  templates: IRepository<any, any>;
  snippets: IRepository<any, any>;
  mailTemplates: IRepository<any, any>;
  socialDrafts: IRepository<any, any>;
  savedJobs: IRepository<any, any>;
  freelanceOffers: IRepository<any, any>;
  myServices: IRepository<any, any>;
  interviewQuestions: IRepository<any, any>;
  cvProfiles: IRepository<any, any>;
  plannerTasks: IRepository<any, any>;
  authUsers: IRepository<any, any>;
  userProfiles: IRepository<any, any>;

  transaction<T>(callback: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
