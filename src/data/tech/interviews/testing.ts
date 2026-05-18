import type { InterviewQuestion } from "../../../types/skills";

const now = Date.now();
const q = (i: number) => `iq_ts_${i}`;

export const testingCoreQuestions: InterviewQuestion[] = [
  {
    id: q(1), area: "testing", difficulty: "junior",
    question: "What is the difference between unit, integration, and E2E tests?",
    answer: "Unit: test a single function/class in isolation (mock dependencies). Fast, cheap. Integration: test multiple units working together (DB, external services). Slower, catches interface bugs. E2E: test the full system as a user would (browser, real server). Slow, expensive, most confidence. Follow the Testing Pyramid: many unit, some integration, few E2E.",
    tags: ["testing", "strategy"], favorite: true, createdAt: now,
  },
  {
    id: q(2), area: "testing", difficulty: "junior",
    question: "What is a test double (mock, stub, spy, fake)?",
    answer: "Test doubles replace real dependencies in tests. Stub: returns hardcoded data. Mock: stub + verifies it was called correctly. Spy: wraps real implementation + records calls. Fake: working lightweight implementation (in-memory DB). Use the least powerful double that makes the test meaningful.",
    tags: ["testing", "mocking"], createdAt: now,
  },
  {
    id: q(3), area: "testing", difficulty: "mid",
    question: "What is Test-Driven Development (TDD) and what are its benefits?",
    answer: "TDD: Red → Green → Refactor. Write a failing test first, make it pass minimally, then refactor. Benefits: forces design thinking, creates living documentation, prevents over-engineering (YAGNI), catches regressions immediately. Criticism: slow for exploratory work, can lead to over-testing implementation details.",
    tags: ["tdd", "methodology"], createdAt: now,
  },
  {
    id: q(4), area: "testing", difficulty: "mid",
    question: "What is code coverage and what are its limitations?",
    answer: "Coverage measures % of code lines/branches executed during tests. 100% coverage does NOT mean bug-free — tests may pass without meaningful assertions. It misses: wrong business logic, concurrency bugs, integration failures. Use coverage as a minimum bar (e.g., 80%) to find untested areas, not as a quality metric.",
    tags: ["testing", "coverage", "metrics"], createdAt: now,
  },
  {
    id: q(5), area: "testing", difficulty: "mid",
    question: "How do you test asynchronous code in JavaScript?",
    answer: "1. Return a Promise from the test. 2. Use `async/await`. 3. Use `done` callback (older Jest). 4. Use `vi.useFakeTimers()` / `jest.useFakeTimers()` to control time-based async. 5. For HTTP: use `msw` (Mock Service Worker) to intercept network requests. Always handle rejections — unhandled rejections can silently pass tests.",
    tags: ["javascript", "async", "testing"], createdAt: now,
  },
  {
    id: q(6), area: "testing", difficulty: "mid",
    question: "What is the difference between Vitest and Jest?",
    answer: "Both are JavaScript test runners with similar APIs. Vitest: Vite-native, uses Vite's transform pipeline (fast, ESM-first, no config for modern stacks), watch mode is instant. Jest: mature, wider ecosystem, transpiles via Babel/tsc. For Vite/React projects Vitest is preferred; Jest for legacy CRA/Node projects.",
    tags: ["vitest", "jest", "tooling"], createdAt: now,
  },
  {
    id: q(7), area: "testing", difficulty: "senior",
    question: "How do you approach testing a React component that fetches data?",
    answer: "1. Use `@testing-library/react` (query by accessible role, not implementation). 2. Mock network with `msw` (Mock Service Worker) — intercepts at the network layer, not the fetch function. 3. Use `screen.findBy*` (async) to wait for data to render. 4. Test loading state, success state, and error state. Avoid testing internal state; test what the user sees.",
    tags: ["react", "testing-library", "msw"], favorite: true, createdAt: now,
  },
  {
    id: q(8), area: "testing", difficulty: "senior",
    question: "What is snapshot testing and when should you use or avoid it?",
    answer: "Snapshot tests serialize component output and compare against a stored file. Good for: detecting unintended UI changes in stable components, serializing complex data structures. Avoid when: snapshots are large/unreadable, updated blindly with `--updateSnapshot`, testing implementation details. Prefer explicit assertions for meaningful logic.",
    tags: ["testing", "snapshots", "react"], createdAt: now,
  },
  {
    id: q(9), area: "testing", difficulty: "senior",
    question: "How do you write good E2E tests with Playwright/Cypress?",
    answer: "1. Use `data-testid` or ARIA roles — not CSS selectors. 2. Test critical user journeys, not every edge case. 3. Use fixtures/factories for test data; clean up after each test. 4. Run against a staging env with seeded data. 5. Parallelize across shards. 6. Retry flaky selectors with auto-wait (Playwright does this). 7. Screenshot on failure for debugging.",
    tags: ["e2e", "playwright", "cypress"], favorite: true, createdAt: now,
  },
  {
    id: q(10), area: "testing", difficulty: "mid",
    question: "What is property-based testing?",
    answer: "Instead of example-based tests (specific inputs/outputs), you define properties that should hold for all inputs, and the framework generates hundreds of random inputs to find counterexamples. Tools: fast-check (JS), Hypothesis (Python), QuickCheck (Haskell). Great for: parsers, serializers, algorithms where invariants can be expressed. Hard to write for UIs.",
    tags: ["testing", "property-based"], createdAt: now,
  },
];
