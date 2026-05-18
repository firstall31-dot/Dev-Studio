import { Bot, Sparkles } from "lucide-react";

export function MockChatView({ context }: { context: "tech" | "soft" }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
      <div className="size-16 rounded-2xl bg-primary/10 grid place-items-center mx-auto mb-6 ring-1 ring-primary/20">
        <Bot className="size-8 text-primary" />
      </div>
      <div className="flex items-center gap-2 justify-center mb-3">
        <Sparkles className="size-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Coming Soon</span>
        <Sparkles className="size-4 text-primary" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-3">AI Mock Interview</h2>
      <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
        {context === "tech"
          ? "Real-time technical mock interviews powered by AI. Ask anything from system design to coding challenges — get instant, structured feedback."
          : "AI-powered behavioral and soft skills mock interviews. Practice STAR-method answers and get feedback on communication, leadership, and more."}
      </p>
    </div>
  );
}
