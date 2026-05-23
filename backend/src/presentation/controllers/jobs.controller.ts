import { Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { jobsService } from "../../infrastructure/di/container.js";

export const getSaved = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const data = await jobsService.getSaved(uid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved jobs" });
  }
};

export const postSaved = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const result = await jobsService.saveJob(uid, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to save job" });
  }
};

export const deleteSavedById = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await jobsService.deleteSavedById(uid, id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete saved job" });
  }
};

export const getRemote = async (req: Request, res: Response) => {
  try {
    const tag = String(req.query.tag || "");
    const data = await jobsService.getRemoteJobs(tag);
    res.json(data);
  } catch {
    res.status(502).json({ error: "Failed to fetch remote jobs" });
  }
};

export const getScrape = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const query = String(req.query.q || "full stack developer");
    const location = String(req.query.location || "");
    const days = Math.max(1, Math.min(Number(req.query.days || 1), 30));
    const sources = String(req.query.sources || "indeed,wuzzuf,bayt,remoteok")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await jobsService.scrapeJobs(query, location, days, sources);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape jobs" });
  }
};

export const postScrape = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const { query = "full stack developer", location = "", days = 1, sources = [] } = req.body ?? {};
    const sourcesArr = Array.isArray(sources) && sources.length
      ? sources
      : ["indeed", "wuzzuf", "bayt", "remoteok"];
    const safeDays = Math.max(1, Math.min(Number(days) || 1, 30));
    const result = await jobsService.scrapeJobs(String(query), String(location), safeDays, sourcesArr);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape jobs" });
  }
};
