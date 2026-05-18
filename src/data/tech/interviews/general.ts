import type { InterviewQuestion } from "../../../types/skills";

const now = Date.now();
const q = (i: number) => `iq_ge_${i}`;

export const generalCoreQuestions: InterviewQuestion[] = [
  {
    id: q(1), area: "general", difficulty: "mid",
    question: "What is the SOLID principles? Give a brief description of each.",
    answer: "S: Single Responsibility — one class, one reason to change. O: Open/Closed — open for extension, closed for modification. L: Liskov Substitution — subclasses must be substitutable for base classes. I: Interface Segregation — many specific interfaces > one general. D: Dependency Inversion — depend on abstractions, not concretions.",
    tags: ["architecture", "design-patterns"], favorite: true, createdAt: now,
  },
  {
    id: q(2), area: "general", difficulty: "mid",
    question: "What is the difference between concurrency and parallelism?",
    answer: "Concurrency: dealing with multiple things at once (structure) — e.g., Node.js event loop handles many requests on one thread by interleaving. Parallelism: doing multiple things simultaneously (execution) — requires multiple CPU cores. You can have concurrency without parallelism (single core multitasking).",
    tags: ["concurrency", "systems"], createdAt: now,
  },
  {
    id: q(3), area: "general", difficulty: "senior",
    question: "How do you approach a system design interview?",
    answer: "1. Clarify requirements (functional + non-functional: QPS, latency, scale). 2. Estimate scale (DAU, storage, bandwidth). 3. High-level design (API, data model, main components). 4. Deep dive on bottlenecks (DB choice, caching, sharding, CDN). 5. Discuss tradeoffs explicitly — no perfect answer. 6. Address reliability (replication, retries, circuit breakers).",
    tags: ["system-design", "interview"], favorite: true, createdAt: now,
  },
  {
    id: q(4), area: "general", difficulty: "mid",
    question: "What is the difference between a monolith, microservices, and modular monolith?",
    answer: "Monolith: single deployable unit, simple to develop initially, hard to scale selectively. Microservices: independently deployable services, each owns its data; network overhead, distributed complexity. Modular monolith: clear internal module boundaries, single deployment — best of both worlds for most teams. Start modular monolith, extract services only when you have clear scaling needs.",
    tags: ["architecture", "microservices"], createdAt: now,
  },
  {
    id: q(5), area: "general", difficulty: "junior",
    question: "What is Git rebasing vs merging?",
    answer: "Merge: creates a merge commit preserving full branch history. Rebase: replays commits on top of target branch, creating a linear history. Rebase rewrites SHA hashes — never rebase shared/public branches. Use merge for feature → main; rebase for keeping feature branch up-to-date with main locally.",
    tags: ["git", "version-control"], createdAt: now,
  },
];
