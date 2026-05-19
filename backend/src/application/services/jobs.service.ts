import { db } from "../../infrastructure/database/index.js";
import { savedJobs } from "../../domain/schema.js";
import { eq, and } from "drizzle-orm";
import { stripDates, isUUID } from "../../presentation/middleware/auth.js"; // In future, move to domain utils
import { scrapeIndeedRSS } from "../../infrastructure/lib/scrapers/indeed.js";
import { scrapeWuzzuf } from "../../infrastructure/lib/scrapers/wuzzuf.js";
import { scrapeBayt } from "../../infrastructure/lib/scrapers/bayt.js";
import { scrapeRemoteOKTagged } from "../../infrastructure/lib/scrapers/remoteok.js";

export class JobsService {
  static async getSaved(userId: string) {
    return await db.select().from(savedJobs).where(eq(savedJobs.userId, userId));
  }

  static async saveJob(userId: string, rawData: any) {
    const { id, ...raw } = rawData;
    const data = stripDates(raw);
    const safeId = isUUID(id) ? id : undefined;
    
    if (safeId) {
      const existing = await db
        .select()
        .from(savedJobs)
        .where(and(eq(savedJobs.id, safeId), eq(savedJobs.userId, userId)));
        
      if (existing.length > 0) {
        const [r] = await db
          .update(savedJobs)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(savedJobs.id, safeId))
          .returning();
        return r;
      }
    }
    
    const [r] = await db
      .insert(savedJobs)
      .values({ ...data, userId, ...(safeId ? { id: safeId } : {}) } as any)
      .returning();
      
    return r;
  }

  static async deleteSavedById(userId: string, id: string) {
    if (!isUUID(id)) {
      return true;
    }
    await db
      .delete(savedJobs)
      .where(and(eq(savedJobs.id, id), eq(savedJobs.userId, userId)));
    return true;
  }

  static async getRemoteJobs(tag: string) {
    const tagQuery = tag ? `?tag=${encodeURIComponent(tag)}` : "";
    const r = await fetch(`https://remoteok.com/api${tagQuery}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 DevStudio/1.0",
        Accept: "application/json",
      },
    });
    
    if (!r.ok) throw new Error(`RemoteOK ${r.status}`);
    
    const data = (await r.json()) as any[];
    return data
      .slice(1)
      .filter((j: any) => j.id && j.title)
      .slice(0, 30);
  }

  static async scrapeJobs(query: string, location: string, days: number, sources: string[]) {
    const results: any[] = [];
    const errors: string[] = [];
    const tasks: Promise<void>[] = [];

    const runTask = async (name: string, fn: () => Promise<any[]>) => {
      try {
        const j = await fn();
        results.push(...j);
      } catch (err) {
        console.error(`Scraper error (${name}):`, err);
        errors.push(name);
      }
    };

    if (sources.includes("indeed"))
      tasks.push(runTask("indeed", () => scrapeIndeedRSS(query, location, days)));
    if (sources.includes("wuzzuf"))
      tasks.push(runTask("wuzzuf", () => scrapeWuzzuf(query, location, days)));
    if (sources.includes("bayt"))
      tasks.push(runTask("bayt", () => scrapeBayt(query, location, days)));
    if (sources.includes("remoteok"))
      tasks.push(runTask("remoteok", () => scrapeRemoteOKTagged(query)));

    await Promise.allSettled(tasks);
    
    results.sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
    );
    
    return { jobs: results.slice(0, 60), errors };
  }
}
