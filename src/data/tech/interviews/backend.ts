import type { InterviewQuestion } from "../../../types/skills";

const now = Date.now();
const q = (i: number) => `iq_be_${i}`;

export const backendCoreQuestions: InterviewQuestion[] = [
  {
    id: q(1), area: "backend", difficulty: "junior",
    question: "What is the difference between REST and GraphQL?",
    answer: "REST: multiple fixed endpoints, over/under-fetching is common, versioning needed. GraphQL: single endpoint, client specifies exact data shape, solves over/under-fetching, built-in introspection. REST is simpler for simple APIs; GraphQL shines when many clients need different data shapes.",
    tags: ["api", "rest", "graphql"], createdAt: now,
  },
  {
    id: q(2), area: "backend", difficulty: "junior",
    question: "What is the difference between SQL and NoSQL databases?",
    answer: "SQL: relational, structured schema, ACID transactions, joins (Postgres, MySQL). NoSQL: flexible schema, horizontal scaling, eventual consistency (MongoDB document, Redis key-value, Cassandra wide-column, Neo4j graph). Choose SQL for complex relations/transactions; NoSQL for high write throughput, flexible schemas, or specific access patterns.",
    tags: ["database", "sql", "nosql"], createdAt: now,
  },
  {
    id: q(3), area: "backend", difficulty: "mid",
    question: "Explain database indexing. When should you NOT add an index?",
    answer: "An index is a data structure (usually B-tree) that speeds up reads by avoiding full table scans. Don't add indexes on: columns with very low cardinality (boolean), tables with heavy write ratios (indexes slow INSERT/UPDATE/DELETE), rarely queried columns. Each index costs storage and write overhead.",
    tags: ["database", "performance", "sql"], favorite: true, createdAt: now,
  },
  {
    id: q(4), area: "backend", difficulty: "mid",
    question: "What is the N+1 query problem and how do you fix it?",
    answer: "N+1 occurs when fetching a list of N records and then issuing 1 extra query per record (e.g., loop fetching user's posts). Fix: eager loading / JOIN queries, DataLoader (batching in GraphQL), or ORM `include`/`preload`. Use query logging to detect it.",
    tags: ["database", "performance", "orm"], createdAt: now,
  },
  {
    id: q(5), area: "backend", difficulty: "mid",
    question: "What are ACID properties in databases?",
    answer: "Atomicity: transaction is all-or-nothing. Consistency: DB moves from one valid state to another. Isolation: concurrent transactions don't interfere. Durability: committed data survives crashes. Postgres is fully ACID; some NoSQL databases trade isolation/consistency for availability/performance.",
    tags: ["database", "transactions"], createdAt: now,
  },
  {
    id: q(6), area: "backend", difficulty: "mid",
    question: "How does JWT authentication work?",
    answer: "1. User logs in → server creates a signed JWT (header.payload.signature) with claims. 2. Client stores it (localStorage or httpOnly cookie). 3. Each request includes the JWT. 4. Server verifies signature using secret/public key — no DB lookup needed. Downside: can't revoke until expiry unless using a token blacklist or short expiry + refresh tokens.",
    tags: ["auth", "jwt", "security"], favorite: true, createdAt: now,
  },
  {
    id: q(7), area: "backend", difficulty: "senior",
    question: "What is database connection pooling and why does it matter?",
    answer: "Opening a DB connection is expensive (TCP handshake, auth, memory). A pool pre-creates N connections and reuses them. Without pooling, every request opens/closes a connection — at scale this exhausts DB connection limits and adds latency. Tools: PgBouncer for Postgres, built-in pool in most ORMs. Configure pool size based on CPU cores × 2 as a starting point.",
    tags: ["database", "performance", "postgres"], createdAt: now,
  },
  {
    id: q(8), area: "backend", difficulty: "senior",
    question: "Explain CAP theorem and its practical implications.",
    answer: "In a distributed system you can only guarantee 2 of 3: Consistency (all nodes see same data), Availability (every request gets a response), Partition tolerance (system works despite network splits). Networks always partition → real choice is CP (Postgres, HBase) vs AP (Cassandra, DynamoDB eventual). Most systems allow tunable consistency.",
    tags: ["distributed-systems", "database"], createdAt: now,
  },
  {
    id: q(9), area: "backend", difficulty: "senior",
    question: "How do you design an API rate limiter?",
    answer: "Common algorithms: Token Bucket (smooth bursts), Fixed Window Counter (simple, boundary spikes), Sliding Window Log (accurate, memory heavy), Sliding Window Counter (good tradeoff). Implementation: Redis INCR + EXPIRE for distributed state. Track by IP or user ID. Return `429 Too Many Requests` with `Retry-After` header. Consider separate limits per endpoint/tier.",
    tags: ["api", "rate-limiting", "redis"], favorite: true, createdAt: now,
  },
  {
    id: q(10), area: "backend", difficulty: "mid",
    question: "What is the difference between optimistic and pessimistic locking?",
    answer: "Pessimistic: lock the row on read (`SELECT FOR UPDATE`), preventing others from modifying until commit. High contention overhead. Optimistic: no lock on read; on write, check a version/timestamp column — if changed, abort and retry. Best when conflicts are rare. Optimistic is used by most ORMs by default.",
    tags: ["database", "concurrency"], createdAt: now,
  },
];
