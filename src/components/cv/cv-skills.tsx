import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { CVSkills, CVFocus } from "@/types/cv";
import { FOCUS_KEYWORDS } from "@/types/cv";

interface CVSkillsProps {
  data: CVSkills;
  focus: CVFocus;
  onChange: (data: CVSkills) => void;
}

type SkillCategory = keyof CVSkills;

const CATEGORIES: { key: SkillCategory; label: string; placeholder: string }[] = [
  { key: "technical", label: "Technical Skills", placeholder: "React, TypeScript, Node.js..." },
  { key: "tools", label: "Tools & Platforms", placeholder: "Git, Docker, AWS, Figma..." },
  { key: "languages", label: "Programming Languages", placeholder: "JavaScript, Python, Go..." },
  { key: "soft", label: "Soft Skills", placeholder: "Communication, Leadership..." },
];

export function CVSkillsSection({ data, focus, onChange }: CVSkillsProps) {
  const [inputs, setInputs] = useState<Record<SkillCategory, string>>({ technical: "", tools: "", languages: "", soft: "" });

  const addSkill = (cat: SkillCategory) => {
    const val = inputs[cat].trim();
    if (!val) return;
    const skills = val.split(",").map((s) => s.trim()).filter(Boolean);
    const current = data[cat] || [];
    const next = [...new Set([...current, ...skills])];
    onChange({ ...data, [cat]: next });
    setInputs((p) => ({ ...p, [cat]: "" }));
  };

  const removeSkill = (cat: SkillCategory, skill: string) =>
    onChange({ ...data, [cat]: (data[cat] || []).filter((s) => s !== skill) });

  const addSuggested = (skill: string) => {
    const current = data.technical || [];
    if (!current.includes(skill)) onChange({ ...data, technical: [...current, skill] });
  };

  const suggestions = FOCUS_KEYWORDS[focus].filter((kw) => !(data.technical || []).includes(kw) && !(data.tools || []).includes(kw) && !(data.languages || []).includes(kw));

  return (
    <div className="space-y-5">
      {CATEGORIES.map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">{label}</label>
          <div className="min-h-[44px] flex flex-wrap gap-1.5 p-2 rounded-md border border-border bg-background">
            {(data[key] || []).map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {skill}
                <button onClick={() => removeSkill(key, skill)} className="hover:text-destructive transition-colors">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputs[key]}
              onChange={(e) => setInputs((p) => ({ ...p, [key]: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(key); } }}
              placeholder={placeholder}
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button onClick={() => addSkill(key)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 transition-opacity">
              <Plus className="size-3.5" /> Add
            </button>
          </div>
        </div>
      ))}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Suggested for {focus} role
          </label>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 12).map((kw) => (
              <button key={kw} onClick={() => addSuggested(kw)} className="text-xs px-2 py-0.5 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                + {kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
