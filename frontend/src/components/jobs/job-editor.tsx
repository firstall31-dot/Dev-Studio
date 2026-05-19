import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Loader2, Trash2 } from "lucide-react";
import type { SavedJob, JobStatus } from "./types";
import { JOB_STATUSES, JOB_PLATFORMS } from "./types";
import { JobBrowser } from "./job-browser";
import { toast } from "sonner";

interface Props {
  job: SavedJob | null;
  isNew: boolean;
  onSave: (job: Partial<SavedJob>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSaveRemote: (job: Partial<SavedJob>) => Promise<void>;
  onBack: () => void;
}

const EMPTY: Partial<SavedJob> = {
  title: "",
  company: "",
  location: "",
  url: "",
  platform: "LinkedIn",
  status: "saved",
  salary: "",
  remote: false,
  tags: [],
  notes: "",
};

export function JobEditor({ job, isNew, onSave, onDelete, onSaveRemote, onBack }: Props) {
  const [form, setForm] = useState<Partial<SavedJob>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (job) {
      setForm({ ...job });
      setTagInput("");
    } else if (isNew) {
      setForm({ ...EMPTY });
      setTagInput("");
    }
  }, [job, isNew]);

  if (!job && !isNew) {
    return <JobBrowser onSaveJob={onSaveRemote} />;
  }

  const handleSave = async () => {
    if (!form.title?.trim()) {
      toast.error("Title is required.");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!job || !confirm("Delete this job?")) return;
    setDeleting(true);
    try {
      await onDelete(job.id);
    } finally {
      setDeleting(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags?.includes(t)) setForm((p) => ({ ...p, tags: [...(p.tags ?? []), t] }));
    setTagInput("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border shrink-0 flex items-center gap-3">
        <button
          onClick={onBack}
          className="size-7 grid place-items-center rounded-md hover:bg-sidebar-accent/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h2 className="text-sm font-semibold flex-1 truncate">
          {job ? `Edit: ${job.title}` : "Add Job"}
        </h2>
        {job && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="size-7 grid place-items-center rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete job"
          >
            {deleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-xl space-y-4">
          <Field label="Job Title *">
            <input
              className={inp}
              value={form.title ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Senior Frontend Developer"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Company">
              <input
                className={inp}
                value={form.company ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                placeholder="Acme Corp"
              />
            </Field>
            <Field label="Location">
              <input
                className={inp}
                value={form.location ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Cairo / Remote"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform">
              <select
                className={inp}
                value={form.platform ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
              >
                {JOB_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                className={inp}
                value={form.status ?? "saved"}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as JobStatus }))}
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Salary">
              <input
                className={inp}
                value={form.salary ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
                placeholder="$80k – $120k"
              />
            </Field>
            <Field label="Job URL">
              <input
                type="url"
                className={inp}
                value={form.url ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://…"
              />
            </Field>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remote-chk"
              checked={form.remote ?? false}
              onChange={(e) => setForm((p) => ({ ...p, remote: e.target.checked }))}
              className="rounded border-border accent-primary size-3.5"
            />
            <label htmlFor="remote-chk" className="text-xs text-muted-foreground cursor-pointer">
              Remote position
            </label>
          </div>

          <Field label="Tags">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {(form.tags ?? []).map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                >
                  {t}
                  <button
                    onClick={() => setForm((p) => ({ ...p, tags: p.tags?.filter((x) => x !== t) }))}
                    className="hover:text-destructive leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={`${inp} flex-1`}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag…"
              />
              <button
                onClick={addTag}
                className="px-2.5 py-1.5 text-xs border border-border rounded-md hover:bg-sidebar-accent/40 text-muted-foreground hover:text-foreground transition-colors"
              >
                Add
              </button>
            </div>
          </Field>

          <Field label="Notes">
            <textarea
              className={`${inp} min-h-[80px] resize-y`}
              value={form.notes ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Interview notes, contacts, next steps…"
            />
          </Field>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              {job ? "Save Changes" : "Add Job"}
            </button>
            {job?.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-md hover:bg-sidebar-accent/40 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-3.5" /> Open
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inp =
  "w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
