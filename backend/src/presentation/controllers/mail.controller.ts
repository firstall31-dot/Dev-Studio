import { Router, Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { MailService } from "../../application/services/mail.service.js";

export const getAll = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const data = await MailService.getAll(uid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mail templates" });
  }
};

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const result = await MailService.create(uid, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create mail template" });
  }
};

export const createBulk = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    const result = await MailService.createBulk(uid, items);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create bulk mail templates" });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await MailService.deleteById(uid, id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete mail template" });
  }
};

const router = Router();
router.get("/", getAll);
router.post("/", create);
router.post("/bulk", createBulk);
router.delete("/:id", deleteById);
export default router;
