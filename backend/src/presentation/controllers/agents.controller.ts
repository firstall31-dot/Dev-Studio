import { Router, Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { AgentsService } from "../../application/services/agents.service.js";

export const getAll = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const data = await AgentsService.getAll(uid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
};

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const result = await AgentsService.create(uid, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create agent" });
  }
};

export const createBulk = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    const result = await AgentsService.createBulk(uid, items);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create bulk agents" });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await AgentsService.deleteById(uid, id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete agent" });
  }
};

const router = Router();
router.get("/", getAll);
router.post("/", create);
router.post("/bulk", createBulk);
router.delete("/:id", deleteById);
export default router;
