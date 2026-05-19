import type {
  JobStatus,
  OfferStatus,
  ServiceStatus,
  JobPlatform,
  OfferPlatform,
  ServicePlatform,
} from "@shared/enums";

import {
  JOB_STATUSES,
  OFFER_STATUSES,
  SERVICE_STATUSES,
  JOB_PLATFORMS,
  OFFER_PLATFORMS,
  SERVICE_PLATFORMS,
} from "@shared/enums";

export type {
  JobStatus,
  OfferStatus,
  ServiceStatus,
  JobPlatform,
  OfferPlatform,
  ServicePlatform,
};

export {
  JOB_STATUSES,
  OFFER_STATUSES,
  SERVICE_STATUSES,
  JOB_PLATFORMS,
  OFFER_PLATFORMS,
  SERVICE_PLATFORMS,
};

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  platform: JobPlatform | string;
  status: JobStatus;
  salary: string;
  remote: boolean;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface FreelanceOffer {
  id: string;
  title: string;
  client: string;
  platform: OfferPlatform | string;
  budget: string;
  currency: string;
  status: OfferStatus;
  description: string;
  url: string;
  deadline: string;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface MyService {
  id: string;
  title: string;
  platform: ServicePlatform | string;
  url: string;
  category: string;
  price: string;
  currency: string;
  status: ServiceStatus;
  description: string;
  deliveryDays: number;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface RemoteJob {
  id: string;
  url: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  tags: string[];
  salary_min?: number;
  salary_max?: number;
  date: string;
  description?: string;
}


export const STATUS_COLORS: Record<string, string> = {
  saved: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  applied: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  interview: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  offer: "bg-green-500/15 text-green-400 border-green-500/20",
  rejected: "bg-red-500/15 text-red-400 border-red-500/20",
  new: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  in_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  accepted: "bg-green-500/15 text-green-400 border-green-500/20",
  completed: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  active: "bg-green-500/15 text-green-400 border-green-500/20",
  paused: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  draft: "bg-muted text-muted-foreground border-border",
};

export const PLATFORM_COLORS: Record<string, string> = {
  Fiverr: "bg-emerald-500/15 text-emerald-400",
  Mostaql: "bg-orange-500/15 text-orange-400",
  Khamsat: "bg-amber-500/15 text-amber-400",
  Upwork: "bg-green-500/15 text-green-400",
  Freelancer: "bg-blue-500/15 text-blue-400",
  LinkedIn: "bg-sky-500/15 text-sky-400",
  Indeed: "bg-indigo-500/15 text-indigo-400",
  RemoteOK: "bg-cyan-500/15 text-cyan-400",
  Toptal: "bg-blue-500/15 text-blue-400",
  PeoplePerHour: "bg-orange-500/15 text-orange-400",
  Glassdoor: "bg-teal-500/15 text-teal-400",
  AngelList: "bg-rose-500/15 text-rose-400",
};
