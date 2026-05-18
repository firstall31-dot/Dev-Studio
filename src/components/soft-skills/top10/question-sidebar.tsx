import { Trophy, Plus, X, Search, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Question } from "@/constants";
import { SUGGESTED_QUESTIONS } from "@/constants";
import { AddQuestionForm } from "./add-question-form";

interface QuestionSidebarProps {
  filtered: Question[];
  suggestions: (typeof SUGGESTED_QUESTIONS)[number][];
  activeId: string;
  search: string;
  showAddQ: boolean;
  confirmDeleteQ: string | null;
  onSearchChange: (v: string) => void;
  onToggleAddForm: () => void;
  onSelectQuestion: (id: string) => void;
  onSaveNewQuestion: (title: string, guide: string) => void;
  onDeleteQuestion: (id: string) => void;
  onCancelDelete: () => void;
  onAddSuggested: (s: (typeof SUGGESTED_QUESTIONS)[number]) => void;
}

export function QuestionSidebar({
  filtered,
  suggestions,
  activeId,
  search,
  showAddQ,
  confirmDeleteQ,
  onSearchChange,
  onToggleAddForm,
  onSelectQuestion,
  onSaveNewQuestion,
  onDeleteQuestion,
  onCancelDelete,
  onAddSuggested,
}: QuestionSidebarProps) {
  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-3 py-3 border-b border-border/60 shrink-0 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
            <Trophy className="size-3.5" />
          </div>
          <span className="flex-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 truncate">
            Questions
          </span>
          <button
            onClick={onToggleAddForm}
            title="Add Question"
            className="size-6 rounded-lg flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-all"
          >
            {showAddQ ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter questions…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {showAddQ && (
        <AddQuestionForm
          onSave={onSaveNewQuestion}
          onCancel={onToggleAddForm}
        />
      )}

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin space-y-3">
        {/* My Questions */}
        <div>
          <p className="px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            My Questions
            <span className="ml-1 text-muted-foreground/40">({filtered.length})</span>
          </p>
          <nav className="space-y-0.5">
            {filtered.map((q) => {
              const isActive  = activeId === q.id;
              const isConfirm = confirmDeleteQ === q.id;
              return (
                <div
                  key={q.id}
                  className={cn(
                    "group flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                  onClick={() => onSelectQuestion(q.id)}
                >
                  <span className={cn("flex-1 truncate", isActive ? "text-foreground" : "")}>{q.title}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {q.scenarios.length > 0 && (
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full tabular-nums",
                        isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground/60",
                      )}>
                        {q.scenarios.length}
                      </span>
                    )}
                    {isConfirm ? (
                      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onDeleteQuestion(q.id)}
                          className="size-5 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all"
                          title="Confirm delete"
                        >
                          <Check className="size-2.5" />
                        </button>
                        <button
                          onClick={onCancelDelete}
                          className="size-5 rounded flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-all"
                        >
                          <X className="size-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteQuestion(q.id); }}
                        className="size-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete question"
                      >
                        <Trash2 className="size-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-[10px] text-center text-muted-foreground py-4 italic">No questions match</p>
            )}
          </nav>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <p className="px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
              Suggestions
            </p>
            <nav className="space-y-0.5">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onAddSuggested(s)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground/60 hover:bg-muted/40 hover:text-muted-foreground transition-all group"
                >
                  <Plus className="size-3 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="truncate text-left">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
