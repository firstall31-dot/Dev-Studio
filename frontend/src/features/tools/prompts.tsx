import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForge, fillVariables, newId } from "@/lib/store";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import { Sparkles, Star, Copy, Plus, Trash2, History, Search, Brain, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Prompt } from "@/types/tools";
import { Field, Input, TextArea } from "./shared";
import { SplitLayout } from "../../components/layout";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Model registry ────────────────────────────────────────────────────────────

interface ModelOption {
  id: string;
  label: string;
  provider: "openai" | "anthropic" | "google";
  thinking?: boolean;
  fast?: boolean;
}

const MODELS: ModelOption[] = [
  { id: "gpt-5", label: "GPT-5", provider: "openai", fast: true },
  { id: "gpt-5-mini", label: "GPT-5 Mini", provider: "openai", fast: true },
  { id: "o3", label: "o3 (Thinking)", provider: "openai", thinking: true },
  { id: "o4-mini", label: "o4-mini (Thinking)", provider: "openai", thinking: true, fast: true },
  { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "anthropic" },
  { id: "claude-3.7-sonnet", label: "Claude 3.7 Sonnet", provider: "anthropic", thinking: true },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "google", thinking: true },
];

const PROVIDER_BADGE: Record<ModelOption["provider"], string> = {
  openai: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  anthropic: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  google: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Prompts({ selectedId }: { selectedId?: string }) {
  const navigate = useNavigate({ from: "/tools" });
  useSearch({ from: "/tools" });
  const { prompts, upsertPrompt, deletePrompt, toggleFavoritePrompt, incrementPromptUsage } =
    useForge();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(prompts.map((p) => p.category)))],
    [prompts],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return prompts
      .filter((p) => (category === "All" ? true : p.category === category))
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [prompts, query, category]);
  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 15);

  const selected = selectedId ? prompts.find((p) => p.id === selectedId) : filtered[0];
  const selectedModel = MODELS.find((m) => m.id === selected?.model) ?? null;

  const select = (pid: string) => navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, id: pid }) });

  const create = () => {
    const p: Prompt = {
      id: newId("p"),
      title: "Untitled prompt",
      description: "",
      category: "System Prompts",
      tags: [],
      body: "Write your prompt here. Use {{variable}} placeholders.",
      variables: [],
      model: "gpt-5",
      usageCount: 0,
      versions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertPrompt(p);
    select(p.id);
    toast.success("Prompt created");
  };

  const updateSelected = (patch: Partial<Prompt>) => {
    if (!selected) return;
    const next: Prompt = { ...selected, ...patch, updatedAt: Date.now() };
    if (patch.body !== undefined) {
      const vars = Array.from(
        new Set([...patch.body.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1])),
      );
      next.variables = vars;
    }
    upsertPrompt(next);
  };

  const usePrompt = () => {
    if (!selected) return;
    const filled = fillVariables(selected.body, varValues);
    navigator.clipboard.writeText(filled);
    incrementPromptUsage(selected.id);
    toast.success("Prompt copied to clipboard");
  };

  const handleDelete = () => {
    if (!selected) return;
    deletePrompt(selected.id);
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, id: undefined }) });
    toast.success("Prompt deleted");
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2.5 border-b border-border/60 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
              <Sparkles className="size-3.5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
              Prompts ({prompts.length})
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter prompts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider border transition-all ${
                category === c
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ul className="overflow-y-auto scrollbar-thin p-2 space-y-0.5 flex-1">
        {paged.map((p) => {
          const active = selected?.id === p.id;
          const mdl = MODELS.find((m) => m.id === p.model);
          return (
            <li key={p.id}>
              <button
                onClick={() => select(p.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-lg font-semibold uppercase tracking-wider ${
                      active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.category}
                  </span>
                  {mdl?.thinking && (
                    <Brain className="size-3 text-violet-400 shrink-0" />
                  )}
                  {p.favorite && <Star className="size-3 text-amber-400 fill-amber-400 ml-auto" />}
                </div>
                <p
                  className={`text-xs font-medium leading-snug truncate ${active ? "text-foreground" : ""}`}
                >
                  {p.title}
                </p>
                <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                  {p.description || "No description"}
                </p>
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-10 text-xs text-muted-foreground text-center border border-dashed border-border/60 rounded-xl m-1">
            No prompts found.
          </li>
        )}
      </ul>
      <ListPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />
      <div className="p-2 pt-0 shrink-0">
        <button
          onClick={create}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 text-xs font-semibold transition-colors border border-primary/20"
        >
          <Plus className="size-3.5" /> New Prompt
        </button>
      </div>
    </div>
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[260px]">
      {selected ? (
        <section className="overflow-y-auto scrollbar-thin h-full">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <Input
                  value={selected.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                  className="text-2xl font-semibold tracking-tight bg-transparent border-none p-0 focus:ring-0"
                />
                <Input
                  value={selected.description}
                  onChange={(e) => updateSelected({ description: e.target.value })}
                  placeholder="Add a short description…"
                  className="text-sm text-muted-foreground bg-transparent border-none p-0 focus:ring-0 mt-1"
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto mt-2 sm:mt-0">
                <button
                  onClick={() => toggleFavoritePrompt(selected.id)}
                  className="p-2 rounded-xl border border-border hover:bg-muted/60"
                  title="Favorite"
                >
                  <Star
                    className={`size-4 ${selected.favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                  />
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="p-2 rounded-xl border border-border hover:bg-destructive/10 hover:border-destructive/40"
                  title="Delete"
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs">
              <Field label="Category">
                <Input
                  value={selected.category}
                  onChange={(e) => updateSelected({ category: e.target.value })}
                />
              </Field>

              <Field label="Model">
                <Select
                  value={selected.model ?? "gpt-5"}
                  onValueChange={(value) => updateSelected({ model: value })}
                >
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue>
                      <span className="flex items-center gap-1.5">
                        {selectedModel?.thinking && (
                          <Brain className="size-3 text-violet-400" />
                        )}
                        {selectedModel?.fast && !selectedModel?.thinking && (
                          <Zap className="size-3 text-yellow-400" />
                        )}
                        {selectedModel?.label ?? selected.model ?? "Select model"}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex items-center gap-2 py-0.5">
                          <span className="flex-1 text-xs">{m.label}</span>
                          <span
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded border font-medium shrink-0",
                              PROVIDER_BADGE[m.provider],
                            )}
                          >
                            {m.provider}
                          </span>
                          {m.thinking && (
                            <Brain className="size-3 text-violet-400 shrink-0" />
                          )}
                          {m.fast && !m.thinking && (
                            <Zap className="size-3 text-yellow-400 shrink-0" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Tags">
                <Input
                  value={selected.tags.join(", ")}
                  onChange={(e) =>
                    updateSelected({
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="font-mono"
                />
              </Field>
            </div>

            {/* Thinking model callout */}
            {selectedModel?.thinking && (
              <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 mb-6">
                <Brain className="size-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-violet-300">
                    Thinking model — {selectedModel.label}
                  </p>
                  <p className="text-[11px] text-violet-300/70 mt-0.5">
                    This prompt is optimized for a reasoning model. It will use extended
                    chain-of-thought before producing a response.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 block mb-2">
                Prompt body
              </label>
              <TextArea
                value={selected.body}
                onChange={(e) => updateSelected({ body: e.target.value })}
                rows={12}
                className="font-mono"
              />
            </div>

            {selected.variables.length > 0 && (
              <div className="mb-6">
                <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 block mb-2">
                  Variables
                </label>
                <div className="space-y-2">
                  {selected.variables.map((v) => (
                    <div key={v} className="flex items-center gap-2">
                      <code className="text-xs text-primary font-mono bg-primary/5 border border-primary/20 px-2 py-1 rounded-lg shrink-0 w-32 truncate">
                        {`{{${v}}}`}
                      </code>
                      <Input
                        value={varValues[v] ?? ""}
                        onChange={(e) => setVarValues({ ...varValues, [v]: e.target.value })}
                        placeholder={`Value for ${v}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-8 border-t border-border pt-6">
              <button
                onClick={usePrompt}
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90"
              >
                <Copy className="size-4" /> Use prompt
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selected.body);
                  toast.success("Raw template copied");
                }}
                className="inline-flex items-center gap-1.5 text-sm border border-border px-4 py-2 rounded-xl hover:bg-muted/60"
              >
                <Copy className="size-4" /> Copy raw
              </button>
              <button
                onClick={() => {
                  const v = { id: newId("v"), createdAt: Date.now(), body: selected.body };
                  updateSelected({ versions: [v, ...selected.versions] });
                  toast.success("Version saved");
                }}
                className="inline-flex items-center gap-1.5 text-sm border border-border px-4 py-2 rounded-xl hover:bg-muted/60"
              >
                <History className="size-4" /> Save version
              </button>
              {selectedModel && (
                <div
                  className={cn(
                    "ml-auto inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-xl border",
                    selectedModel.thinking
                      ? "border-violet-500/30 bg-violet-500/5 text-violet-400"
                      : "border-border/60 text-muted-foreground bg-muted/30",
                  )}
                >
                  {selectedModel.thinking ? (
                    <Brain className="size-3.5" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}
                  {selectedModel.label}
                </div>
              )}
            </div>

            {selected.versions.length > 0 && (
              <div className="bg-muted/20 rounded-xl border border-border/60 p-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">
                  Version history
                </h3>
                <ul className="space-y-2">
                  {selected.versions.map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-background border border-border/60"
                    >
                      <span className="font-mono text-muted-foreground">
                        {new Date(v.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(v.body);
                          toast.success("Version copied");
                        }}
                        className="text-primary hover:underline"
                      >
                        Copy
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="flex-1 grid place-items-center text-center p-8">
          <div>
            <Sparkles className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No prompt selected.</p>
            <button
              onClick={create}
              className="text-xs font-semibold uppercase tracking-wider border border-border px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors"
            >
              Create your first prompt
            </button>
          </div>
        </section>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete prompt?"
        description="This prompt will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </SplitLayout>
  );
}
