import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddQuestionFormProps {
  onSave: (title: string, guide: string) => void;
  onCancel: () => void;
}

export function AddQuestionForm({ onSave, onCancel }: AddQuestionFormProps) {
  const [title, setTitle] = useState("");
  const [guide, setGuide] = useState("");

  return (
    <div className="p-3 border-b border-border/60 space-y-2 bg-muted/20">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Question title…"
        className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all"
      />
      <textarea
        rows={2}
        value={guide}
        onChange={(e) => setGuide(e.target.value)}
        placeholder="Answer guide / tips (optional)"
        className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 resize-none transition-all"
      />
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => title.trim() && onSave(title, guide)}
          disabled={!title.trim()}
          className={cn(
            "flex-1 py-1.5 rounded-xl text-xs font-medium transition-all",
            title.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          Add Question
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-muted/60 transition-all">
          <X className="size-3" />
        </button>
      </div>
    </div>
  );
}
