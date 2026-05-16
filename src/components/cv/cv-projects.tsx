import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { CVProject } from "@/types/cv";
import { Input } from "@/components/tools/shared";

interface CVProjectsProps {
  data: CVProject[];
  onChange: (data: CVProject[]) => void;
}

function newProject(): CVProject {
  return { id: crypto.randomUUID(), name: "", description: "", url: "", repo: "", tags: [], bullets: [""] };
}

export function CVProjectsSection({ data, onChange }: CVProjectsProps) {
  const [openId, setOpenId] = useState<string | null>(data[0]?.id ?? null);

  const update = (id: string, patch: Partial<CVProject>) =>
    onChange(data.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: string) => {
    const next = data.filter((x) => x.id !== id);
    onChange(next);
    if (openId === id) setOpenId(next[0]?.id ?? null);
  };

  const addBullet = (id: string) => {
    const p = data.find((x) => x.id === id);
    if (p) update(id, { bullets: [...p.bullets, ""] });
  };

  const updateBullet = (id: string, idx: number, val: string) => {
    const p = data.find((x) => x.id === id);
    if (!p) return;
    const bullets = [...p.bullets];
    bullets[idx] = val;
    update(id, { bullets });
  };

  const removeBullet = (id: string, idx: number) => {
    const p = data.find((x) => x.id === id);
    if (!p) return;
    update(id, { bullets: p.bullets.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      {data.map((proj, i) => (
        <div key={proj.id} className="border border-border rounded-lg overflow-hidden bg-card">
          <div
            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setOpenId(openId === proj.id ? null : proj.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{proj.name || `Project ${i + 1}`}</div>
              {proj.tags.length > 0 && (
                <div className="text-xs text-muted-foreground truncate">{proj.tags.slice(0, 4).join(" · ")}</div>
              )}
            </div>
            <button onClick={(e) => { e.stopPropagation(); remove(proj.id); }} className="p-1.5 hover:text-destructive text-muted-foreground transition-colors">
              <Trash2 className="size-3.5" />
            </button>
            {openId === proj.id ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </div>

          {openId === proj.id && (
            <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Project Name">
                  <Input type="text" value={proj.name} onChange={(e) => update(proj.id, { name: e.target.value })} placeholder="My Awesome App" />
                </Field>
                <Field label="Live URL">
                  <Input type="text" value={proj.url || ""} onChange={(e) => update(proj.id, { url: e.target.value })} placeholder="https://myapp.com" />
                </Field>
                <Field label="Repository">
                  <Input type="text" value={proj.repo || ""} onChange={(e) => update(proj.id, { repo: e.target.value })} placeholder="github.com/user/repo" />
                </Field>
                <Field label="Tags">
                  <Input
                    type="text"
                    value={proj.tags.join(", ")}
                    onChange={(e) => update(proj.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  value={proj.description}
                  onChange={(e) => update(proj.id, { description: e.target.value })}
                  rows={2}
                  placeholder="What does this project do?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </Field>
              <Field label="Key Highlights">
                <div className="space-y-2">
                  {proj.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-muted-foreground text-xs">•</span>
                      <Input type="text" value={bullet} onChange={(e) => updateBullet(proj.id, idx, e.target.value)} placeholder="Built with React + TypeScript, deployed on Vercel" className="flex-1" />
                      <button onClick={() => removeBullet(proj.id, idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addBullet(proj.id)} className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity">
                    <Plus className="size-3.5" /> Add highlight
                  </button>
                </div>
              </Field>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => { const p = newProject(); onChange([...data, p]); setOpenId(p.id); }}
        className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity"
      >
        <Plus className="size-4" /> Add project
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
