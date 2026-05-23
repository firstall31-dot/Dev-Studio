/**
 * Seed data for AI conversations and messages.
 * conversations table has no userId — it is global.
 * Each entry in seedConversations pairs with seedMessages entries.
 */

export const seedConversations = [
  {
    title: "Explain microservices vs monolith",
  },
  {
    title: "How to optimise PostgreSQL queries?",
  },
  {
    title: "TypeScript generics deep dive",
  },
  {
    title: "System design: design a URL shortener",
  },
  {
    title: "React 19 new features overview",
  },
];

export const seedMessagesForConversations: Array<{
  conversationIndex: number;
  role: "user" | "assistant";
  content: string;
}> = [
  // Conv 0 — Microservices vs Monolith
  {
    conversationIndex: 0,
    role: "user",
    content: "Can you explain the trade-offs between microservices and monolithic architecture?",
  },
  {
    conversationIndex: 0,
    role: "assistant",
    content:
      "Great question! Here's a concise comparison:\n\n**Monolith**\n- Single deployable unit — simpler to develop and debug initially\n- Easy shared memory and transactions\n- Scales as one unit (vertical or horizontal)\n- Becomes unwieldy as the codebase grows\n\n**Microservices**\n- Independent, small services each owning a domain\n- Deploy, scale, and update each service independently\n- Fault isolation — one service crashing doesn't kill the whole app\n- Complexity: you now manage networking, distributed tracing, service discovery, and eventual consistency\n\n**Rule of thumb**: Start with a well-structured monolith. Extract services when a specific domain has distinct scaling or team ownership needs. Premature microservices is a common pain point.",
  },
  {
    conversationIndex: 0,
    role: "user",
    content: "What's the best way to split a monolith when the time comes?",
  },
  {
    conversationIndex: 0,
    role: "assistant",
    content:
      "The Strangler Fig pattern is widely recommended:\n\n1. **Identify bounded contexts** — Use domain-driven design to find natural seams (e.g. auth, payments, notifications)\n2. **Build the new service** alongside the monolith, NOT replacing it yet\n3. **Route traffic** — Use a gateway or feature flag to gradually redirect calls to the new service\n4. **Delete the old code** once the new service is proven stable\n\nStart with the most independently deployable piece (often something like email/notification service) to build confidence before tackling core domains.",
  },

  // Conv 1 — PostgreSQL optimisation
  {
    conversationIndex: 1,
    role: "user",
    content: "My PostgreSQL queries are slow. Where do I start?",
  },
  {
    conversationIndex: 1,
    role: "assistant",
    content:
      "Start with `EXPLAIN ANALYZE` — it gives you the actual execution plan:\n\n```sql\nEXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)\nSELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;\n```\n\nLook for:\n- **Seq Scan** on large tables → missing index\n- **Nested Loop** on large sets → could need a hash join\n- **High rows estimate vs actual** → stale statistics (run `ANALYZE`)\n\n**Quick wins:**\n1. Add indexes on columns in WHERE/JOIN/ORDER BY\n2. Use partial indexes for filtered queries\n3. Avoid `SELECT *` in hot paths\n4. Enable `pg_stat_statements` to find your slowest queries automatically",
  },
  {
    conversationIndex: 1,
    role: "user",
    content: "When should I use a partial index?",
  },
  {
    conversationIndex: 1,
    role: "assistant",
    content:
      "Use a partial index when your queries consistently filter on a low-cardinality condition:\n\n```sql\n-- Only index active users (ignores the 90% that are deleted)\nCREATE INDEX idx_users_active_email\nON users (email)\nWHERE deleted_at IS NULL;\n\n-- Only index pending orders\nCREATE INDEX idx_orders_pending_created\nON orders (created_at DESC)\nWHERE status = 'pending';\n```\n\nBenefits: smaller index size, faster writes, and the planner prefers it when the WHERE clause matches. Perfect for soft-delete patterns or status-filtered dashboards.",
  },

  // Conv 2 — TypeScript generics
  {
    conversationIndex: 2,
    role: "user",
    content: "I'm confused about TypeScript generics. Can you show me practical examples?",
  },
  {
    conversationIndex: 2,
    role: "assistant",
    content:
      "Generics let you write reusable code that preserves type information. Here are the most useful patterns:\n\n**1. Generic function**\n```typescript\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst n = first([1, 2, 3]); // type: number\nconst s = first(['a', 'b']); // type: string\n```\n\n**2. Constrained generics**\n```typescript\nfunction getLength<T extends { length: number }>(value: T): number {\n  return value.length;\n}\n```\n\n**3. Generic API response wrapper**\n```typescript\ninterface ApiResponse<T> {\n  data: T;\n  error: string | null;\n  status: number;\n}\n\nasync function fetchUser(): Promise<ApiResponse<User>> { ... }\n```\n\n**4. keyof + generics (very practical)**\n```typescript\nfunction pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n  return Object.fromEntries(keys.map(k => [k, obj[k]])) as Pick<T, K>;\n}\n```\n\nGeneric constraints with `extends` are where 80% of the real-world power comes from.",
  },

  // Conv 3 — URL Shortener
  {
    conversationIndex: 3,
    role: "user",
    content: "Walk me through designing a URL shortener like bit.ly",
  },
  {
    conversationIndex: 3,
    role: "assistant",
    content:
      "This is a classic system design question. Here's the full breakdown:\n\n**Requirements**\n- Shorten a URL → get a 6-8 char alias\n- Redirect alias → original URL (< 10 ms)\n- Scale: 100M URLs, 10B redirects/month\n\n**Core components**\n1. **ID generation** — Use base62 encoding of a distributed counter (Snowflake ID) → avoids collisions without coordination overhead\n2. **Database** — PostgreSQL for URL mappings. Schema: `id, short_code, original_url, user_id, clicks, expires_at, created_at`\n3. **Cache** — Redis in front of DB for the hot read path. TTL = 24h. Cache-aside pattern.\n4. **Redirect service** — Stateless API servers behind a load balancer. Lookup Redis → if miss, hit DB → 301/302 redirect\n\n**Scaling reads**\n- Read replicas for the DB\n- CDN for geographically distributed redirects\n- Redis cluster for cache sharding\n\n**Custom aliases & analytics**\nAdd a `custom_alias` column with a unique index. Track click events asynchronously via a queue (Kafka/SQS) → analytics DB.",
  },

  // Conv 4 — React 19
  {
    conversationIndex: 4,
    role: "user",
    content: "What are the most important new features in React 19?",
  },
  {
    conversationIndex: 4,
    role: "assistant",
    content:
      "React 19 ships several major improvements:\n\n**1. Actions**\nAsync functions that handle pending states, errors, and optimistic updates automatically. Works with `useActionState`, `useFormStatus`, and `useOptimistic`.\n\n```tsx\nfunction UpdateName() {\n  const [error, submitAction, isPending] = useActionState(\n    async (prev, formData) => {\n      const error = await updateName(formData.get('name'));\n      return error;\n    }, null\n  );\n  return <form action={submitAction}>...</form>;\n}\n```\n\n**2. `use()` hook**\nRead a Promise or Context inside render. Pairs with Suspense for data fetching without useEffect.\n\n**3. Server Components (stable)**\nRender on the server, ship zero JS to the client for that component.\n\n**4. `ref` as a prop**\nNo more `forwardRef` wrapper — just pass `ref` directly.\n\n**5. Document metadata**\nRender `<title>`, `<meta>`, and `<link>` directly in any component — React hoists them to `<head>` automatically.\n\nThe Actions API is the biggest shift for forms and mutations — it replaces a lot of manual `useState` + `useEffect` patterns.",
  },
];
