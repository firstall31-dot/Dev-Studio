import { useState, useEffect, useRef } from "react";
import { MessageCircle, Edit3, Check, X, Trophy } from "lucide-react";
import { SplitLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import { useForge, newId } from "@/lib/store";
import { useMemo } from "react";
import { SUGGESTED_QUESTIONS, type Scenario, type Question } from "@/data/soft/behavioral";
import {
  QuestionSidebar,
  GuideSection,
  ScenariosSection,
} from "./top10";

/* ─── Main View ──────────────────────────────────────────────── */

export function Top10QuestionsView() {
  const { interviewQuestions, upsertInterviewQuestion, deleteInterviewQuestion } = useForge();

  /* ── Derived question list ───────────────────────────────── */
  const questions = useMemo<Question[]>(() =>
    interviewQuestions
      .filter((q) => q.area === "softskills")
      .map((q) => ({
        id: q.id,
        title: q.question,
        guide: q.answer,
        scenarios: (q.answerDepths as any as Scenario[]) || [],
      })),
    [interviewQuestions],
  );

  /* ── CRUD helpers ────────────────────────────────────────── */
  const addQuestion = (title: string, guide: string) => {
    const id = newId();
    upsertInterviewQuestion({ id, question: title.trim(), answer: guide.trim(), area: "softskills", difficulty: "mid", tags: ["behavioral"], answerDepths: [] as any, isGlobal: false, createdAt: Date.now() });
    return id;
  };

  const removeQuestion = (id: string) => deleteInterviewQuestion(id);

  const updateQuestion = (id: string, patch: Partial<Pick<Question, "title" | "guide">>) => {
    const q = interviewQuestions.find((q) => q.id === id);
    if (!q) return;
    upsertInterviewQuestion({ ...q, ...(patch.title !== undefined && { question: patch.title }), ...(patch.guide !== undefined && { answer: patch.guide }) });
  };

  const addScenario = (qid: string, s: Omit<Scenario, "id" | "createdAt">) => {
    const q = interviewQuestions.find((q) => q.id === qid);
    if (!q) return;
    const sc: Scenario = { ...s, id: `sc-${Date.now()}`, createdAt: Date.now() };
    upsertInterviewQuestion({ ...q, answerDepths: [...(q.answerDepths || []), sc] as any });
  };

  const updateScenario = (qid: string, sid: string, patch: Partial<Omit<Scenario, "id" | "createdAt">>) => {
    const q = interviewQuestions.find((q) => q.id === qid);
    if (!q) return;
    upsertInterviewQuestion({ ...q, answerDepths: (q.answerDepths || []).map((s: any) => s.id === sid ? { ...s, ...patch } : s) as any });
  };

  const removeScenario = (qid: string, sid: string) => {
    const q = interviewQuestions.find((q) => q.id === qid);
    if (!q) return;
    upsertInterviewQuestion({ ...q, answerDepths: (q.answerDepths || []).filter((s: any) => s.id !== sid) as any });
  };

  const addSuggested = (s: (typeof SUGGESTED_QUESTIONS)[number]) => {
    if (questions.some((q) => q.id === s.id)) return s.id;
    upsertInterviewQuestion({ id: s.id, question: s.title, answer: s.guide, area: "softskills", difficulty: "mid", tags: ["behavioral"], answerDepths: [] as any, isGlobal: false, createdAt: Date.now() });
    return s.id;
  };

  /* ── UI state ────────────────────────────────────────────── */
  const [activeId, setActiveId]               = useState<string>(questions[0]?.id ?? "");
  const [search, setSearch]                   = useState("");
  const [showAddQ, setShowAddQ]               = useState(false);
  const [editingTitle, setEditingTitle]       = useState(false);
  const [titleDraft, setTitleDraft]           = useState("");
  const [editingGuide, setEditingGuide]       = useState(false);
  const [guideDraft, setGuideDraft]           = useState("");
  const [guideOpen, setGuideOpen]             = useState(true);
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [confirmDeleteQ, setConfirmDeleteQ]   = useState<string | null>(null);
  const [confirmDeleteS, setConfirmDeleteS]   = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const active = questions.find((q) => q.id === activeId) ?? questions[0] ?? null;

  useEffect(() => {
    if (!active && questions.length > 0) setActiveId(questions[0].id);
  }, [questions]);

  const filtered    = questions.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()));
  const addedIds    = new Set(questions.map((q) => q.id));
  const suggestions = SUGGESTED_QUESTIONS.filter((s) => !addedIds.has(s.id));

  /* title inline edit */
  const startEditTitle = () => {
    if (!active) return;
    setTitleDraft(active.title);
    setEditingTitle(true);
    setTimeout(() => titleRef.current?.focus(), 50);
  };
  const saveTitle = () => {
    if (active && titleDraft.trim()) updateQuestion(active.id, { title: titleDraft.trim() });
    setEditingTitle(false);
  };

  /* delete question with confirmation */
  const handleDeleteQ = (id: string) => {
    const q = questions.find((x) => x.id === id);
    if (!q) return;
    if (q.scenarios.length === 0 && confirmDeleteQ !== id) {
      removeQuestion(id);
      if (activeId === id) setActiveId(questions.find((x) => x.id !== id)?.id ?? "");
      return;
    }
    if (confirmDeleteQ === id) {
      removeQuestion(id);
      if (activeId === id) setActiveId(questions.find((x) => x.id !== id)?.id ?? "");
      setConfirmDeleteQ(null);
    } else {
      setConfirmDeleteQ(id);
    }
  };

  /* ── Render ──────────────────────────────────────────────── */
  const sidebar = (
    <QuestionSidebar
      filtered={filtered}
      suggestions={suggestions}
      activeId={activeId}
      search={search}
      showAddQ={showAddQ}
      confirmDeleteQ={confirmDeleteQ}
      onSearchChange={setSearch}
      onToggleAddForm={() => { setShowAddQ((v) => !v); setConfirmDeleteQ(null); }}
      onSelectQuestion={(id) => { setActiveId(id); setConfirmDeleteQ(null); setShowAddScenario(false); setEditingScenarioId(null); }}
      onSaveNewQuestion={(t, g) => { const id = addQuestion(t, g); setActiveId(id); setShowAddQ(false); }}
      onDeleteQuestion={handleDeleteQ}
      onCancelDelete={() => setConfirmDeleteQ(null)}
      onAddSuggested={(s) => { const id = addSuggested(s); setActiveId(id); }}
    />
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[260px]">
      <div className="h-full flex flex-col overflow-hidden">
        {!active ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="size-12 rounded-2xl bg-primary/10 grid place-items-center text-primary mx-auto">
                <Trophy className="size-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">No questions yet</p>
              <p className="text-xs text-muted-foreground">Add a question or pick one from the suggestions.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Question header */}
            <div className="px-5 pt-5 pb-4 border-b border-border/60 shrink-0">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0 mt-0.5">
                  <MessageCircle className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  {editingTitle ? (
                    <div className="flex items-center gap-2">
                      <input
                        ref={titleRef}
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
                        className="flex-1 bg-muted/40 border border-primary/40 rounded-xl px-3 py-1.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                      <button onClick={saveTitle} className="size-7 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-all">
                        <Check className="size-3.5" />
                      </button>
                      <button onClick={() => setEditingTitle(false)} className="size-7 rounded-lg text-muted-foreground hover:bg-muted/60 flex items-center justify-center transition-all">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <h2 className="text-base font-bold text-foreground leading-snug flex-1">{active.title}</h2>
                      <button onClick={startEditTitle} className="size-6 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/60 transition-all shrink-0 mt-0.5" title="Edit title">
                        <Edit3 className="size-3" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {active.scenarios.length === 0
                      ? "No scenarios prepared yet"
                      : `${active.scenarios.length} scenario${active.scenarios.length !== 1 ? "s" : ""} prepared`}
                  </p>
                </div>
              </div>
            </div>

            {/* Main scrollable area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="p-5 space-y-6 max-w-3xl mx-auto">
                <GuideSection
                  guide={active.guide}
                  guideOpen={guideOpen}
                  editingGuide={editingGuide}
                  guideDraft={guideDraft}
                  onToggleOpen={() => setGuideOpen((v) => !v)}
                  onStartEdit={() => { setGuideDraft(active.guide); setEditingGuide(true); setGuideOpen(true); }}
                  onDraftChange={setGuideDraft}
                  onSave={() => { updateQuestion(active.id, { guide: guideDraft }); setEditingGuide(false); }}
                  onCancel={() => setEditingGuide(false)}
                />

                <ScenariosSection
                  questionId={active.id}
                  scenarios={active.scenarios}
                  showAddScenario={showAddScenario}
                  editingScenarioId={editingScenarioId}
                  confirmDeleteS={confirmDeleteS}
                  onAddScenario={(data) => addScenario(active.id, data)}
                  onUpdateScenario={(sid, data) => updateScenario(active.id, sid, data)}
                  onDeleteScenario={(sid) => removeScenario(active.id, sid)}
                  onShowAdd={() => setShowAddScenario(true)}
                  onHideAdd={() => setShowAddScenario(false)}
                  onSetEditing={setEditingScenarioId}
                  onSetConfirmDelete={setConfirmDeleteS}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </SplitLayout>
  );
}
