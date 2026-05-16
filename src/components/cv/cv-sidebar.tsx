import { FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CVProfile } from "@/types/cv";
import { FOCUS_COLORS, FOCUS_LABELS } from "@/types/cv";

interface CVSidebarProps {
  cvProfiles: CVProfile[];
  activeCVId: string | null;
  onSelectCV: (id: string) => void;
  onNewCV: () => void;
  onDeleteCV: (id: string) => void;
}

export function CVSidebar({ cvProfiles, activeCVId, onSelectCV, onNewCV, onDeleteCV }: CVSidebarProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">CV Builder</h3>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {cvProfiles.length} profile{cvProfiles.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onNewCV}
            className="flex items-center gap-1.5 text-[11px] font-medium bg-primary text-primary-foreground px-2.5 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus className="size-3.5" /> New
          </button>
        </div>
      </div>

      <nav className="overflow-y-auto p-2 space-y-1 scrollbar-thin flex-1">
        {cvProfiles.length > 0 ? (
          cvProfiles.map((cv) => (
            <div
              key={cv.id}
              className={`group relative w-full text-left px-3 py-2.5 rounded-md text-sm transition-all cursor-pointer border ${
                activeCVId === cv.id
                  ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-card hover:text-foreground border-transparent"
              }`}
              onClick={() => onSelectCV(cv.id)}
            >
              <div className="pr-6">
                <div className={`truncate leading-snug font-medium ${activeCVId === cv.id ? "text-foreground" : ""}`}>
                  {cv.title || "Untitled CV"}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border font-medium ${FOCUS_COLORS[cv.focus]}`}>
                    {FOCUS_LABELS[cv.focus]}
                  </span>
                  <span className="text-[10px] text-muted-foreground opacity-70">
                    {new Date(cv.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setPendingDeleteId(cv.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="px-3 py-8 text-xs text-muted-foreground border border-dashed border-border rounded-lg text-center flex flex-col items-center gap-2 m-2">
            <div className="size-8 rounded-full bg-muted/20 flex items-center justify-center">
              <Plus className="size-4 opacity-50" />
            </div>
            No CVs yet — create your first one
          </div>
        )}
      </nav>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}
        title="Delete CV?"
        description="This CV profile will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => {
          if (pendingDeleteId) onDeleteCV(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
