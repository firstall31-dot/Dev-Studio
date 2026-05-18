import type { SkillAreaData } from "../../../types/skills";
import { Swords, Wifi, Terminal, GitPullRequest, RefreshCw, Repeat2 } from "lucide-react";

type SubArea = NonNullable<SkillAreaData["subAreas"]>[number];

export const teamworkSubArea: SubArea = {
  id: "teamwork",
  label: "Teamwork",
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["teamwork"],
  concepts: [
    {
      title: "Psychological Safety",
      body: "Reward 'I don't know' and 'I was wrong'. Punish blame, not mistakes.",
    },
    {
      title: "Assume Positive Intent",
      body: "Default to 'they had a reason' instead of 'they're an idiot'. Ask before you assume — 90% of the time it's missing context, not malice.",
    },
    {
      title: "Shared Ownership",
      body: "The team ships the feature, not the individual. Rotate ownership of modules so no single person is a bus factor.",
    },
  ],
  resources: [
    { label: "The Five Dysfunctions of a Team", url: "https://www.tablegroup.com/product/dysfunctions/", desc: "Patrick Lencioni's model for building trust and accountability." },
    { label: "Team Topologies",                 url: "https://teamtopologies.com/",                      desc: "Organising teams for fast flow of change." },
  ],
};

export const conflictSubArea: SubArea = {
  id: "conflict",
  label: "Conflict Resolution",
  icon: Swords,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["conflict", "teamwork"],
  concepts: [
    {
      title: "Separate People from Problems",
      body: "Attack the issue, not the person. 'This approach has a flaw' vs 'your idea is bad'. Keeps conversations productive.",
    },
    {
      title: "Identify Interests, Not Positions",
      body: "Ask 'why do you want that?' instead of debating 'what'. Shared interests often exist beneath opposing positions.",
    },
    {
      title: "Blameless Post-Mortems",
      body: "Focus on systems and processes that allowed a mistake, not the person who made it. Culture of learning over culture of fear.",
    },
    {
      title: "The Crucial Conversation Framework",
      body: "Notice when a conversation turns crucial (stakes + emotions + differing opinions). Create safety, share your path, explore others' paths.",
    },
    {
      title: "Disagree in Private, Align in Public",
      body: "Raise concerns before the decision is made, in the right forum. Once the team decides, present a unified front to stakeholders.",
    },
  ],
  resources: [
    { label: "Crucial Conversations",    url: "https://cruciallearning.com/",     desc: "Tools for high-stakes disagreements." },
    { label: "Nonviolent Communication", url: "https://www.cnvc.org/",            desc: "Empathy-first framework for resolving tension." },
    { label: "Getting to Yes",           url: "https://www.pon.harvard.edu/",     desc: "Harvard negotiation project — principled conflict resolution." },
  ],
};

export const remoteSubArea: SubArea = {
  id: "remote",
  label: "Remote Collaboration",
  icon: Wifi,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["remote", "async", "teamwork"],
  concepts: [
    {
      title: "Async by Default",
      body: "Write it down before scheduling a meeting. Loom + Notion + Slack threads handle 80% of communication without synchronous cost.",
    },
    {
      title: "Overlap Hours Are Sacred",
      body: "Protect shared working hours for critical discussions and pairing. Everything else is async.",
    },
    {
      title: "Over-Communicate Context",
      body: "Remote removes hallway conversations. Add 'why' to every decision. Leave a trail of context in tickets, PRs, and docs.",
    },
    {
      title: "Camera On for Hard Conversations",
      body: "Tone is lost in text. Difficult feedback, disagreements, and 1:1s deserve a video call where facial cues are visible.",
    },
    {
      title: "Document Decisions, Not Just Outcomes",
      body: "Record what you decided AND why you rejected alternatives. Future teammates won't repeat the same discussions.",
    },
  ],
  resources: [
    { label: "GitLab Remote Playbook", url: "https://handbook.gitlab.com/handbook/company/culture/all-remote/", desc: "Industry-leading async remote culture guide." },
    { label: "Basecamp — Shape Up",    url: "https://basecamp.com/shapeup",                                     desc: "Async-first product development at scale." },
  ],
};

export const pairingSubArea: SubArea = {
  id: "pairing",
  label: "Pair Programming",
  icon: Terminal,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["pairing", "mob-programming", "teamwork"],
  concepts: [
    {
      title: "Driver / Navigator Pattern",
      body: "Driver types, navigator thinks ahead and reviews. Swap every 15–25 min with a timer. Never let one person drive for an hour.",
    },
    {
      title: "Strong-Style Pairing",
      body: "'For an idea to go from your head into the computer, it must go through someone else's hands.' The navigator holds all decisions.",
    },
    {
      title: "Mob Programming",
      body: "Whole team on one keyboard, one screen, rotating driver every few minutes. Extreme knowledge sharing — nothing gets siloed. Use for onboarding and complex problems.",
    },
    {
      title: "When to Pair",
      body: "Complex architecture decisions, debugging gnarly issues, onboarding new team members, or spreading knowledge of a critical system. Don't pair on trivial tasks — it's expensive.",
    },
  ],
  resources: [
    { label: "Martin Fowler — Pair Programming", url: "https://martinfowler.com/articles/on-pair-programming.html", desc: "Exhaustive guide to pairing styles, benefits, and practical patterns." },
  ],
};

