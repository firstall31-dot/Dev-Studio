import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { CVEducation } from "@/types/cv";
import { Input } from "@/components/tools/shared";

interface CVEducationProps {
  data: CVEducation[];
  onChange: (data: CVEducation[]) => void;
}

function newEdu(): CVEducation {
  return { id: crypto.randomUUID(), institution: "", degree: "", field: "", start: "", end: "", grade: "", notes: "" };
}

export function CVEducationSection({ data, onChange }: CVEducationProps) {
  const [openId, setOpenId] = useState<string | null>(data[0]?.id ?? null);

  const update = (id: string, patch: Partial<CVEducation>) =>
    onChange(data.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: string) => {
    const next = data.filter((x) => x.id !== id);
    onChange(next);
    if (openId === id) setOpenId(next[0]?.id ?? null);
  };

  return (
    <div className="space-y-3">
      {data.map((edu, i) => (
        <div key={edu.id} className="border border-border rounded-lg overflow-hidden bg-card">
          <div
            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setOpenId(openId === edu.id ? null : edu.id)}
          >
            <GripVertical className="size-4 text-muted-foreground/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{edu.degree || `Education ${i + 1}`}{edu.field ? ` in ${edu.field}` : ""}</div>
              {edu.institution && <div className="text-xs text-muted-foreground truncate">{edu.institution}{edu.start ? ` · ${edu.start}–${edu.end}` : ""}</div>}
            </div>
            <button onClick={(e) => { e.stopPropagation(); remove(edu.id); }} className="p-1.5 hover:text-destructive text-muted-foreground transition-colors">
              <Trash2 className="size-3.5" />
            </button>
            {openId === edu.id ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </div>

          {openId === edu.id && (
            <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Institution">
                  <Input type="text" value={edu.institution} onChange={(e) => update(edu.id, { institution: e.target.value })} placeholder="MIT" />
                </Field>
                <Field label="Degree">
                  <Input type="text" value={edu.degree} onChange={(e) => update(edu.id, { degree: e.target.value })} placeholder="B.Sc. / M.Sc. / Ph.D." />
                </Field>
                <Field label="Field of Study">
                  <Input type="text" value={edu.field} onChange={(e) => update(edu.id, { field: e.target.value })} placeholder="Computer Science" />
                </Field>
                <Field label="Grade / GPA">
                  <Input type="text" value={edu.grade || ""} onChange={(e) => update(edu.id, { grade: e.target.value })} placeholder="3.8/4.0 or First Class" />
                </Field>
                <Field label="Start Year">
                  <Input type="text" value={edu.start} onChange={(e) => update(edu.id, { start: e.target.value })} placeholder="2018" />
                </Field>
                <Field label="End Year">
                  <Input type="text" value={edu.end} onChange={(e) => update(edu.id, { end: e.target.value })} placeholder="2022" />
                </Field>
              </div>
              <Field label="Notes">
                <textarea
                  value={edu.notes || ""}
                  onChange={(e) => update(edu.id, { notes: e.target.value })}
                  rows={2}
                  placeholder="Relevant coursework, honors, activities..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </Field>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => { const e = newEdu(); onChange([...data, e]); setOpenId(e.id); }}
        className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity"
      >
        <Plus className="size-4" /> Add education
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
