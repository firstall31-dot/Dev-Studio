import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForge, newId } from "@/lib/store";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import { Bot, Plus, Trash2, Play, Search, Brain, Zap, Send, RotateCcw, Square } from "lucide-react";
import { toast } from "sonner";
import type { Agent } from "@/types/tools";
import { Field, StatusDot, Input, TextArea } from "./shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SplitLayout } from "../../components/layout";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  thinking?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Agents({ selectedId }: { selectedId?: string }) {
  const navigate = useNavigate({ from: "/tools" });
  const { agents, upsertAgent, deleteAgent } = useForge();
  const [query, setQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Playground state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => agents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase())),
    [agents, query],
  );
  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 15);
  const selected = selectedId ? agents.find((a) => a.id === selectedId) : filtered[0];
  const selectedModel = MODELS.find((m) => m.id === selected?.model) ?? null;

  const select = (aid: string) => navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, id: aid }) });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const create = () => {
    const a: Agent = {
      id: newId("a"),
      name: "New Agent",
      role: "Describe what this agent does.",
      systemPrompt: "You are a helpful assistant.",
      tools: [],
      model: "gpt-5",
      temperature: 0.4,
      status: "draft",
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertAgent(a);
    select(a.id);
    toast.success("Agent created");
  };

  const update = (patch: Partial<Agent>) => {
    if (!selected) return;
    upsertAgent({ ...selected, ...patch, updatedAt: Date.now() });
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteAgent(selected.id);
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, id: undefined }) });
    toast.success("Agent deleted");
  };

  const sendMessage = async () => {
    if (!input.trim() || !selected || isRunning) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsRunning(true);

    // Show thinking indicator for reasoning models
    if (selectedModel?.thinking) {
      setIsThinking(true);
    }

    try {
      const res = await fetch("/api/tools/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: selected.systemPrompt,
          model: selected.model ?? "gpt-5",
          temperature: selected.temperature ?? 0.7,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setIsThinking(false);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.content ?? "(empty response)" },
      ]);
    } catch (err: unknown) {
      setIsThinking(false);
      const msg = err instanceof Error ? err.message : "Request failed";
      toast.error("Agent error", { description: msg });
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Error: ${msg}` },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearPlayground = () => {
    setMessages([]);
    setInput("");
    setIsRunning(false);
    setIsThinking(false);
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2.5 border-b border-border/60 shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
            <Bot className="size-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Agents ({agents.length})
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter agents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-muted/40 border border-border/60 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        {paged.map((a) => {
          const active = selected?.id === a.id;
          const mdl = MODELS.find((m) => m.id === a.model);
          return (
            <li key={a.id}>
              <button
                onClick={() => select(a.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium truncate flex-1 ${active ? "text-foreground" : ""}`}>
                    {a.name}
                  </span>
                  {mdl?.thinking && (
                    <Brain className="size-3 text-violet-400 shrink-0" />
                  )}
                  <StatusDot status={a.status} />
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{a.role}</p>
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-10 text-xs text-muted-foreground text-center border border-dashed border-border/60 rounded-xl m-1">
            No agents found.
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
          <Plus className="size-3.5" /> New Agent
        </button>
      </div>
    </div>
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[260px]">
      {selected ? (
        <section className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="size-12 rounded-xl bg-linear-to-br from-primary to-accent grid place-items-center shrink-0">
                <Bot className="size-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={selected.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="w-full text-2xl font-semibold tracking-tight bg-transparent focus:outline-none border-none p-0 h-auto"
                />
                <Input
                  value={selected.role}
                  onChange={(e) => update({ role: e.target.value })}
                  className="w-full text-sm text-muted-foreground bg-transparent focus:outline-none border-none p-0 h-auto mt-1"
                />
              </div>
              <button
                onClick={() => setConfirmOpen(true)}
                className="p-2 rounded-xl border border-border hover:bg-destructive/10 self-end sm:self-auto"
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </button>
            </div>

            {/* Config row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <Field label="Status">
                <Select
                  value={selected.status}
                  onValueChange={(value) => update({ status: value as Agent["status"] })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="idle">idle</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Model">
                <Select
                  value={selected.model ?? "gpt-5"}
                  onValueChange={(value) => update({ model: value })}
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
                        {selectedModel?.label ?? selected.model}
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
                          {m.thinking && <Brain className="size-3 text-violet-400 shrink-0" />}
                          {m.fast && !m.thinking && (
                            <Zap className="size-3 text-yellow-400 shrink-0" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Temperature">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={selected.temperature}
                  onChange={(e) => update({ temperature: parseFloat(e.target.value) || 0 })}
                  className="font-mono"
                  disabled={selectedModel?.thinking}
                  title={selectedModel?.thinking ? "Temperature is fixed at 1 for thinking models" : undefined}
                />
              </Field>

              <Field label="Tools">
                <Input
                  value={selected.tools.join(", ")}
                  onChange={(e) =>
                    update({
                      tools: e.target.value
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
              <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
                <Brain className="size-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-violet-300">
                    Thinking model selected
                  </p>
                  <p className="text-[11px] text-violet-300/70 mt-0.5">
                    {selectedModel.id === "o3" || selectedModel.id === "o4-mini"
                      ? "OpenAI reasoning model — uses extended chain-of-thought before responding. Temperature is fixed at 1."
                      : "Extended thinking enabled — the model reasons step-by-step before producing an answer."}
                  </p>
                </div>
              </div>
            )}

            {/* System prompt */}
            <div className="border-t border-border pt-6">
              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 block mb-2">
                System prompt
              </label>
              <TextArea
                value={selected.systemPrompt}
                onChange={(e) => update({ systemPrompt: e.target.value })}
                rows={10}
                className="font-mono"
              />
            </div>

            {/* Playground */}
            <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                    Playground
                  </p>
                  {selectedModel && (
                    <span
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded border font-medium",
                        PROVIDER_BADGE[selectedModel.provider],
                      )}
                    >
                      {selectedModel.label}
                    </span>
                  )}
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearPlayground}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <RotateCcw className="size-3" /> Clear
                  </button>
                )}
              </div>

              {/* Messages */}
              {messages.length > 0 && (
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" && "flex-row-reverse",
                      )}
                    >
                      <div
                        className={cn(
                          "size-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground border border-border",
                        )}
                      >
                        {msg.role === "user" ? "U" : <Bot className="size-3.5" />}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-background border border-border/60 text-foreground rounded-tl-sm",
                        )}
                      >
                        <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                      </div>
                    </div>
                  ))}

                  {/* Thinking indicator */}
                  {isThinking && (
                    <div className="flex gap-3">
                      <div className="size-7 rounded-full shrink-0 flex items-center justify-center bg-muted border border-border">
                        <Bot className="size-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl rounded-tl-sm px-3 py-2">
                        <Brain className="size-3.5 text-violet-400 animate-pulse" />
                        <span className="text-xs text-violet-300">Thinking…</span>
                        <div className="flex gap-0.5 ml-1">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="size-1.5 rounded-full bg-violet-400 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Running indicator (non-thinking) */}
                  {isRunning && !isThinking && (
                    <div className="flex gap-3">
                      <div className="size-7 rounded-full shrink-0 flex items-center justify-center bg-muted border border-border">
                        <Bot className="size-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1.5 bg-background border border-border/60 rounded-xl rounded-tl-sm px-3 py-2">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input area */}
              <div className="p-3 border-t border-border/60 flex items-end gap-2">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    messages.length === 0
                      ? "Send a test message to this agent… (Enter to send, Shift+Enter for newline)"
                      : "Continue the conversation…"
                  }
                  disabled={isRunning}
                  className="flex-1 resize-none bg-background border border-border/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60 disabled:opacity-50"
                />
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isRunning}
                    className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-2 rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    {isRunning ? (
                      <Square className="size-3" />
                    ) : (
                      <Send className="size-3" />
                    )}
                    {isRunning ? "Stop" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid place-items-center p-8 text-center flex-1">
          <div>
            <Bot className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <button
              onClick={create}
              className="text-xs font-semibold uppercase tracking-wider border border-border px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors"
            >
              Provision your first agent
            </button>
          </div>
        </section>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete agent?"
        description="This agent will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </SplitLayout>
  );
}
