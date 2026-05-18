import { Lightbulb, Edit3, ChevronUp, ChevronDown, Check, X } from "lucide-react";

interface GuideSectionProps {
  guide: string;
  guideOpen: boolean;
  editingGuide: boolean;
  guideDraft: string;
  onToggleOpen: () => void;
  onStartEdit: () => void;
  onDraftChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function GuideSection({
  guide,
  guideOpen,
  editingGuide,
  guideDraft,
  onToggleOpen,
  onStartEdit,
  onDraftChange,
  onSave,
  onCancel,
}: GuideSectionProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleOpen}
        onKeyDown={(e) => e.key === "Enter" && onToggleOpen()}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
      >
        <div className="size-6 rounded-lg bg-amber-500/10 grid place-items-center text-amber-500 shrink-0">
          <Lightbulb className="size-3.5" />
        </div>
        <span className="flex-1 text-left text-xs font-semibold text-foreground">Answer Guide</span>
        <div className="flex items-center gap-1">
          {!editingGuide && (
            <button
              onClick={(e) => { e.stopPropagation(); onStartEdit(); }}
              className="size-5 rounded flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground transition-all"
              title="Edit guide"
            >
              <Edit3 className="size-3" />
            </button>
          )}
          {guideOpen
            ? <ChevronUp className="size-3.5 text-muted-foreground" />
            : <ChevronDown className="size-3.5 text-muted-foreground" />
          }
        </div>
      </div>

      {guideOpen && (
        <div className="px-4 pb-4">
          {editingGuide ? (
            <div className="space-y-2">
              <textarea
                autoFocus
                rows={5}
                value={guideDraft}
                onChange={(e) => onDraftChange(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 resize-none transition-all"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={onCancel}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-muted/60 transition-all"
                >
                  <X className="size-3" /> Cancel
                </button>
                <button
                  onClick={onSave}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  <Check className="size-3" /> Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {guide || <em className="text-muted-foreground/40">No guide written yet. Click the pencil to add one.</em>}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