export const codeReviewSubArea: SubArea = {
  id: "code-review",
  label: "Code Review",
  icon: GitPullRequest,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["code-review", "pr", "feedback"],
  concepts: [
    {
      title: "Review Intent, Then Implementation",
      body: "First check: does this PR do the right thing? Then: is it done the right way? A well-written PR that solves the wrong problem should be blocked, not merged and refactored.",
    },
    {
      title: "Nit vs Blocking",
      body: "Label comments: 'nit:' (take it or leave it), 'suggestion:' (worth considering), 'blocking:' (must fix). Reviewers who block on every nit slow teams and breed resentment.",
    },
    {
      title: "Small PRs",
      body: "A PR with 50 lines gets real review. A PR with 500 lines gets a rubber stamp. Break work into reviewable chunks. Feature flags let you merge incomplete features safely.",
    },
    {
      title: "Author Responsibility",
      body: "Don't submit PRs that you wouldn't review. Write a clear description — what, why, how to test. Add screenshots for UI changes. Make the reviewer's job easy.",
    },
  ],
};

export const continuousLearningSubArea: SubArea = {
  id: "continuous-learning",
  label: "Continuous Learning",
  icon: RefreshCw,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["learning", "growth", "career"],
  concepts: [
    {
      title: "Deliberate Practice",
      body: "Reading about programming ≠ practicing programming. Build things at the edge of your ability. Katas, side projects, and open source contributions beat passive consumption.",
    },
    {
      title: "T-Shaped Skills",
      body: "Go deep in one area (your specialisation) while maintaining breadth across others (system design, testing, communication). Specialists who understand context are far more valuable.",
    },
    {
      title: "Public Learning",
      body: "Write about what you learn — blog posts, tweets, internal RFCs. Teaching forces clarity. It builds your reputation and helps others. The best engineers give more than they take.",
    },
    {
      title: "The 20% Rule",
      body: "Protect 20% of your time for learning, experimentation, and technical exploration. If you're always in delivery mode, you'll stagnate. Learning is not optional — it's part of the job.",
    },
  ],
};

export const agileSubArea: SubArea = {
  id: "agile",
  label: "Agile / Scrum",
  icon: Repeat2,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["agile", "scrum", "teamwork", "process"],
  concepts: [
    {
      title: "Sprint Planning",
      body: "Agree on the sprint goal before picking tickets. The goal is a commitment, not a to-do list. Each item should have a clear Definition of Done. Velocity is a planning tool — not a performance metric.",
    },
    {
      title: "Daily Standup",
      body: "What did I do yesterday? What am I doing today? What's blocking me? Keep it under 15 minutes — it's a sync, not a status report. If discussion is needed, take it offline with the relevant people.",
    },
    {
      title: "Retrospectives",
      body: "The most underrated ceremony. Keep / Try / Drop format or Start / Stop / Continue. Safety to speak honestly is more important than the format. The retro only has value if actions are tracked and followed through.",
    },
    {
      title: "Definition of Done",
      body: "A shared checklist that every piece of work must pass before 'done' is declared: code reviewed, tests passing, deployed to staging, documentation updated. Without DoD, 'done' means nothing.",
    },
    {
      title: "Kanban vs Scrum",
      body: "Scrum: time-boxed sprints, roles (PO, SM), planning ceremonies — good for product teams with regular delivery cadence. Kanban: continuous flow, WIP limits — good for ops, support, or maintenance teams. Know which your team actually runs.",
    },
    {
      title: "The Agile Manifesto Values",
      body: "Individuals & interactions over processes & tools. Working software over comprehensive documentation. Customer collaboration over contract negotiation. Responding to change over following a plan. Most teams cargo-cult the ceremonies and miss the values.",
    },
  ],
  checklist: [
    { id: "sprint-goal-clear",    label: "Sprint goal defined before picking tickets" },
    { id: "dod-written",          label: "Definition of Done written and agreed by the team" },
    { id: "retro-actions-tracked",label: "Retro action items tracked across sprints" },
    { id: "standup-under-15",     label: "Daily standup kept under 15 minutes" },
  ],
  resources: [
    { label: "Agile Manifesto",        url: "https://agilemanifesto.org/",          desc: "The original 4 values and 12 principles — read before anything else." },
    { label: "Scrum Guide",            url: "https://scrumguides.org/",             desc: "The official, free Scrum Guide by Schwaber & Sutherland." },
    { label: "Shape Up — Basecamp",    url: "https://basecamp.com/shapeup",         desc: "An alternative to Scrum for async-first product teams." },
  ],
};

export const problemSolvingSubArea: SubArea = {
  id: "problem-solving",
  label: "Problem Solving",
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["problem-solving"],
  concepts: [
    {
      title: "First Principles",
      body: "Strip the problem to physical/logical truths. Rebuild from there. Avoid 'this is how we always do it' as a solution.",
    },
    {
      title: "5 Whys",
      body: "Ask 'why' five times to drive past symptoms to root cause. Pairs well with blameless post-mortems.",
    },
    {
      title: "Rubber Duck",
      body: "Explain the problem out loud to a duck (or a colleague who isn't even listening). The act of verbalizing exposes the gap.",
    },
    {
      title: "Inversion",
      body: "Instead of 'how do I succeed?', ask 'what guarantees failure?' — then avoid those. Often a faster path to the answer.",
    },
  ],
};
