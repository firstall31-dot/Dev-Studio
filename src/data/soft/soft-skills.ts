/**
 * soft-skills.ts
 * Assembles the full SkillAreaData for the Soft Skills domain by composing
 * individual sub-area files from ./areas/. Add or reorder sub-areas here.
 */
import type { SkillAreaData } from "../../types/skills";
import { Heart } from "lucide-react";
import {
  communicationSubArea,
  speakingSubArea,
  negotiationSubArea,
  leadershipSubArea,
  timeManagementSubArea,
  growthMindsetSubArea,
  mentalModelsSubArea,
  teamworkSubArea,
  conflictSubArea,
  remoteSubArea,
  pairingSubArea,
  codeReviewSubArea,
  continuousLearningSubArea,
  agileSubArea,
  problemSolvingSubArea,
  top10SubArea,
} from "./areas";

export const softSkillsArea: SkillAreaData = {
  id: "softskills",
  label: "Soft Skills",
  icon: Heart,
  description:
    "The human side of engineering — communication, leadership, and emotional intelligence.",
  concepts: [],
  resources: [],
  checklist: [
    { id: "agenda",   label: "Meeting has clear agenda & desired outcome" },
    { id: "feedback", label: "Feedback is specific, behavioral, and timely" },
    { id: "focus",    label: "Deep work blocks scheduled in calendar" },
    { id: "listen",   label: "Repeat back understanding before disagreeing" },
    { id: "write",    label: "Key decisions documented in writing" },
    { id: "delegate", label: "Delegate the 'what', not the 'how'" },
  ],
  subAreas: [
    /* ── Communication ───────────────────────────────── */
    communicationSubArea,
    speakingSubArea,
    negotiationSubArea,
    /* ── Leadership ──────────────────────────────────── */
    leadershipSubArea,
    timeManagementSubArea,
    growthMindsetSubArea,
    mentalModelsSubArea,
    /* ── Teamwork & Process ──────────────────────────── */
    teamworkSubArea,
    conflictSubArea,
    remoteSubArea,
    pairingSubArea,
    codeReviewSubArea,
    continuousLearningSubArea,
    agileSubArea,
    /* ── Problem Solving ─────────────────────────────── */
    problemSolvingSubArea,
    /* ── Interview ───────────────────────────────────── */
    top10SubArea,
  ],
};
