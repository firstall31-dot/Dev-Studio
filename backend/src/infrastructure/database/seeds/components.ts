const now = Date.now();

export interface ComponentSeed {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  code: string;
  dependencies: string[];
  favorite?: boolean;
  usageCount?: number;
  createdAt: number;
  updatedAt: number;
}

export const seedComponents: ComponentSeed[] = [
  {
    id: "c_1",
    name: "Glass Sidebar",
    description: "Blurred dark sidebar with collapsible nav groups and active state indicators.",
    category: "Navigation",
    tags: ["sidebar", "tailwind", "react"],
    code: `import { useState } from 'react';
import { ChevronDown, LayoutDashboard, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Team', href: '/team', icon: <Users size={16} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
];

export function GlassSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const [active, setActive] = useState('/dashboard');

  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r border-white/10',
        'backdrop-blur-xl bg-white/5 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-white/10">
        {!collapsed && (
          <span className="font-semibold text-sm tracking-wide">Dev Studio</span>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => setActive(item.href)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              active === item.href
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}`,
    dependencies: ["react", "tailwindcss", "lucide-react"],
    favorite: true,
    usageCount: 12,
    createdAt: now - 86400000 * 14,
    updatedAt: now - 3600000 * 6,
  },
  {
    id: "c_2",
    name: "Gradient Stat Card",
    description: "KPI card with trend indicator and gradient accent border.",
    category: "Data Display",
    tags: ["card", "stats", "kpi"],
    code: `import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

export function StatCard({ label, value, change, changeLabel }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="relative rounded-xl border border-white/10 p-5 bg-card overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500"
        aria-hidden
      />
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      {change !== undefined && (
        <div
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs font-medium',
            isPositive ? 'text-emerald-400' : 'text-red-400'
          )}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{change}% {changeLabel ?? 'vs last month'}
        </div>
      )}
    </div>
  );
}`,
    dependencies: ["react", "lucide-react"],
    usageCount: 9,
    createdAt: now - 86400000 * 9,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "c_3",
    name: "Command Palette",
    description: "Cmd+K palette with grouped search results and keyboard navigation.",
    category: "Overlays",
    tags: ["cmdk", "search", "keyboard"],
    code: `import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, FileText, Cpu, Code2 } from 'lucide-react';

const groups = [
  {
    label: 'Prompts',
    icon: <FileText size={14} />,
    items: ['Database Schema Architect', 'Bug Hunter', 'API Contract Designer'],
  },
  {
    label: 'Agents',
    icon: <Cpu size={14} />,
    items: ['Code Auditor', 'Schema Architect', 'Style Architect'],
  },
  {
    label: 'Snippets',
    icon: <Code2 size={14} />,
    items: ['useDebounce Hook', 'JWT Middleware', 'Zod Validator'],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <Search size={14} className="text-muted-foreground" />
            <Command.Input
              placeholder="Search everything…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            {groups.map((group) => (
              <Command.Group key={group.label} heading={group.label}>
                {group.items.map((item) => (
                  <Command.Item
                    key={item}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-white/5 aria-selected:bg-white/10"
                    onSelect={() => setOpen(false)}
                  >
                    {group.icon}
                    {item}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}`,
    dependencies: ["cmdk", "react", "lucide-react"],
    favorite: true,
    usageCount: 18,
    createdAt: now - 86400000 * 22,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: "c_4",
    name: "Tag Input",
    description: "Input that converts entries into removable tag chips on Enter or comma.",
    category: "Forms",
    tags: ["input", "tags", "forms"],
    code: `import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({ value, onChange, placeholder = 'Add tag…', className }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput('');
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
    if (e.key === 'Backspace' && !input && value.length > 0) removeTag(value[value.length - 1]);
  };

  return (
    <div className={cn('flex flex-wrap gap-1.5 p-2 rounded-lg border border-input bg-background min-h-10', className)}>
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="text-secondary-foreground/60 hover:text-secondary-foreground">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}`,
    dependencies: ["react", "lucide-react"],
    usageCount: 4,
    createdAt: now - 86400000 * 5,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: "c_5",
    name: "Streaming Chat Bubble",
    description: "Animated chat message bubble with typewriter streaming effect for AI responses.",
    category: "AI / Chat",
    tags: ["chat", "streaming", "ai", "animation"],
    code: `import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function ChatBubble({ role, content, isStreaming = false }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn('size-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold', isUser ? 'bg-violet-500 text-white' : 'bg-neutral-800 text-white')}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={cn('max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed', isUser ? 'bg-violet-500 text-white rounded-tr-sm' : 'bg-neutral-800 text-neutral-100 rounded-tl-sm')}>
        {content}
        {isStreaming && <span className="inline-block w-0.5 h-4 ml-0.5 bg-current align-middle animate-pulse" />}
      </div>
    </div>
  );
}`,
    dependencies: ["react"],
    favorite: true,
    usageCount: 7,
    createdAt: now - 86400000 * 7,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "c_6",
    name: "Data Table with Sort",
    description: "Headless sortable data table using TanStack Table with column header controls.",
    category: "Data Display",
    tags: ["table", "tanstack", "react", "sorting"],
    code: `import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={header.column.getToggleSortingHandler()}>
                  <span className="inline-flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? <ChevronUp size={13} /> : header.column.getIsSorted() === 'desc' ? <ChevronDown size={13} /> : <ChevronsUpDown size={13} className="opacity-40" />}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-muted/30 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    dependencies: ["@tanstack/react-table", "react", "lucide-react"],
    usageCount: 5,
    createdAt: now - 86400000 * 16,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: "c_7",
    name: "Toast Notification System",
    description: "Lightweight toast helper and container using Sonner with success/error/info/promise variants.",
    category: "Feedback",
    tags: ["toast", "notifications", "sonner"],
    code: `import { toast } from 'sonner';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

export const notify = {
  success: (message: string, description?: string) =>
    toast.success(message, { description, icon: <CheckCircle2 size={16} className="text-emerald-400" /> }),

  error: (message: string, description?: string) =>
    toast.error(message, { description, icon: <XCircle size={16} className="text-red-400" /> }),

  info: (message: string, description?: string) =>
    toast.info(message, { description, icon: <Info size={16} className="text-blue-400" /> }),

  warning: (message: string, description?: string) =>
    toast.warning(message, { description, icon: <AlertTriangle size={16} className="text-yellow-400" /> }),

  promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) =>
    toast.promise(promise, messages),
};

// Usage:
// notify.success('Saved!', 'Your changes have been persisted.');
// notify.promise(saveData(), { loading: 'Saving...', success: 'Done!', error: 'Failed' });`,
    dependencies: ["sonner", "lucide-react"],
    usageCount: 22,
    createdAt: now - 86400000 * 18,
    updatedAt: now - 86400000 * 5,
  },
  {
    id: "c_8",
    name: "Collapsible Code Block",
    description: "Syntax-highlighted code block with copy button and expand/collapse toggle.",
    category: "Content",
    tags: ["code", "syntax", "copy", "react"],
    code: `import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  maxLines?: number;
}

export function CodeBlock({ code, language = 'tsx', maxLines = 10 }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const lines = code.split('\n');
  const needsCollapse = lines.length > maxLines;
  const displayed = expanded || !needsCollapse ? code : lines.slice(0, maxLines).join('\n');

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-neutral-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-neutral-900">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-neutral-200 font-mono leading-relaxed">
        <code>{displayed}</code>
        {needsCollapse && !expanded && <span className="text-neutral-600">…</span>}
      </pre>
      {needsCollapse && (
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground border-t border-border transition-colors">
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Collapse' : \`Show \${lines.length - maxLines} more lines\`}
        </button>
      )}
    </div>
  );
}`,
    dependencies: ["react", "lucide-react"],
    favorite: true,
    usageCount: 14,
    createdAt: now - 86400000 * 11,
    updatedAt: now - 86400000 * 2,
  },

  // ── NEW COMPONENTS ───────────────────────────────────────────────────────

  {
    id: "c_9",
    name: "AI Thinking Indicator",
    description: "Animated thinking state for AI responses with pulsing brain icon and reasoning steps.",
    category: "AI / Chat",
    tags: ["ai", "thinking", "animation", "react"],
    code: `import { useState, useEffect } from 'react';
import { Brain, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  isThinking: boolean;
  thoughtSummary?: string;
  steps?: string[];
}

export function ThinkingIndicator({ isThinking, thoughtSummary, steps = [] }: ThinkingIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isThinking) return;
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 400);
    return () => clearInterval(id);
  }, [isThinking]);

  if (!isThinking && !thoughtSummary) return null;

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
      >
        <Brain
          size={15}
          className={cn(
            'text-violet-400 shrink-0',
            isThinking && 'animate-pulse'
          )}
        />
        <span className="text-xs text-violet-300 font-medium flex-1">
          {isThinking
            ? \`Thinking\${dots}\`
            : \`Thought for \${thoughtSummary ?? 'a moment'}\`}
        </span>
        {!isThinking && steps.length > 0 && (
          <ChevronDown
            size={13}
            className={cn('text-violet-400/60 transition-transform', expanded && 'rotate-180')}
          />
        )}
      </button>

      {expanded && steps.length > 0 && (
        <ul className="px-4 pb-3 space-y-1.5 border-t border-violet-500/10">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-violet-300/70">
              <span className="shrink-0 mt-0.5 size-4 rounded-full border border-violet-500/30 flex items-center justify-center text-[9px] text-violet-400">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    dependencies: ["react", "lucide-react"],
    favorite: true,
    usageCount: 3,
    createdAt: now - 86400000 * 1,
    updatedAt: now - 3600000 * 2,
  },
  {
    id: "c_10",
    name: "Model Selector",
    description: "Dropdown for selecting LLM models with provider badges and thinking model indicators.",
    category: "AI / Chat",
    tags: ["ai", "model", "select", "react"],
    code: `import { Brain, Zap, Cpu } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Model {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  thinking?: boolean;
  speed: 'fast' | 'medium' | 'slow';
}

const MODELS: Model[] = [
  { id: 'gpt-5', name: 'GPT-5', provider: 'openai', speed: 'fast' },
  { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'openai', speed: 'fast' },
  { id: 'o3', name: 'o3', provider: 'openai', thinking: true, speed: 'slow' },
  { id: 'o4-mini', name: 'o4-mini', provider: 'openai', thinking: true, speed: 'medium' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', speed: 'medium' },
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'anthropic', thinking: true, speed: 'slow' },
];

const providerColors: Record<Model['provider'], string> = {
  openai: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  anthropic: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  google: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const selected = MODELS.find((m) => m.id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs font-mono gap-2">
        <SelectValue>
          <span className="flex items-center gap-1.5">
            {selected?.thinking && <Brain size={11} className="text-violet-400" />}
            {selected?.name ?? 'Select model'}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-2 py-0.5">
              <span className="flex-1 text-xs">{model.name}</span>
              <span className={cn('text-[9px] px-1.5 py-0.5 rounded border font-medium', providerColors[model.provider])}>
                {model.provider}
              </span>
              {model.thinking && <Brain size={11} className="text-violet-400" />}
              {model.speed === 'fast' && <Zap size={11} className="text-yellow-400" />}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}`,
    dependencies: ["react", "lucide-react", "@radix-ui/react-select"],
    favorite: true,
    usageCount: 6,
    createdAt: now - 86400000 * 2,
    updatedAt: now - 3600000 * 4,
  },
  {
    id: "c_11",
    name: "Multi-step Form Wizard",
    description: "Accessible multi-step form with progress indicator, validation per step, and animated transitions.",
    category: "Forms",
    tags: ["forms", "wizard", "react", "animation"],
    code: `import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface WizardProps {
  steps: Step[];
  onComplete: () => void;
}

export function FormWizard({ steps, onComplete }: WizardProps) {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [validating, setValidating] = useState(false);

  const goNext = async () => {
    const step = steps[current];
    if (step.validate) {
      setValidating(true);
      const valid = await step.validate();
      setValidating(false);
      if (!valid) return;
    }
    setCompleted((prev) => new Set([...prev, current]));
    if (current === steps.length - 1) { onComplete(); return; }
    setCurrent((c) => c + 1);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <ol className="flex items-center gap-0">
        {steps.map((step, i) => (
          <li key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => completed.has(i) && setCurrent(i)}
              className={cn(
                'size-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold shrink-0 transition-all',
                i === current ? 'border-primary bg-primary text-primary-foreground' :
                completed.has(i) ? 'border-primary bg-primary/20 text-primary cursor-pointer' :
                'border-border text-muted-foreground'
              )}
            >
              {completed.has(i) ? <Check size={12} /> : i + 1}
            </button>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-px mx-2', completed.has(i) ? 'bg-primary' : 'bg-border')} />
            )}
          </li>
        ))}
      </ol>

      <div className="text-center">
        <h3 className="font-semibold">{steps[current].title}</h3>
        {steps[current].description && (
          <p className="text-sm text-muted-foreground mt-1">{steps[current].description}</p>
        )}
      </div>

      <div>{steps[current].component}</div>

      <div className="flex justify-between pt-4 border-t border-border">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Back
        </button>
        <button
          onClick={goNext}
          disabled={validating}
          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {validating ? 'Validating…' : current === steps.length - 1 ? 'Complete' : 'Continue'}
          {!validating && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}`,
    dependencies: ["react", "lucide-react"],
    usageCount: 4,
    createdAt: now - 86400000 * 10,
    updatedAt: now - 86400000 * 3,
  },
  {
    id: "c_12",
    name: "Infinite Scroll List",
    description: "Virtualized infinite scroll list with intersection observer and loading skeleton.",
    category: "Data Display",
    tags: ["infinite-scroll", "react", "performance", "list"],
    code: `import { useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfiniteListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
  skeletonCount?: number;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-muted/60', className)} />;
}

export function InfiniteList<T>({
  items, renderItem, hasMore, isLoading, onLoadMore, className, skeletonCount = 3,
}: InfiniteListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) onLoadMore();
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleIntersection, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleIntersection]);

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, i) => (
        <div key={i}>{renderItem(item, i)}</div>
      ))}

      {isLoading && Array.from({ length: skeletonCount }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}

      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-4">
          All items loaded ({items.length} total)
        </p>
      )}
    </div>
  );
}`,
    dependencies: ["react", "lucide-react"],
    usageCount: 5,
    createdAt: now - 86400000 * 8,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: "c_13",
    name: "Draggable Kanban Card",
    description: "Drag-and-drop Kanban card using dnd-kit with column transitions and priority badges.",
    category: "Productivity",
    tags: ["dnd-kit", "kanban", "drag-drop", "react"],
    code: `import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertCircle, Circle, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type Priority = 'low' | 'medium' | 'high';

