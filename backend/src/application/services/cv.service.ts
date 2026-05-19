
import { cvProfiles } from "../../domain/schema.js";
import { eq, and, isNull } from "drizzle-orm";
import { getOpenAI } from "../../infrastructure/lib/openai.js";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { uow } from "../../infrastructure/repositories/drizzle-unit-of-work.js";
import { CVMapper } from "../../domain/mappers/cv.mapper.js";

export class CVService {
  static async getAll(userId: string) {
    const rows = await uow.cvProfiles.findAll(eq(cvProfiles.userId, userId));
    return rows.map(CVMapper.toDomain);
  }

  static async create(userId: string, rawData: any) {
    const {
      id,
      personalInfo,
      experience,
      skills,
      education,
      projects,
      languages,
      ...raw
    } = rawData;
    const data = {
      ...stripDates(raw),
      personalInfo: JSON.stringify(personalInfo || {}),
      experience: JSON.stringify(experience || []),
      skills: JSON.stringify(
        skills || { technical: [], soft: [], tools: [], languages: [] },
      ),
      education: JSON.stringify(education || []),
      projects: JSON.stringify(projects || []),
      languages: JSON.stringify(languages || []),
    };

    const safeId = isUUID(id) ? id : undefined;
    const existing = safeId
      ? await uow.cvProfiles.findAll(
          and(eq(cvProfiles.id, safeId), eq(cvProfiles.userId, userId))
        )
      : [];

    if (existing.length > 0) {
      const r = await uow.cvProfiles.update(safeId!, data);
      return CVMapper.toDomain(r);
    } else {
      const r = await uow.cvProfiles.create({
        ...data,
        userId,
        ...(safeId ? { id: safeId } : {}),
      } as any);
      return CVMapper.toDomain(r);
    }
  }

  static async deleteById(userId: string, id: string) {
    if (!isUUID(id)) return true;
    const cv = await uow.cvProfiles.findById(id);
    if (cv && cv.userId === userId) {
      await uow.cvProfiles.delete(id);
    }
    return true;
  }

  static async atsCheck(cvProfile: any, jobDescription: string) {
    if (!cvProfile || !jobDescription) {
      throw new Error("cvProfile and jobDescription are required");
    }

    const cvText = `
NAME: ${cvProfile.personalInfo?.name || ""}
TITLE: ${cvProfile.personalInfo?.title || ""}
FOCUS: ${cvProfile.focus}

SUMMARY:
${cvProfile.summary || ""}

EXPERIENCE:
${(cvProfile.experience || [])
  .map(
    (e: any) =>
      `${e.role} at ${e.company} (${e.start} - ${e.current ? "Present" : e.end})\n${e.description}\n${(e.bullets || []).join("\n")}`,
  )
  .join("\n\n")}

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

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    return JSON.parse(content);
  }

  static parsePdf(fileBase64: string) {
    if (!fileBase64) throw new Error("fileBase64 required");

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
      return rawText;
    }

    const asciiText = buffer
      .toString("ascii")
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s{3,}/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    const lines = asciiText
      .split("\n")
      .filter((l) => l.trim().length > 3 && /[a-zA-Z]{3,}/.test(l));
    return lines.join("\n");
  }
}
