import type { SkillAreaData } from "../../../types/skills";
import { Clock, Sparkles, Brain } from "lucide-react";

type SubArea = NonNullable<SkillAreaData["subAreas"]>[number];

export const leadershipSubArea: SubArea = {
  id: "leadership",
  label: "Leadership",
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["leadership"],
  concepts: [
    {
      title: "Lead Without Authority",
      body: "Influence by demonstrating, not directing. Write the first RFC. Build the smallest reference implementation. Volunteer for the boring glue.",
    },
    {
      title: "Delegation",
      body: "Delegate outcomes, not steps. Give context, constraints, and a deadline. Trust the person to choose the path.",
    },
    {
      title: "Run Effective 1:1s",
      body: "Their agenda first, yours second. Weekly cadence, 30 minutes. Notes in a shared doc you both edit — career, blockers, feedback.",
    },
    {
      title: "Radical Candor",
      body: "Care personally + challenge directly. Praise in public, critique in private, always specific and timely.",
    },
  ],
  resources: [
    {
      label: "Extreme Ownership",
      url: "https://echelonfront.com/",
      desc: "Leadership principles from Navy SEALs.",
    },
    {
      label: "The Manager's Path",
      url: "https://www.oreilly.com/",
      desc: "Guide for tech leaders.",
    },
    {
      label: "Radical Candor",
      url: "https://www.radicalcandor.com/",
      desc: "Kim Scott's framework for honest, caring feedback.",
    },
  ],
};

export const timeManagementSubArea: SubArea = {
  id: "time",
  label: "Time Management",
  icon: Clock,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["time", "productivity", "leadership"],
  concepts: [
    {
      title: "Time-Blocking",
      body: "Assign every hour a job before the day starts. Deep work goes in your peak energy window (morning for most). Shallow tasks — email, Slack, meetings — fill the gaps. A blank calendar is not free time, it's stolen time.",
    },
    {
      title: "Eisenhower Matrix",
      body: "Split tasks into 4 quadrants: Urgent+Important (do now), Important+Not Urgent (schedule), Urgent+Not Important (delegate), Neither (eliminate). Most engineers live in quadrant 1 — the goal is to spend more time in quadrant 2.",
    },
    {
      title: "Eat the Frog",
      body: "Do your hardest, most important task first — before email, before Slack. Once the frog is eaten, every other task feels easy. Procrastination feeds on easy wins.",
    },
    {
      title: "Pomodoro Technique",
      body: "25 minutes of focused work, 5-minute break, repeat 4×, then take a longer 20-minute break. Forces single-tasking. The break is not optional — it's when your brain consolidates.",
    },
    {
      title: "Single-Tasking",
      body: "Multitasking is a myth. Context-switching costs ~23 minutes of recovery per interruption. Close unrelated tabs. Put your phone face down. Batch your communication windows.",
    },
    {
      title: "Weekly Review",
      body: "Every Friday: review what shipped, what didn't, and why. Reschedule incomplete high-priority tasks before Monday. 30 minutes of weekly planning saves 5 hours of reactive scrambling.",
    },
  ],
  checklist: [
    { id: "time-block-week", label: "Next week's deep work blocks scheduled" },
    { id: "frog-identified",  label: "Most important task identified for tomorrow" },
    { id: "distractions-blocked", label: "Notifications off during focus sessions" },
    { id: "weekly-review",   label: "Weekly review completed every Friday" },
  ],
  resources: [
    { label: "Deep Work — Cal Newport",       url: "https://calnewport.com/deep-work/",  desc: "The definitive case for focused, distraction-free work and how to cultivate it." },
    { label: "Getting Things Done — David Allen", url: "https://gettingthingsdone.com/", desc: "Trusted productivity system for capturing and processing all your commitments." },
    { label: "The Eisenhower Matrix",          url: "https://todoist.com/productivity-methods/eisenhower-matrix", desc: "Visual guide to the 4-quadrant prioritisation framework." },
  ],
};

export const growthMindsetSubArea: SubArea = {
  id: "growth",
  label: "Growth Mindset",
  icon: Sparkles,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["growth", "mindset", "learning", "leadership"],
  concepts: [
    {
      title: "Fixed vs Growth Mindset",
      body: "Fixed mindset: talent is static, failure is identity. Growth mindset: ability is developed, failure is data. Carol Dweck's research shows growth mindset predicts achievement better than IQ in challenging domains.",
    },
    {
      title: "Embrace Deliberate Discomfort",
      body: "If a task feels easy, you're not growing. Deliberately seek projects slightly above your current level. The stretch zone — not the comfort zone — is where skill is built.",
    },
    {
      title: "Reframe Failure as Feedback",
      body: "'I failed' → 'that approach didn't work — here's why.' Keep a failure log: what happened, what I learned, what I'd do differently. Engineers who embrace this compound faster than those who avoid mistakes.",
    },
    {
      title: "Seek Feedback Actively",
      body: "Don't wait for performance reviews. Ask after every project: 'What's one thing I could have done better?' Specific, frequent feedback accelerates growth faster than annual reviews.",
    },
    {
      title: "The Power of 'Not Yet'",
      body: "Replace 'I can't do X' with 'I can't do X yet.' This tiny word signals to your brain that skill is learnable, not fixed. It maintains motivation through the difficult early phase of any skill.",
    },
  ],
  resources: [
    { label: "Mindset — Carol Dweck", url: "https://www.mindsetonline.com/",   desc: "The original research on fixed vs growth mindset and how it shapes achievement." },
    { label: "Grit — Angela Duckworth", url: "https://angeladuckworth.com/grit-book/", desc: "How passion + perseverance outperforms raw talent over long time horizons." },
  ],
};

export const mentalModelsSubArea: SubArea = {
  id: "mental-models",
  label: "Mental Models",
  icon: Brain,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["mental-models", "thinking", "decision-making"],
  concepts: [
    {
      title: "Inversion",
      body: "Instead of asking 'how do I succeed?', ask 'what guarantees failure?' Then avoid those. Charlie Munger: 'All I want to know is where I'm going to die, so I'll never go there.' Apply to systems: what must never happen in production?",
    },
    {
      title: "First Principles Thinking",
      body: "Break assumptions until you reach physical or logical truths, then build back up. Musk used this to cut rocket costs 10×. Engineers use it to question 'this is how it's always done' — which is usually the wrong reason.",
    },
    {
      title: "Second-Order Thinking",
      body: "Ask 'and then what?' after every decision. First-order: this optimization speeds up the API. Second-order: faster API increases traffic → database becomes the bottleneck. Think two steps ahead before committing.",
    },
    {
      title: "Pareto Principle (80/20)",
      body: "80% of results come from 20% of effort. Identify the 20% of features, fixes, or tasks that produce 80% of value. Cut the rest — or do it last. This is why MVPs beat perfect products in the market.",
    },
    {
      title: "Occam's Razor",
      body: "Among competing explanations, prefer the simplest one that fits the facts. In debugging: check environment variables before assuming cache corruption. In architecture: choose the boring technology before the clever one.",
    },
    {
      title: "Maps Are Not the Territory",
      body: "Your mental model of a system is not the system. Documentation is not the code. The spec is not the user. Constantly test your assumptions against reality — instruments over intuition.",
    },
  ],
  resources: [
    { label: "The Great Mental Models — Farnam Street", url: "https://fs.blog/tgmm/",   desc: "A curated collection of the most useful mental models across disciplines." },
    { label: "Poor Charlie's Almanack",   url: "https://www.stripe.press/poor-charlies-almanack", desc: "Charlie Munger's worldly wisdom through mental models." },
  ],
};
