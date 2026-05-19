import { Router, Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { CVService } from "../../application/services/cv.service.js";

export const getAll = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const data = await CVService.getAll(uid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch CVs" });
  }
};

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const data = await CVService.create(uid, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to create CV" });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await CVService.deleteById(uid, id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete CV" });
  }
};

export const postAtsCheck = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { cvProfile, jobDescription } = req.body;
  try {
    const result = await CVService.atsCheck(cvProfile, jobDescription);
    res.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "AI analysis failed";
    res.status(error instanceof Error && msg.includes("required") ? 400 : 500).json({ error: msg });
  }
};

export const postParsePdf = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const text = CVService.parsePdf(req.body.fileBase64);
    res.json({ text });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to parse PDF";
    res.status(error instanceof Error && msg.includes("required") ? 400 : 500).json({ error: msg });
  }
};

const router = Router();
router.get("/", getAll);
router.post("/", create);
router.delete("/:id", deleteById);
router.post("/ats-check", postAtsCheck);
router.post("/parse-pdf", postParsePdf);
export default router;
