import { useMemo, useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useForge } from "@/lib/store";
import { QACard } from "@/components/interview/qa-card";
import { QAEditorDialog } from "@/components/interview/qa-editor-dialog";
import { Input } from "@/components/tools/shared";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FocusArea } from "@/types/common";
import type { SkillAreaData, InterviewQuestion } from "@/types/skills";

interface Props {
  data: SkillAreaData;
  triggerAdd?: number;
}

export function InterviewSection({ data, triggerAdd }: Props) {
  const { interviewQuestions, toggleFavoriteInterviewQuestion, deleteInterviewQuestion } =
    useForge();

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<InterviewQuestion | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (triggerAdd) { setEditingQ(null); setDialogOpen(true); }
  }, [triggerAdd]);

  const filteredQs = useMemo(
    () =>
      interviewQuestions
        .filter((q) => q.area === data.id)
        .filter((q) => diff === "all" || q.difficulty === diff)
        .filter((q) => !search || q.question.toLowerCase().includes(search.toLowerCase())),
    [interviewQuestions, data.id, diff, search],
  );

  const toggleExpanded = (id: string) =>
    setExpanded((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const openAdd = () => {
    setEditingQ(null);
    setDialogOpen(true);
  };

  const handleEdit = (q: InterviewQuestion) => {
    setEditingQ(q);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Interview Preparation</h2>
          <p className="text-muted-foreground text-sm">
            Common interview questions and answers for {data.label}.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 shadow-md"
        >
          <Plus className="size-4" /> Add Q&A
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card border border-border p-2 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Q&A bank..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm pl-9 outline-none"
          />
        </div>
        <div className="hidden sm:block h-6 w-px bg-border mx-2" />
        <div className="flex flex-wrap gap-1">
          {["all", "junior", "mid", "senior"].map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-md text-[11px] font-mono border transition-all ${
                diff === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredQs.map((q) => (
          <QACard
            key={q.id}
            item={q}
            isOpen={expanded.has(q.id)}
            onToggle={() => toggleExpanded(q.id)}
            onToggleFavorite={() => toggleFavoriteInterviewQuestion(q.id)}
            onEdit={() => handleEdit(q)}
            onDelete={() => setPendingDeleteId(q.id)}
          />
        ))}
        {filteredQs.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/20">
            <p className="text-sm text-muted-foreground">
              No questions found. Try adjusting your search or difficulty filter.
            </p>
            <button onClick={openAdd} className="mt-4 text-xs text-primary hover:underline">
              Add the first question
            </button>
          </div>
        )}
      </div>

      <QAEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editingQ}
        defaultArea={data.id as FocusArea}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}
        title="Delete question?"
        description="This Q&A will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (pendingDeleteId) deleteInterviewQuestion(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
