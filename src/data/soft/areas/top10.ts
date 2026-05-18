import type { SkillAreaData } from "../../../types/skills";
import { Trophy } from "lucide-react";

type SubArea = NonNullable<SkillAreaData["subAreas"]>[number];

export const top10SubArea: SubArea = {
  id: "top-10",
  label: "Top 10 Questions",
  icon: Trophy,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["interview", "hr", "behavioral", "career"],
  concepts: [
    {
      title: "Tell Me About Yourself",
      body: "Use the Present → Past → Future formula. Present: your current role and what you deliver. Past: the experience that made you effective at it. Future: why this role is the next logical step. Keep it under 2 minutes. Never start with your university — start with your value.",
    },
    {
      title: "What Is Your Greatest Strength?",
      body: "Pick ONE specific strength. Back it with a concrete example (STAR: Situation, Task, Action, Result). Connect it directly to the role you're interviewing for. 'I'm a hard worker' is a red flag — 'I debug complex distributed systems quickly' is a strength.",
    },
    {
      title: "What Is Your Greatest Weakness?",
      body: "Avoid fake weaknesses ('I work too hard'). Pick a real one that you're actively improving. Framework: name the weakness → show self-awareness → show what you've done to address it → show evidence of improvement. Example: 'I used to underestimate how long tasks take. I now time-box every task and track actual vs estimated — my estimates are within 20% now.'",
    },
    {
      title: "Why Do You Want to Work Here?",
      body: "This question tests whether you researched the company. Answer requires: (1) something specific about their product/mission/culture that genuinely excites you, (2) how your skills connect to their current challenges, (3) what you want to learn or build there. 'Good salary' is never the answer — even if it's true.",
    },
    {
      title: "Where Do You See Yourself in 5 Years?",
      body: "They're not asking for a career plan — they're asking: will you leave in 6 months, and do you have ambition? Answer: show growth ambition within the domain (not 'your job'). 'I want to go deeper in distributed systems and eventually lead architecture decisions for high-scale products' is strong. 'I want to be a manager' is fine if it fits the role.",
    },
    {
      title: "How Do You Manage Your Time and Priorities?",
      body: "Name a real system you use (time-blocking, Eisenhower Matrix, weekly review). Give a specific example of how it helped you deliver in a crunch. Interviewers are checking whether you are self-organised or chaotic.",
    },
    {
      title: "Tell Me About a Conflict With a Colleague",
      body: "Use STAR. Choose a conflict where you were wrong or partly wrong — it shows self-awareness. Focus on how you resolved it, what you learned, and what changed in your working relationship. Never blame the other person.",
    },
    {
      title: "What's Your Biggest Failure?",
      body: "Pick a real one — something that mattered. Structure: what happened, what your role was, what you did to address it, and crucially — what you changed as a result. A failure with no lesson learned is a red flag. A failure with a clear lesson is a strength signal.",
    },
    {
      title: "Why Are You Leaving Your Current Role?",
      body: "Never badmouth the current employer — it signals you'll badmouth this one too. Acceptable: 'I've grown as much as I can here, I want a new challenge.' 'The company direction changed.' 'I want to work at this scale.' Keep it forward-looking.",
    },
    {
      title: "Do You Have Any Questions for Us?",
      body: "Always have 3 prepared. Best questions: 'What does success look like in this role after 90 days?' 'What's the biggest challenge the team is facing right now?' 'How does engineering interact with product and design?' These signal you're serious. 'How much vacation do I get?' signals you're already planning to leave.",
    },
  ],
};
