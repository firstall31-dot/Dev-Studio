const now = Date.now();

export interface SnippetSeed {
  id: string;
  title: string;
  language: string;
  description: string;
  code: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export const seedSnippets: SnippetSeed[] = [
  {
    id: "s_1",
    title: "Drizzle ORM Connection",
    language: "typescript",
    description: "Postgres database connection using Drizzle with connection pooling.",
    code: `import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool);`,
    tags: ["postgres", "drizzle", "database"],
    createdAt: now - 86400000 * 12,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: "s_2",
    title: "Dockerfile — Next.js Standalone",
    language: "dockerfile",
    description: "Slim multi-stage build for Next.js standalone output.",
    code: `FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]`,
    tags: ["docker", "nextjs", "devops"],
    createdAt: now - 86400000 * 30,
    updatedAt: now - 86400000 * 14,
  },
  {
    id: "s_3",
    title: "Drizzle Schema — Users Table",
    language: "typescript",
    description: "Production-ready Drizzle users table with audit columns.",
    code: `import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;`,
    tags: ["typescript", "schema", "drizzle"],
    createdAt: now - 86400000 * 18,
    updatedAt: now - 86400000 * 6,
  },
  {
    id: "s_4",
    title: "useDebounce Hook",
    language: "typescript",
    description: "Generic debounce hook for search inputs and expensive operations.",
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage:
// const debouncedSearch = useDebounce(searchTerm, 400);`,
    tags: ["react", "hooks", "typescript", "performance"],
    createdAt: now - 86400000 * 8,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "s_5",
    title: "JWT Auth Middleware — Express",
    language: "typescript",
    description: "Express middleware that validates JWT tokens from cookies or Authorization header.",
    code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}`,
    tags: ["express", "jwt", "auth", "middleware"],
    createdAt: now - 86400000 * 22,
    updatedAt: now - 86400000 * 5,
  },
  {
    id: "s_6",
    title: "Zod API Request Validator",
    language: "typescript",
    description: "Express middleware factory for validating request body with a Zod schema.",
    code: `import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    req.body = result.data;
    next();
  };
}

// Usage:
// const CreatePostSchema = z.object({ title: z.string().min(1), body: z.string() });
// router.post('/posts', validateBody(CreatePostSchema), createPost);`,
    tags: ["zod", "express", "validation", "typescript"],
    createdAt: now - 86400000 * 15,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: "s_7",
    title: "React Query — Paginated Fetch",
    language: "typescript",
    description: "TanStack Query hook for cursor-based paginated data fetching.",
    code: `import { useInfiniteQuery } from '@tanstack/react-query';

interface Page<T> {
  data: T[];
  nextCursor: string | null;
}

export function usePaginatedList<T>(
  key: string[],
  fetcher: (cursor?: string) => Promise<Page<T>>
) {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => fetcher(pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}`,
    tags: ["react-query", "typescript", "pagination", "react"],
    createdAt: now - 86400000 * 11,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: "s_8",
    title: "GitHub Actions — CI Pipeline",
    language: "yaml",
    description: "Full CI workflow with type-check, lint, test, and build on PRs.",
    code: `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build`,
    tags: ["github-actions", "ci", "devops", "yaml"],
    createdAt: now - 86400000 * 35,
    updatedAt: now - 86400000 * 7,
  },
  {
    id: "s_9",
    title: "Zustand Store with Persistence",
    language: "typescript",
    description: "Zustand store with localStorage persistence and devtools.",
    code: `import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  setTheme: (theme: SettingsState['theme']) => void;
  toggleSidebar: () => void;
  reset: () => void;
}

const defaults = { theme: 'dark' as const, sidebarCollapsed: false };

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        ...defaults,
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () =>
          set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
        reset: () => set(defaults),
      }),
      { name: 'app-settings' }
    )
  )
);`,
    tags: ["zustand", "react", "typescript", "state"],
    createdAt: now - 86400000 * 9,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: "s_10",
    title: "TanStack Router — Protected Route",
    language: "typescript",
    description: "File-based protected route that redirects unauthenticated users.",
    code: `import { createFileRoute, redirect } from '@tanstack/react-router';
import { getSession } from '@/lib/auth';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }

    return { user: session.user };
  },
});`,
    tags: ["tanstack-router", "auth", "react", "typescript"],
    createdAt: now - 86400000 * 6,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: "s_11",
    title: "Async Error Boundary — React",
    language: "typescript",
    description: "Class-based error boundary that catches async render errors and shows fallback UI.",
    code: `import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error) {
      return this.props.fallback?.(error, this.reset) ?? (
        <div className="p-6 text-center text-destructive">
          <p className="font-semibold">Something went wrong</p>
          <button onClick={this.reset} className="mt-2 text-sm underline">
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
    tags: ["react", "typescript", "error-handling"],
    createdAt: now - 86400000 * 20,
    updatedAt: now - 86400000 * 8,
  },
  {
    id: "s_12",
    title: "Rate Limiter — Express",
    language: "typescript",
    description: "Per-route rate limiter using express-rate-limit with Redis or in-memory store.",
    code: `import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again in 15 minutes.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many login attempts. Please try again in an hour.',
  },
});

