import { useState, useRef } from "react";
import { Upload, FileText, Sparkles, X, AlertCircle, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { checkATS } from "@/lib/api/cv";
import type { CVProfile, ATSResult } from "@/types/cv";
import { Button } from "@/components/ui/button";

interface ATSCheckerProps {
  cvProfile: CVProfile;
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative size-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/30" />
        <circle cx="48" cy="48" r={r} stroke={color} strokeWidth="6" fill="none" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

function SectionBar({ label, score, feedback }: { label: string; score: number; feedback: string }) {
  const [open, setOpen] = useState(false);
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 group">
        <span className="text-xs text-muted-foreground w-24 text-left shrink-0">{label}</span>
        <div className="flex-1 bg-muted/40 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs font-medium w-8 text-right">{score}</span>
        {open ? <ChevronUp className="size-3 text-muted-foreground" /> : <ChevronDown className="size-3 text-muted-foreground" />}
      </button>
      {open && <p className="text-xs text-muted-foreground pl-[108px] pr-10">{feedback}</p>}
    </div>
  );
}

export function ATSChecker({ cvProfile }: ATSCheckerProps) {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePDF = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    setPdfFile(file);
    setPdfLoading(true);
    try {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const b64 = (reader.result as string).split(",")[1];
          resolve(b64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/cv/parse-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fileBase64 }),
      });
      const data = await response.json();
      if (data.text) {
        setJobDesc(data.text);
        toast.success("PDF text extracted successfully");
      } else {
        toast.error("Could not extract text from PDF — paste the job description manually");
      }
    } catch {
      toast.error("Failed to process PDF — paste the job description manually");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) { toast.error("Please enter a job description"); return; }
    if (!cvProfile.personalInfo?.name && !cvProfile.summary && !cvProfile.experience?.length) {
      toast.error("Your CV is empty — fill in some details first");
      return;
    }
    setLoading(true);
    try {
      const r = await checkATS(cvProfile, jobDesc);
      setResult(r);
    } catch (err: any) {
      toast.error(err.message || "ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const gradeColor = result ? {
    Excellent: "text-green-400",
    Good: "text-yellow-400",
    Fair: "text-orange-400",
    Weak: "text-red-400",
  }[result.grade] : "";

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 h-full overflow-y-auto">
      {/* Left: Input */}
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">Job Description</h3>
          <p className="text-xs text-muted-foreground">Paste the job description or upload a PDF to check ATS compatibility.</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer hover:border-primary/50 ${pdfFile ? "border-primary/30 bg-primary/5" : "border-border"}`}
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handlePDF(f); }}
          onDragOver={(e) => e.preventDefault()}
        >
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePDF(f); }} />
          {pdfLoading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Extracting text from PDF...
            </div>
          ) : pdfFile ? (
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <FileText className="size-4" /> {pdfFile.name}
              <button onClick={(e) => { e.stopPropagation(); setPdfFile(null); setJobDesc(""); }} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Upload className="size-6 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drop PDF here or click to upload</p>
              <p className="text-xs text-muted-foreground/60">Job description PDF</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          or paste below
          <div className="flex-1 h-px bg-border" />
        </div>

        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={14}
          placeholder={`Paste the full job description here...\n\nExample:\nWe are looking for a Senior Frontend Engineer with 4+ years of experience in React, TypeScript, and modern web technologies...\n\nRequirements:\n• 4+ years React experience\n• TypeScript proficiency\n• REST API integration\n...`}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring scrollbar-thin"
        />

        <Button onClick={handleAnalyze} disabled={loading || !jobDesc.trim()} className="w-full gap-2">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? "Analyzing with AI..." : "Analyze ATS Compatibility"}
        </Button>
      </div>

      {/* Right: Results */}
      <div className="flex-1 space-y-4">
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center text-muted-foreground space-y-3">
            <div className="size-14 rounded-full bg-muted/20 flex items-center justify-center">
              <Sparkles className="size-6 opacity-40" />
            </div>
            <p className="text-sm">Enter a job description and click Analyze to see your ATS score</p>
            <p className="text-xs opacity-60">The AI will check keyword matches, section quality, and give actionable suggestions</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin" />
            <p className="text-sm">AI is analyzing your CV against the job description...</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-5">
            {/* Score Overview */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-5">
              <ScoreRing score={result.score} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-lg font-bold ${gradeColor}`}>{result.grade}</span>
                  {result.jobTitle && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full truncate">{result.jobTitle}</span>}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {/* Section Scores */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section Scores</h4>
              <SectionBar label="Summary" score={result.sectionScores.summary.score} feedback={result.sectionScores.summary.feedback} />
              <SectionBar label="Experience" score={result.sectionScores.experience.score} feedback={result.sectionScores.experience.feedback} />
              <SectionBar label="Skills" score={result.sectionScores.skills.score} feedback={result.sectionScores.skills.feedback} />
              <SectionBar label="Education" score={result.sectionScores.education.score} feedback={result.sectionScores.education.feedback} />
              <SectionBar label="Projects" score={result.sectionScores.projects.score} feedback={result.sectionScores.projects.feedback} />
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-400" />
                  <h4 className="text-xs font-semibold">Matched Keywords</h4>
                  <span className="text-xs text-muted-foreground ml-auto">{result.matchedKeywords.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.matchedKeywords.map((kw) => (
                    <span key={kw} className="text-[11px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="size-4 text-red-400" />
                  <h4 className="text-xs font-semibold">Missing Keywords</h4>
                  <span className="text-xs text-muted-foreground ml-auto">{result.missingKeywords.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.missingKeywords.map((kw) => (
                    <span key={kw} className="text-[11px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-yellow-400" />
                  <h4 className="text-xs font-semibold">Actionable Suggestions</h4>
                </div>
                <ul className="space-y-1.5">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-yellow-400 shrink-0">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Focus Insights */}
            {result.focusInsights?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <h4 className="text-xs font-semibold">Role-Specific Insights</h4>
                  {result.detectedFocus && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded capitalize ml-auto">{result.detectedFocus}</span>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {result.focusInsights.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary shrink-0">✦</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
