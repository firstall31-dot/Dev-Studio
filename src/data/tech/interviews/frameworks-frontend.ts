import type { InterviewQuestion } from "../../../types/skills";

const now = Date.now();
const qv = (i: number) => `iqx_vue_${i}`;
const qs = (i: number) => `iqx_svelte_${i}`;
const qn = (i: number) => `iqx_next_${i}`;

/** Vue.js interview questions */
export const vueQuestions: InterviewQuestion[] = [
  {
    id: qv(1), area: "frontend", difficulty: "mid", category: "Vue.js",
    question: "What is the difference between Vue's Composition API and Options API?",
    answer: "Options API: organizes code by options (data, methods, computed, watch) — familiar but logic for one feature is scattered. Composition API (Vue 3): organizes code by logical concern using `setup()` and composables (reusable functions). Better TypeScript support, easier to extract/reuse logic. Both work in Vue 3; Composition API is recommended for new projects.",
    tags: ["vue", "composition-api", "options-api"], favorite: true, createdAt: now,
  },
  {
    id: qv(2), area: "frontend", difficulty: "mid", category: "Vue.js",
    question: "How does Vue 3's reactivity system work?",
    answer: "Vue 3 uses ES Proxy for reactivity. `reactive()` wraps an object in a Proxy that intercepts get/set to track dependencies and trigger updates. `ref()` wraps primitives in an object with a `.value` getter/setter. `computed()` creates lazy, cached derived values. `watch()` and `watchEffect()` run side effects when dependencies change. The tracking is automatic — accessing a reactive value inside a computed/watchEffect registers it as a dependency.",
    tags: ["vue", "reactivity", "proxy"], createdAt: now,
  },
  {
    id: qv(3), area: "frontend", difficulty: "junior", category: "Vue.js",
    question: "What is Pinia and why is it preferred over Vuex?",
    answer: "Pinia is the official Vue state management library (successor to Vuex). Benefits over Vuex: no mutations (just actions and state), full TypeScript support out of the box, simpler API (no namespaced modules), devtools support, composables-based design. Store: `defineStore('id', { state: () => ({}), getters: {}, actions: {} })`. Lightweight and tree-shakeable.",
    tags: ["vue", "pinia", "state-management"], createdAt: now,
  },
  {
    id: qv(4), area: "frontend", difficulty: "junior", category: "Vue.js",
    question: "What are Vue's key directives and what do they do?",
    answer: "v-if/v-else/v-else-if: conditionally renders (removes from DOM). v-show: toggles CSS display. v-for: list rendering (always add :key). v-bind (:): dynamically binds attributes/props. v-on (@): attaches event listeners. v-model: two-way data binding. v-slot: scoped slots. Rule: use v-show for frequent toggles (no DOM recreate); v-if for infrequent/conditional rendering.",
    tags: ["vue", "directives"], createdAt: now,
  },
  {
    id: qv(5), area: "frontend", difficulty: "mid", category: "Vue.js",
    question: "What is the difference between computed properties and watchers in Vue?",
    answer: "Computed: declarative derived values, cached until dependencies change, returns a value, use for derived UI data. Watch: imperative side effects when a value changes, no return value, use when you need to perform async operations or call APIs in response to state change. watchEffect: runs immediately and re-runs when any reactive dependency changes. Prefer computed over watch when possible.",
    tags: ["vue", "computed", "watch"], createdAt: now,
  },
];

/** Svelte interview questions */
export const svelteQuestions: InterviewQuestion[] = [
  {
    id: qs(1), area: "frontend", difficulty: "mid", category: "Svelte",
    question: "How does Svelte fundamentally differ from React and Vue?",
    answer: "Svelte is a compiler, not a runtime framework. It compiles components to highly optimized vanilla JavaScript at build time — no virtual DOM, no runtime diffing. Updates are surgical direct DOM operations. Results: smaller bundle size, faster runtime performance, no overhead. Tradeoff: smaller ecosystem, no runtime introspection, compilation step required.",
    tags: ["svelte", "compiler", "performance"], favorite: true, createdAt: now,
  },
  {
    id: qs(2), area: "frontend", difficulty: "mid", category: "Svelte",
    question: "What are Svelte stores and how do they enable state sharing?",
    answer: "Svelte stores are observable objects with a subscribe method. Built-ins: writable(value), readable(value, start), derived(stores, fn). Any store can be used in any component — not just Svelte. The `$` prefix auto-subscribes and unsubscribes: `$count` in a template subscribes automatically. Custom stores wrap writable with additional logic. No provider/context needed for global state.",
    tags: ["svelte", "stores", "state"], createdAt: now,
  },
  {
    id: qs(3), area: "frontend", difficulty: "mid", category: "Svelte",
    question: "What are Svelte 5 Runes?",
    answer: "Runes (Svelte 5) replace the compiler magic with explicit reactive primitives: `$state()` for reactive state, `$derived()` for computed values, `$effect()` for side effects, `$props()` for component props. More explicit than Svelte 4's implicit reactivity (assigning to a variable = reactive). Better TypeScript support and clearer reactivity semantics. Similar intent to Vue's ref/computed/watchEffect but compiler-powered.",
    tags: ["svelte", "runes", "svelte5"], createdAt: now,
  },
];

/** Next.js interview questions */
export const nextjsQuestions: InterviewQuestion[] = [
  {
    id: qn(1), area: "frontend", difficulty: "mid", category: "Next.js",
    question: "What is the difference between App Router and Pages Router in Next.js?",
    answer: "Pages Router (Next.js < 13): file-based routing in /pages, getServerSideProps/getStaticProps for data fetching, all components are client-side by default. App Router (Next.js 13+): file-based routing in /app, React Server Components by default, co-located layouts/loading/error files, Server Actions for mutations, streaming with Suspense. App Router is the recommended path for new projects.",
    tags: ["nextjs", "app-router", "pages-router"], favorite: true, createdAt: now,
  },
  {
    id: qn(2), area: "frontend", difficulty: "mid", category: "Next.js",
    question: "What are React Server Components (RSC) and how do they differ from Client Components?",
    answer: "Server Components render exclusively on the server — they can fetch data directly (DB, APIs), import server-only modules, and never ship their code to the client. Client Components (`'use client'`) run in the browser and can use hooks, event handlers, browser APIs. RSCs can render Client Components but not vice versa. RSCs reduce JS bundle size and enable direct data access without API layers.",
    tags: ["nextjs", "rsc", "server-components"], createdAt: now,
  },
  {
    id: qn(3), area: "frontend", difficulty: "mid", category: "Next.js",
    question: "What is Incremental Static Regeneration (ISR) in Next.js?",
    answer: "ISR lets you create or update static pages after build time without a full rebuild. Configure with `revalidate` in App Router (`export const revalidate = 60`). On-demand revalidation via `revalidatePath()` or `revalidateTag()`. Pages are served from cache and regenerated in the background when stale. Best for: e-commerce product pages, blog posts, dashboards that tolerate slight staleness.",
    tags: ["nextjs", "isr", "ssg", "caching"], createdAt: now,
  },
  {
    id: qn(4), area: "frontend", difficulty: "mid", category: "Next.js",
    question: "What are Server Actions in Next.js?",
    answer: "Server Actions (Next.js 14+) are async functions that run on the server, callable from Client Components. Decorated with `'use server'`. Used for form submissions, mutations, database writes — eliminating the need for API routes for simple mutations. They integrate with React's form action pattern, support progressive enhancement, and can be used with `useFormState` / `useFormStatus` hooks.",
    tags: ["nextjs", "server-actions", "mutations"], createdAt: now,
  },
];