// Usage:
// app.use('/api', apiLimiter);
// app.post('/api/auth/login', authLimiter, loginHandler);`,
    tags: ["express", "security", "rate-limiting", "typescript"],
    createdAt: now - 86400000 * 25,
    updatedAt: now - 86400000 * 10,
  },

  // ── NEW SNIPPETS ─────────────────────────────────────────────────────────

  {
    id: "s_13",
    title: "useLocalStorage Hook",
    language: "typescript",
    description: "Type-safe React hook for synced localStorage state with SSR safety.",
    code: `import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('[useLocalStorage] set error:', error);
      }
    },
    [key, storedValue]
  );

  const remove = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, remove] as const;
}`,
    tags: ["react", "hooks", "localStorage", "typescript"],
    createdAt: now - 86400000 * 7,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "s_14",
    title: "SSE Streaming — Express Route",
    language: "typescript",
    description: "Server-Sent Events endpoint for streaming AI or long-running responses.",
    code: `import { Router, Request, Response } from 'express';

const router = Router();

router.post('/stream', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data: object) => {
    res.write(\`data: \${JSON.stringify(data)}\n\n\`);
  };

  try {
    // Example: stream chunks from any async source
    for await (const chunk of generateStream(prompt)) {
      if (res.destroyed) break;
      sendEvent({ type: 'chunk', content: chunk });
    }
    sendEvent({ type: 'done' });
  } catch (err) {
    sendEvent({ type: 'error', message: 'Stream failed' });
  } finally {
    res.end();
  }
});

// Client-side usage:
// const es = new EventSource('/stream');
// es.onmessage = (e) => { const data = JSON.parse(e.data); };`,
    tags: ["express", "sse", "streaming", "typescript"],
    createdAt: now - 86400000 * 5,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: "s_15",
    title: "Drizzle Relations — One-to-Many",
    language: "typescript",
    description: "Drizzle ORM schema with one-to-many relations and cascade deletes.",
    code: `import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceRelations = relations(workspaces, ({ many }) => ({
  projects: many(projects),
}));

export const projectRelations = relations(projects, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
}));

// Query with join:
// const ws = await db.query.workspaces.findFirst({
//   where: eq(workspaces.id, id),
//   with: { projects: true },
// });`,
    tags: ["drizzle", "postgres", "relations", "typescript"],
    createdAt: now - 86400000 * 10,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: "s_16",
    title: "useFetch — Typed API Hook",
    language: "typescript",
    description: "Lightweight fetch hook with loading, error, and abort controller support.",
    code: `import { useState, useEffect, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ data: null, loading: true, error: null });

    fetch(url, { ...options, signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
        return res.json() as Promise<T>;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}`,
    tags: ["react", "fetch", "hooks", "typescript"],
    createdAt: now - 86400000 * 6,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: "s_17",
    title: "OpenAI Streaming — Node.js",
    language: "typescript",
    description: "Streams OpenAI chat completions and pipes chunks to an SSE response.",
    code: `import OpenAI from 'openai';
import { Request, Response } from 'express';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function streamCompletion(req: Request, res: Response) {
  const { messages, model = 'gpt-5' } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
    max_completion_tokens: 8192,
  });

  let fullContent = '';

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? '';
    if (delta) {
      fullContent += delta;
      res.write(\`data: \${JSON.stringify({ delta, done: false })}\n\n\`);
    }
  }

  res.write(\`data: \${JSON.stringify({ delta: '', done: true, full: fullContent })}\n\n\`);
  res.end();
}`,
    tags: ["openai", "streaming", "typescript", "express"],
    createdAt: now - 86400000 * 4,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: "s_18",
    title: "Tailwind CVA Variants",
    language: "typescript",
    description: "Component with type-safe variants using class-variance-authority.",
    code: `import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-6 text-sm',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';`,
    tags: ["react", "tailwind", "cva", "typescript"],
    createdAt: now - 86400000 * 8,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "s_19",
    title: "Redis Cache Wrapper",
    language: "typescript",
    description: "Type-safe Redis cache with get/set/del and TTL support using ioredis.",
    code: `import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
});

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = 3600
  ): Promise<T> {
    const cached = await cache.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await fetcher();
    await cache.set(key, fresh, ttlSeconds);
    return fresh;
  },
};

// Usage:
// const user = await cache.getOrSet(\`user:\${id}\`, () => db.query.users.findFirst(...), 300);`,
    tags: ["redis", "cache", "typescript", "performance"],
    createdAt: now - 86400000 * 13,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: "s_20",
    title: "Drizzle Paginated Query",
    language: "typescript",
    description: "Cursor-based pagination helper for Drizzle ORM queries.",
    code: `import { db } from './db';
import { sql, eq, lt, desc } from 'drizzle-orm';
import { posts } from './schema';

interface PageResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function getPaginatedPosts(
  userId: string,
  cursor?: string,
  limit = 20
): Promise<PageResult<typeof posts.$inferSelect>> {
  const rows = await db
    .select()
    .from(posts)
    .where(
      cursor
        ? sql\`\${posts.userId} = \${userId} AND \${posts.createdAt} < \${new Date(cursor)}\`
        : eq(posts.userId, userId)
    )
    .orderBy(desc(posts.createdAt))
    .limit(limit + 1); // fetch one extra to check hasMore

  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;
  const lastItem = data[data.length - 1];

  return {
    data,
    hasMore,
    nextCursor: hasMore && lastItem ? lastItem.createdAt.toISOString() : null,
  };
}`,
    tags: ["drizzle", "postgres", "pagination", "typescript"],
    createdAt: now - 86400000 * 9,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "s_21",
    title: "useKeyboardShortcut Hook",
    language: "typescript",
    description: "Declarative keyboard shortcut handler with modifier key support.",
    code: `import { useEffect, useCallback } from 'react';

type ModifierKey = 'ctrl' | 'meta' | 'shift' | 'alt';

interface ShortcutOptions {
  modifiers?: ModifierKey[];
  enabled?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: ShortcutOptions = {}
) {
  const { modifiers = [], enabled = true } = options;

  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const modifierMatch = modifiers.every((mod) => {
        if (mod === 'ctrl') return e.ctrlKey;
        if (mod === 'meta') return e.metaKey;
        if (mod === 'shift') return e.shiftKey;
        if (mod === 'alt') return e.altKey;
        return false;
      });

      if (modifierMatch && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback(e);
      }
    },
    [key, callback, modifiers, enabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handler]);
}

// Usage:
// useKeyboardShortcut('k', openSearch, { modifiers: ['meta'] });
// useKeyboardShortcut('Escape', closeModal);`,
    tags: ["react", "hooks", "keyboard", "typescript"],
    createdAt: now - 86400000 * 5,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: "s_22",
    title: "Vitest Setup — Integration Tests",
    language: "typescript",
    description: "Vitest config and setup for Express integration tests with a real test database.",
    code: `// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 30000,
  },
});

// tests/setup.ts
import { pool, db } from '../src/db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL!;
  await migrate(db, { migrationsFolder: './drizzle' });
});

afterAll(async () => {
  await pool.end();
});

// tests/api/posts.test.ts
import request from 'supertest';
import app from '../../src/app';
import { db } from '../../src/db';
import { posts } from '../../src/schema';

describe('POST /api/posts', () => {
  afterEach(async () => {
    await db.delete(posts);
  });

  it('creates a post and returns 201', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Hello', body: 'World' })
      .set('Authorization', \`Bearer \${testToken}\`);

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Hello');
  });
});`,
    tags: ["vitest", "testing", "express", "typescript"],
    createdAt: now - 86400000 * 11,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: "s_23",
    title: "Framer Motion — Page Transitions",
    language: "typescript",
    description: "Smooth page enter/exit animations with Framer Motion AnimatePresence.",
    code: `import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from '@tanstack/react-router';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.18,
};

export function AnimatedPage({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="flex-1 flex flex-col min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Stagger children animation
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export const fadeUpItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};`,
    tags: ["framer-motion", "react", "animation", "typescript"],
    createdAt: now - 86400000 * 7,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "s_24",
    title: "Environment Variables — Zod Validation",
    language: "typescript",
    description: "Validates all environment variables at startup with typed access and helpful error messages.",
    code: `import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  OPENAI_API_KEY: z.string().startsWith('sk-', 'Invalid OpenAI API key format').optional(),
  REDIS_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5000'),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([field, msgs]) => \`  ❌ \${field}: \${msgs?.join(', ')}\`)
      .join('\n');
    throw new Error(\`Invalid environment variables:\n\${messages}\`);
  }
  return result.data;
}

export const env = parseEnv();

// Usage:
// import { env } from './env';
// const port = env.PORT; // fully typed`,
    tags: ["zod", "typescript", "environment", "validation"],
    createdAt: now - 86400000 * 4,
    updatedAt: now - 86400000 * 1,
  },
];
