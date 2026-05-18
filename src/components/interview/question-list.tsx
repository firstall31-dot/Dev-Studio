import { useState, useMemo } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import { Search, ChevronRight, Sparkles, Plus, GraduationCap } from "lucide-react";
import { SplitLayout } from "../layout";
import { useForge } from "@/lib/store";
import { QAEditorDialog } from "./qa-editor-dialog";
import type { FocusArea } from "@/types/common";
import type { InterviewQuestion } from "@/types/skills";
import { DIFFICULTIES, DOMAINS } from "@/constants";

export function QuestionList() {
  const { interviewQuestions, deleteInterviewQuestion, toggleFavoriteInterviewQuestion } = useForge();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>("frontend");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<InterviewQuestion | null>(null);

  const filtered = useMemo(() => {
    return interviewQuestions.filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.answer.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = !difficulty || q.difficulty === difficulty;
      const matchesDomain = q.area === domain || q.category === domain;
      return matchesSearch && matchesDifficulty && matchesDomain;
    });
  }, [interviewQuestions, search, difficulty, domain]);
  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 10);

  const handleAdd = () => {
    setEditingQ(null);
    setDialogOpen(true);
  };

  const handleEdit = (q: InterviewQuestion) => {
    setEditingQ(q);
    setDialogOpen(true);
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2.5 border-b border-border/60 shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
            <GraduationCap className="size-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Questions ({interviewQuestions.length})
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(difficulty === d ? null : d)}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider border transition-all ${
                difficulty === d
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        <p className="px-3 pt-1 pb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
          Domains
        </p>
        {DOMAINS.map((d) => {
          const Icon = d.icon;
          const active = domain === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setDomain(d.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="size-3.5 shrink-0" />
                {d.label}
              </div>
              {active && <ChevronRight className="size-3.5" />}
            </button>
          );
        })}
      </nav>

      <div className="p-2 pt-0 shrink-0">
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 text-xs font-semibold transition-colors border border-primary/20"
        >
          <Plus className="size-3.5" /> Add Question
        </button>
      </div>
    </div>
  );

  return (
    <>
      <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[260px]">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                {filtered.length} Questions Found
              </h3>
            </div>
            {paged.map((q) => (
              <article
                key={q.id}
                className="group rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-all hover:shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-1.5 py-0.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider bg-primary/10 text-primary">
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {DOMAINS.find((d) => d.id === q.area || d.id === q.category)?.label || q.area}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                        {q.question}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(q)}
                        className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed border border-border/50">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70">
                      <Sparkles className="size-3" /> Sample Answer
                    </div>
                    {q.answer}
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border/60">
                <Search className="size-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-sm text-muted-foreground mb-3">
                  No questions found matching your criteria.
                </p>
                <button
                  onClick={handleAdd}
                  className="text-xs font-semibold uppercase tracking-wider border border-border px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors"
                >
                  Add the first question for this domain
                </button>
              </div>
            )}
            <ListPagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} className="mt-4" />
          </div>
        </div>
      </SplitLayout>

      <QAEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editingQ}
        defaultArea={domain as FocusArea}
      />
    </>
  );
}
