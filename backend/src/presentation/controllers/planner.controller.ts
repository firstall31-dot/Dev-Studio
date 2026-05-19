import { Router, Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { PlannerService } from "../../application/services/planner.service.js";

export const getAll = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { from, to } = req.query as { from?: string; to?: string };
  try {
    const data = await PlannerService.getAll(uid, from, to);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch planner tasks" });
  }
};

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const data = await PlannerService.create(uid, req.body);
    res.json(data);
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to create task";
    res
      .status(error instanceof Error && msg.includes("required") ? 400 : 500)
      .json({ error: msg });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await PlannerService.deleteById(uid, id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const postSuggest = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { date, tasks } = req.body;
  try {
    const data = await PlannerService.suggest(date, tasks);
    res.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "AI failed";
    res.status(500).json({ error: msg });
  }
};

export const postSeed = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { month, clear } = req.body as { month?: string; clear?: boolean };
  try {
    const data = await PlannerService.seed(uid, month, clear);
    res.json({ ok: true, count: data.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed planner tasks" });
  }
};

const router = Router();
router.get("/", getAll);
router.post("/", create);
router.delete("/:id", deleteById);
router.post("/suggest", postSuggest);
router.post("/seed", postSeed);
export default router;
