import type { SkillAreaData } from "../../../types/skills";
import { Mic, Handshake } from "lucide-react";

type SubArea = NonNullable<SkillAreaData["subAreas"]>[number];

export const communicationSubArea: SubArea = {
  id: "communication",
  label: "Communication",
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["communication"],
  concepts: [
    {
      title: "Active Listening",
      body: "Repeat back what you heard before responding. Ask clarifying questions. In code review, comment on intent before style.",
    },
    {
      title: "Async Writing",
      body: "Lead with the conclusion (BLUF). Use bullet points for scanability. Record decisions and 'why' — future you will thank you.",
    },
    {
      title: "Technical Storytelling",
      body: "Frame trade-offs as 'option A buys X but costs Y'. Use diagrams for systems. Anchor numbers (latency, cost) before opinions.",
    },
    {
      title: "Stakeholder Translation",
      body: "Translate engineering jargon into business outcomes. 'Refactor' → 'reduces incident frequency'. 'Tech debt' → 'slowing feature velocity 30%'.",
    },
    {
      title: "1:1 Conversations",
      body: "Show up with one topic, not a status report. Ask open questions ('what's draining you?'). Silence is a tool — let people finish their thought.",
    },
    {
      title: "Disagree & Commit",
      body: "State your objection once, clearly, with evidence. If the team chooses otherwise, commit fully — no sabotage, no 'I told you so'.",
    },
    {
      title: "Written Standups",
      body: "Yesterday / Today / Blockers — kept under 5 lines. Tag people you need from. Async beats a 30-minute meeting for 6 people.",
    },
  ],
  resources: [
    {
      label: "Nonviolent Communication",
      url: "https://www.cnvc.org/",
      desc: "The foundational framework for empathy.",
    },
    {
      label: "Crucial Conversations",
      url: "https://cruciallearning.com/",
      desc: "Tools for talking when stakes are high.",
    },
    {
      label: "Never Split the Difference",
      url: "https://www.blackswanltd.com/",
      desc: "Tactical empathy and negotiation by an ex-FBI hostage negotiator.",
    },
  ],
};

export const speakingSubArea: SubArea = {
  id: "speaking",
  label: "Public Speaking",
  icon: Mic,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["speaking", "presentations", "talks"],
  concepts: [
    {
      title: "Open With a Hook",
      body: "First 30 seconds decide whether the room listens. Start with a surprising number, a sharp question, or a 1-sentence story — never with 'My name is...'.",
    },
    {
      title: "Rule of Three",
      body: "Group ideas in threes: 3 problems, 3 reasons, 3 takeaways. The brain remembers triplets and forgets lists of seven.",
    },
    {
      title: "Slow Down, Then Slow Down Again",
      body: "Nerves push you to 1.5x speed. Mark deliberate pauses on your slides. A 2-second silence after a key point lands harder than any animation.",
    },
    {
      title: "Demo Discipline",
      body: "Record a backup video. Pre-stage data. Zoom your terminal to 18pt+. Never type a password on stage — paste from a notes file.",
    },
    {
      title: "Q&A Without Panic",
      body: "Repeat the question (buys time, helps the room). 'I don't know — I'll follow up' is a strong answer. Park hostile threads: 'great topic, let's chat after'.",
    },
  ],
  resources: [
    {
      label: "Talk Like TED",
      url: "https://www.ted.com/playlists",
      desc: "Watch 3 talks in your domain, copy what works, drop what doesn't.",
    },
    {
      label: "Presentation Zen",
      url: "https://presentationzen.com/",
      desc: "Slide design philosophy that kills bullet-heavy decks.",
    },
  ],
};

export const negotiationSubArea: SubArea = {
  id: "negotiation",
  label: "Negotiation",
  icon: Handshake,
  color: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-primary/30",
  tags: ["negotiation", "influence"],
  concepts: [
    {
      title: "Anchor First",
      body: "Whoever names the first number shapes the range. Research market data, then open at the high end of reasonable.",
    },
    {
      title: "Trade, Don't Concede",
      body: "Never give without getting. 'I can do that deadline if scope drops feature X' beats 'sure, no problem'.",
    },
    {
      title: "BATNA",
      body: "Know your Best Alternative To a Negotiated Agreement. If you have no walk-away option, you're not negotiating — you're begging.",
    },
  ],
};
