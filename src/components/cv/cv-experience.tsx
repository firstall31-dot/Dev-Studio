import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { CVExperience } from "@/types/cv";
import { Input } from "@/components/tools/shared";

interface CVExperienceProps {
  data: CVExperience[];
  onChange: (data: CVExperience[]) => void;
}

function newExp(): CVExperience {
  return { id: crypto.randomUUID(), company: "", role: "", start: "", end: "", current: false, description: "", bullets: [""], tags: [] };
}

export function CVExperienceSection({ data, onChange }: CVExperienceProps) {
  const [openId, setOpenId] = useState<string | null>(data[0]?.id ?? null);

  const update = (id: string, patch: Partial<CVExperience>) =>
    onChange(data.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: string) => {
    const next = data.filter((x) => x.id !== id);
    onChange(next);
    if (openId === id) setOpenId(next[0]?.id ?? null);
  };

  const addBullet = (id: string) => {
    const exp = data.find((x) => x.id === id);
    if (exp) update(id, { bullets: [...exp.bullets, ""] });
  };

  const updateBullet = (id: string, idx: number, val: string) => {
    const exp = data.find((x) => x.id === id);
    if (!exp) return;
    const bullets = [...exp.bullets];
    bullets[idx] = val;
    update(id, { bullets });
  };

  const removeBullet = (id: string, idx: number) => {
    const exp = data.find((x) => x.id === id);
    if (!exp) return;
    update(id, { bullets: exp.bullets.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      {data.map((exp, i) => (
        <div key={exp.id} className="border border-border rounded-lg overflow-hidden bg-card">
          <div
            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setOpenId(openId === exp.id ? null : exp.id)}
          >
            <GripVertical className="size-4 text-muted-foreground/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{exp.role || `Experience ${i + 1}`}</div>
              {exp.company && <div className="text-xs text-muted-foreground truncate">{exp.company}{exp.start ? ` · ${exp.start} – ${exp.current ? "Present" : exp.end}` : ""}</div>}
            </div>
            <button onClick={(e) => { e.stopPropagation(); remove(exp.id); }} className="p-1.5 hover:text-destructive text-muted-foreground transition-colors">
              <Trash2 className="size-3.5" />
            </button>
            {openId === exp.id ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </div>

          {openId === exp.id && (
            <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Job Title">
                  <Input type="text" value={exp.role} onChange={(e) => update(exp.id, { role: e.target.value })} placeholder="Senior Frontend Engineer" />
                </Field>
                <Field label="Company">
                  <Input type="text" value={exp.company} onChange={(e) => update(exp.id, { company: e.target.value })} placeholder="Acme Corp" />
                </Field>
                <Field label="Start Date">
                  <Input type="text" value={exp.start} onChange={(e) => update(exp.id, { start: e.target.value })} placeholder="Jan 2022" />
                </Field>
                <Field label="End Date">
                  <div className="flex gap-2 items-center">
                    <Input type="text" value={exp.current ? "Present" : exp.end} onChange={(e) => update(exp.id, { end: e.target.value })} placeholder="Dec 2024" disabled={exp.current} className="flex-1" />
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={(e) => update(exp.id, { current: e.target.checked, end: e.target.checked ? "Present" : "" })} className="rounded" />
                      Current
                    </label>
                  </div>
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  value={exp.description}
                  onChange={(e) => update(exp.id, { description: e.target.value })}
                  rows={2}
                  placeholder="Brief description of the role..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </Field>

              <Field label="Key Achievements / Bullets">
                <div className="space-y-2">
                  {exp.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-muted-foreground text-xs mt-0.5">•</span>
                      <Input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                        placeholder="Increased performance by 40% by..."
                        className="flex-1"
                      />
                      <button onClick={() => removeBullet(exp.id, idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addBullet(exp.id)} className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity">
                    <Plus className="size-3.5" /> Add bullet
                  </button>
                </div>
              </Field>

              <Field label="Tags (comma-separated)">
                <Input
                  type="text"
                  value={exp.tags.join(", ")}
                  onChange={(e) => update(exp.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  placeholder="React, TypeScript, Node.js"
                />
              </Field>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => { const e = newExp(); onChange([...data, e]); setOpenId(e.id); }}
        className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity"
      >
        <Plus className="size-4" /> Add experience
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
