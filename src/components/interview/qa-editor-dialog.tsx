import { useState, useEffect } from "react";
import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useForge, newId } from "@/lib/store";
import { Input, TextArea } from "@/components/tools/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InterviewQuestion } from "@/types/skills";
import type { FocusArea, Difficulty, AnswerDepth } from "@/types/common";
import { DEPTH_LABEL_PRESETS, FOCUS_AREAS, DIFFICULTIES } from "@/constants";

const AREAS = FOCUS_AREAS;
const DIFFS = DIFFICULTIES;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: InterviewQuestion | null;
  defaultArea?: FocusArea;
  defaultTags?: string[];
  defaultCategory?: string;
}

export function QAEditorDialog({
  open,
  onOpenChange,
  editing,
  defaultArea = "general",
  defaultTags = [],
  defaultCategory = "",
}: Props) {
  const { upsertInterviewQuestion } = useForge();

  const blank = (): {
    question: string;
    answer: string;
    area: FocusArea;
    difficulty: Difficulty;
    tags: string;
    category: string;
    depths: AnswerDepth[];
  } => ({
    question: "",
    answer: "",
    area: defaultArea,
    difficulty: "mid",
    tags: defaultTags.join(", "),
    category: defaultCategory,
    depths: [],
  });

  const [form, setForm] = useState(blank());

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          question: editing.question,
          answer: editing.answer,
          area: editing.area,
          difficulty: editing.difficulty,
          tags: editing.tags.join(", "),
          category: editing.category ?? "",
          depths: editing.answerDepths ? editing.answerDepths.map((d) => ({ ...d })) : [],
        });
      } else {
        setForm(blank());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const setField = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addDepth = () =>
    setForm((f) => ({
      ...f,
      depths: [...f.depths, { id: newId("dp"), label: "Deep dive", body: "" }],
    }));

  const updateDepth = (id: string, patch: Partial<AnswerDepth>) =>
    setForm((f) => ({
      ...f,
      depths: f.depths.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));

  const removeDepth = (id: string) =>
    setForm((f) => ({ ...f, depths: f.depths.filter((d) => d.id !== id) }));

  const save = () => {
    if (!form.question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!form.answer.trim()) {
      toast.error("Main answer is required");
      return;
    }
    const q: InterviewQuestion = {
      id: editing?.id ?? newId("iq"),
      question: form.question.trim(),
      answer: form.answer.trim(),
      answerDepths: form.depths.filter((d) => d.body.trim()),
      area: form.area,
      difficulty: form.difficulty,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: form.category.trim() || undefined,
      favorite: editing?.favorite,
      createdAt: editing?.createdAt ?? Date.now(),
    };
    upsertInterviewQuestion(q);
    toast.success(editing ? "Question updated" : "Question added");
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-sm font-semibold">
            {editing ? "Edit question" : "Add new question"}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 flex-1">
          {/* Question */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">
              Question
            </label>
            <TextArea
              value={form.question}
              onChange={(e) => setField("question", e.target.value)}
              rows={2}
              placeholder="e.g. What is the difference between == and === in JavaScript?"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">
                Area
              </label>
              <Select value={form.area} onValueChange={(val) => setField("area", val as FocusArea)}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {AREAS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">
                Difficulty
              </label>
              <Select
                value={form.difficulty}
                onValueChange={(val) => setField("difficulty", val as Difficulty)}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">
                Category
              </label>
              <Input
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                placeholder="e.g. SQL Fundamentals"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">
              Tags (comma separated)
            </label>
            <Input
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="e.g. javascript, closures, scope"
              className="w-full"
            />
          </div>

          {/* Main answer */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <label className="text-[10px] font-mono uppercase tracking-widest text-primary block mb-2">
              Main answer
            </label>
            <TextArea
              value={form.answer}
              onChange={(e) => setField("answer", e.target.value)}
              rows={4}
              placeholder="Write the core answer here…"
              className="w-full bg-card/60 border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Answer depths */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Answer perspectives ({form.depths.length})
              </label>
              <button
                onClick={addDepth}
                className="inline-flex items-center gap-1 text-xs border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 px-2 py-1 rounded transition-colors"
              >
                <Plus className="size-3" /> Add perspective
              </button>
            </div>

            {form.depths.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                Add extra perspectives — deep dives, code examples, common mistakes…
              </p>
            )}

            <div className="space-y-3">
              {form.depths.map((depth, idx) => (
                <div
                  key={depth.id}
                  className="rounded-lg border border-border bg-card p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-3.5 text-muted-foreground/40 shrink-0" />
                    <span className="text-[10px] font-mono text-muted-foreground">#{idx + 1}</span>
                    <Select
                      value={DEPTH_LABEL_PRESETS.includes(depth.label) ? depth.label : "Custom…"}
                      onValueChange={(val) => {
                        if (val !== "Custom…") {
                          updateDepth(depth.id, { label: val });
                        } else {
                          updateDepth(depth.id, { label: "Custom…" });
                        }
                      }}
                    >
                      <SelectTrigger className="flex-1 max-w-[180px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPTH_LABEL_PRESETS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(!DEPTH_LABEL_PRESETS.includes(depth.label) || depth.label === "Custom…") && (
                      <Input
                        value={depth.label === "Custom…" ? "" : depth.label}
                        onChange={(e) => updateDepth(depth.id, { label: e.target.value })}
                        placeholder="Custom label…"
                        className="bg-card border border-border rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring flex-1 h-7"
                      />
                    )}
                    <button
                      onClick={() => removeDepth(depth.id)}
                      className="text-muted-foreground hover:text-destructive ml-auto"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <TextArea
                    value={depth.body}
                    onChange={(e) => updateDepth(depth.id, { body: e.target.value })}
                    rows={3}
                    placeholder={`Write the ${depth.label.toLowerCase()} here…`}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border sticky bottom-0 bg-background">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            {editing ? "Save changes" : "Add question"}
          </button>
        </div>
      </div>
    </div>
  );
}
