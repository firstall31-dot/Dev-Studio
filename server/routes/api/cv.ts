import { Router } from "express";
import { db } from "../../db/index.js";
import { cvProfiles } from "../../../shared/schema.js";
import { eq, and } from "drizzle-orm";
import { requireUser, stripDates, isUUID } from "../../middleware/auth.js";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

function parseCVRow(row: any) {
  const parse = (val: string, fallback: any) => {
    try { return JSON.parse(val || "null") ?? fallback; } catch { return fallback; }
  };
  return {
    id: row.id,
    title: row.title,
    focus: row.focus,
    personalInfo: parse(row.personalInfo, {}),
    summary: row.summary || "",
    experience: parse(row.experience, []),
    skills: parse(row.skills, { technical: [], soft: [], tools: [], languages: [] }),
    education: parse(row.education, []),
    projects: parse(row.projects, []),
    languages: parse(row.languages, []),
    createdAt: new Date(row.createdAt).getTime(),
    updatedAt: new Date(row.updatedAt).getTime(),
  };
}

router.get("/", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const rows = await db.select().from(cvProfiles).where(eq(cvProfiles.userId, uid));
  res.json(rows.map(parseCVRow));
});

router.post("/", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { id, personalInfo, experience, skills, education, projects, languages, ...raw } = req.body;
  const data = {
    ...stripDates(raw),
    personalInfo: JSON.stringify(personalInfo || {}),
    experience: JSON.stringify(experience || []),
    skills: JSON.stringify(skills || { technical: [], soft: [], tools: [], languages: [] }),
    education: JSON.stringify(education || []),
    projects: JSON.stringify(projects || []),
    languages: JSON.stringify(languages || []),
  };
  const safeId = isUUID(id) ? id : undefined;
  const existing = safeId ? await db.select().from(cvProfiles).where(and(eq(cvProfiles.id, safeId), eq(cvProfiles.userId, uid))) : [];

  if (existing.length > 0) {
    const [r] = await db.update(cvProfiles).set({ ...data, updatedAt: new Date() }).where(eq(cvProfiles.id, safeId!)).returning();
    res.json(parseCVRow(r));
  } else {
    const [r] = await db.insert(cvProfiles).values({ ...data, userId: uid, ...(safeId ? { id: safeId } : {}) } as any).returning();
    res.json(parseCVRow(r));
  }
});

router.delete("/:id", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  if (!isUUID(req.params.id)) { res.json({ ok: true }); return; }
  await db.delete(cvProfiles).where(and(eq(cvProfiles.id, req.params.id), eq(cvProfiles.userId, uid)));
  res.json({ ok: true });
});

router.post("/ats-check", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { cvProfile, jobDescription } = req.body;
  if (!cvProfile || !jobDescription) {
    return res.status(400).json({ error: "cvProfile and jobDescription are required" });
  }

  const cvText = `
NAME: ${cvProfile.personalInfo?.name || ""}
TITLE: ${cvProfile.personalInfo?.title || ""}
FOCUS: ${cvProfile.focus}

SUMMARY:
${cvProfile.summary || ""}

EXPERIENCE:
${(cvProfile.experience || []).map((e: any) =>
  `${e.role} at ${e.company} (${e.start} - ${e.current ? "Present" : e.end})\n${e.description}\n${(e.bullets || []).join("\n")}`
).join("\n\n")}

SKILLS:
Technical: ${(cvProfile.skills?.technical || []).join(", ")}
Tools: ${(cvProfile.skills?.tools || []).join(", ")}
Languages: ${(cvProfile.skills?.languages || []).join(", ")}
Soft Skills: ${(cvProfile.skills?.soft || []).join(", ")}

EDUCATION:
${(cvProfile.education || []).map((e: any) => `${e.degree} in ${e.field} - ${e.institution} (${e.start}-${e.end})`).join("\n")}

PROJECTS:
${(cvProfile.projects || []).map((p: any) => `${p.name}: ${p.description}\n${(p.bullets || []).join("\n")}`).join("\n\n")}
`.trim();

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach specializing in tech roles (Frontend, Backend, Fullstack). Your job is to analyze how well a CV matches a job description and provide a detailed, actionable ATS compatibility report.

Return ONLY a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "grade": <"Excellent"|"Good"|"Fair"|"Weak">,
  "summary": "<2-3 sentence overall assessment>",
  "jobTitle": "<detected job title from description>",
  "detectedFocus": <"frontend"|"backend"|"fullstack"|"general">,
  "matchedKeywords": ["<keyword>", ...],
  "missingKeywords": ["<keyword>", ...],
  "suggestions": ["<specific actionable suggestion>", ...],
  "sectionScores": {
    "summary": { "score": <0-100>, "feedback": "<specific feedback>" },
    "experience": { "score": <0-100>, "feedback": "<specific feedback>" },
    "skills": { "score": <0-100>, "feedback": "<specific feedback>" },
    "education": { "score": <0-100>, "feedback": "<specific feedback>" },
    "projects": { "score": <0-100>, "feedback": "<specific feedback>" }
  },
  "focusInsights": ["<insight specific to frontend/backend/fullstack requirements>", ...]
}

Be precise, actionable, and focus on what matters for ATS systems (keyword density, section presence, relevance).`;

  const userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\n---\n\nCV:\n${cvText}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const result = JSON.parse(content);
    res.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "AI analysis failed";
    res.status(500).json({ error: msg });
  }
});

router.post("/parse-pdf", async (req, res) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { fileBase64 } = req.body;
  if (!fileBase64) return res.status(400).json({ error: "fileBase64 required" });

  try {
    const buffer = Buffer.from(fileBase64, "base64");
    const pdfStr = buffer.toString("latin1");

    const strings: string[] = [];
    const btEtRegex = /BT[\s\S]*?ET/g;
    const matches = pdfStr.match(btEtRegex) || [];

    for (const block of matches) {
      const textMatches = block.match(/\(([^)]{2,})\)\s*T[jJ]/g) || [];
      for (const tm of textMatches) {
        const inner = tm.match(/\(([^)]+)\)/)?.[1];
        if (inner) strings.push(inner.replace(/\\[()\\]/g, (m) => m[1]));
      }
    }

    const rawText = strings.join(" ").replace(/\s+/g, " ").trim();

    if (rawText.length > 100) {
      res.json({ text: rawText });
      return;
    }

    const asciiText = buffer.toString("ascii").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    const lines = asciiText.split("\n").filter((l) => l.trim().length > 3 && /[a-zA-Z]{3,}/.test(l));
    res.json({ text: lines.join("\n") });
  } catch (err) {
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

export default router;