interface KanbanCardProps {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  assignee?: string;
  tags?: string[];
}

const priorityConfig: Record<Priority, { icon: React.ReactNode; className: string }> = {
  low: { icon: <Circle size={11} />, className: 'text-muted-foreground' },
  medium: { icon: <AlertCircle size={11} />, className: 'text-yellow-400' },
  high: { icon: <ArrowUp size={11} />, className: 'text-red-400' },
};

export function KanbanCard({ id, title, description, priority = 'medium', assignee, tags = [] }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group rounded-xl border border-border bg-card p-3 cursor-default select-none',
        isDragging && 'opacity-50 shadow-2xl ring-2 ring-primary/30'
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground shrink-0"
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{title}</p>
          {description && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{description}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span className={cn('inline-flex items-center gap-1 text-[10px]', priorityConfig[priority].className)}>
              {priorityConfig[priority].icon}
              {priority}
            </span>
            {tags.map((tag) => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                {tag}
              </span>
            ))}
            {assignee && (
              <span className="ml-auto size-5 rounded-full bg-primary/20 text-primary text-[9px] font-semibold flex items-center justify-center shrink-0">
                {assignee.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`,
    dependencies: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities", "react", "lucide-react"],
    usageCount: 3,
    createdAt: now - 86400000 * 12,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: "c_14",
    name: "Resizable Split Pane",
    description: "Two-panel layout with a draggable divider and min/max size constraints.",
    category: "Layout",
    tags: ["layout", "resize", "react-resizable-panels", "split"],
    code: `import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSizes?: [number, number];
  minSizes?: [number, number];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function SplitPane({
  left, right,
  defaultSizes = [35, 65],
  minSizes = [20, 30],
  direction = 'horizontal',
  className,
}: SplitPaneProps) {
  return (
    <PanelGroup direction={direction} className={cn('flex h-full', className)}>
      <Panel defaultSize={defaultSizes[0]} minSize={minSizes[0]}>
        {left}
      </Panel>

      <PanelResizeHandle className="relative flex items-center justify-center group">
        <div className={cn(
          'transition-colors bg-border group-hover:bg-primary/40 group-active:bg-primary',
          direction === 'horizontal' ? 'w-px h-full' : 'h-px w-full'
        )} />
        <div className={cn(
          'absolute flex items-center justify-center size-5 rounded-full bg-background border border-border group-hover:border-primary/40 transition-colors',
        )}>
          <GripVertical size={10} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </PanelResizeHandle>

      <Panel defaultSize={defaultSizes[1]} minSize={minSizes[1]}>
        {right}
      </Panel>
    </PanelGroup>
  );
}`,
    dependencies: ["react-resizable-panels", "react", "lucide-react"],
    usageCount: 8,
    createdAt: now - 86400000 * 6,
    updatedAt: now - 86400000 * 1,
  },
];
