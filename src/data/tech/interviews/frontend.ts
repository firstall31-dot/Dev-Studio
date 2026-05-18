import type { InterviewQuestion } from "../../../types/skills";

const now = Date.now();
const q = (i: number) => `iq_fe_${i}`;

export const frontendCoreQuestions: InterviewQuestion[] = [
  {
    id: q(1), area: "frontend", difficulty: "junior",
    question: "What is the difference between `==` and `===` in JavaScript?",
    answer: "`==` performs type coercion before comparing, so `'5' == 5` is `true`. `===` (strict equality) compares both value AND type without coercion, so `'5' === 5` is `false`. Always prefer `===` to avoid subtle bugs.",
    tags: ["javascript", "basics"], createdAt: now,
  },
  {
    id: q(2), area: "frontend", difficulty: "junior",
    question: "What is the CSS box model?",
    answer: "Every element is a rectangular box composed of: Content → Padding → Border → Margin. `box-sizing: border-box` makes width/height include padding and border, which is usually what you want. Default `content-box` excludes them.",
    tags: ["css", "layout"], createdAt: now,
  },
  {
    id: q(3), area: "frontend", difficulty: "mid",
    question: "Explain React's reconciliation algorithm (Virtual DOM diffing).",
    answer: "React maintains a virtual DOM tree. On state/prop change it creates a new vDOM and diffs it against the previous one (O(n) heuristic). It assumes elements of different types produce different trees; uses `key` to identify list items across renders. Minimal patches are applied to the real DOM.",
    tags: ["react", "performance"], createdAt: now,
  },
  {
    id: q(4), area: "frontend", difficulty: "mid",
    question: "What are React hooks rules and why do they exist?",
    answer: "1. Only call hooks at the top level — not inside loops, conditions, or nested functions. 2. Only call hooks from React function components or custom hooks. These rules exist because React relies on call order to associate hook state with a component instance across renders.",
    tags: ["react", "hooks"], createdAt: now,
  },
  {
    id: q(5), area: "frontend", difficulty: "mid",
    question: "What is event delegation in JavaScript?",
    answer: "Instead of attaching a listener to every child element, attach one listener to a parent and use `event.target` to identify which child triggered it. Leverages bubbling. More memory-efficient for large lists (e.g., click handler on `<ul>` instead of every `<li>`).",
    tags: ["javascript", "events", "performance"], createdAt: now,
  },
  {
    id: q(6), area: "frontend", difficulty: "mid",
    question: "What is the difference between `useMemo` and `useCallback`?",
    answer: "`useMemo` memoizes the *result* of a function call. `useCallback` memoizes the *function reference itself*. Use `useCallback` when passing a stable callback to a memoized child component; use `useMemo` for expensive computed values. Both take a dependency array.",
    tags: ["react", "performance", "hooks"], favorite: true, createdAt: now,
  },
  {
    id: q(7), area: "frontend", difficulty: "senior",
    question: "How do you optimize a React app with thousands of list items?",
    answer: "1. Windowing/virtualization (react-window, TanStack Virtual) — only render visible rows. 2. Memoize list items with `React.memo`. 3. Stable keys. 4. Avoid anonymous functions in JSX that create new references. 5. Move state as low as possible to limit re-render scope. 6. Use transitions (`startTransition`) for non-urgent updates.",
    tags: ["react", "performance", "virtualization"], createdAt: now,
  },
  {
    id: q(8), area: "frontend", difficulty: "senior",
    question: "Explain the Critical Rendering Path and how to optimize it.",
    answer: "Browser: HTML → DOM, CSS → CSSOM → Render Tree → Layout → Paint → Composite. Optimizations: defer non-critical JS, inline critical CSS, use `preload` for fonts/key assets, reduce render-blocking resources, minimize layout thrashing (batch DOM reads/writes), use `will-change` or `transform` for composited animations.",
    tags: ["performance", "browser", "css"], createdAt: now,
  },
  {
    id: q(9), area: "frontend", difficulty: "senior",
    question: "What is hydration in SSR/SSG frameworks and what are hydration mismatches?",
    answer: "Hydration is the process of attaching React's event listeners and state to server-rendered HTML. A mismatch occurs when the client-rendered output differs from the server HTML (e.g., using `Date.now()` or `window` on server). Mismatches cause React to re-render the entire tree client-side, defeating SSR performance benefits. Solutions: `suppressHydrationWarning`, dynamic imports, or deferring browser-only code to `useEffect`.",
    tags: ["ssr", "react", "next.js"], favorite: true, createdAt: now,
  },
  {
    id: q(10), area: "frontend", difficulty: "mid",
    question: "What is CSS specificity and how is it calculated?",
    answer: "Specificity determines which CSS rule wins conflicts. Calculated as (a, b, c): a = inline styles (1,0,0), b = IDs (0,1,0), c = classes/pseudo-classes/attributes (0,0,1), elements/pseudo-elements (0,0,1 too). Higher specificity wins; same specificity → last in source wins. `!important` overrides all (avoid it).",
    tags: ["css"], createdAt: now,
  },
];
