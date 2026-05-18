import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, ExternalLink, FolderOpen, Check } from "lucide-react";
import type { SkillAreaData } from "@/types/skills";
import { cn } from "@/lib/utils";

interface SkillProject {
  id: string;
  title: string;
  desc: string;
  url: string;
  tags: string[];
  createdAt: number;
}

function loadProjects(areaId: string): SkillProject[] {
  try { return JSON.parse(localStorage.getItem(`ds-skill-projects-${areaId}`) ?? "[]"); }
  catch { return []; }
}
function saveProjects(areaId: string, projects: SkillProject[]) {
  try { localStorage.setItem(`ds-skill-projects-${areaId}`, JSON.stringify(projects)); } catch {}
}

const EMPTY_FORM = () => ({ title: "", desc: "", url: "", tags: "" });

interface Props {
  data: SkillAreaData;
  triggerAdd?: number;
}

export function ProjectsSection({ data, triggerAdd }: Props) {
  const [projects, setProjects] = useState<SkillProject[]>(() => loadProjects(data.id));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(loadProjects(data.id));
  }, [data.id]);

  useEffect(() => {
    if (triggerAdd) { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM()); }
  }, [triggerAdd]);

  const persist = (next: SkillProject[]) => { setProjects(next); saveProjects(data.id, next); };

  const submit = () => {
    if (!form.title.trim()) return;
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (editingId) {
      persist(projects.map(p =>
        p.id === editingId ? { ...p, title: form.title.trim(), desc: form.desc.trim(), url: form.url.trim(), tags } : p
      ));
    } else {
      persist([
        ...projects,
        { id: crypto.randomUUID(), title: form.title.trim(), desc: form.desc.trim(), url: form.url.trim(), tags, createdAt: Date.now() },
      ]);
    }
    setShowForm(false); setEditingId(null); setForm(EMPTY_FORM());
  };

  const startEdit = (p: SkillProject) => {
    setEditingId(p.id);
    setForm({ title: p.title, desc: p.desc, url: p.url, tags: p.tags.join(", ") });
    setShowForm(true);
  };

  const remove = (id: string) => persist(projects.filter(p => p.id !== id));
  const cancel = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM()); };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">{data.label} Projects</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM()); }}
            className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 shadow-sm"
          >
            <Plus className="size-4" /> Add Project
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
          <p className="text-sm font-semibold text-foreground">
            {editingId ? "Edit Project" : "New Project"}
          </p>
          <input
            autoFocus
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            onKeyDown={e => e.key === "Escape" && cancel()}
            placeholder="Project title…"
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <textarea
            value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            placeholder="Description — what this project demonstrates or achieves…"
            rows={3}
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
          />
          <input
            value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            placeholder="Link — GitHub, live URL… (optional)"
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <input
            value={form.tags}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            placeholder="Tags, comma-separated — e.g. React, TypeScript, API"
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={submit}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90"
            >
              <Check className="size-3.5" />
              {editingId ? "Save Changes" : "Add Project"}
            </button>
            <button
              onClick={cancel}
              className="px-4 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map(p => (
            <div
              key={p.id}
              className="group relative p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-snug flex-1 min-w-0">{p.title}</h3>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-primary transition-colors"
                      title="Open link"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => startEdit(p)}
                    className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {p.desc && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
              )}

              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="size-3" />
                  <span className="truncate max-w-[180px]">{p.url.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/10">
          <FolderOpen className="size-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No projects yet — add your first one</p>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM()); }}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Add a project
            </button>
          )}
        </div>
      )}
    </div>
  );
}
