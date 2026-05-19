import { Router, Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { OffersService } from "../../application/services/offers.service.js";

export const getAll = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const offers = await OffersService.getAll(uid);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const result = await OffersService.create(uid, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create offer" });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await OffersService.deleteById(uid, id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete offer" });
  }
};

const router = Router();
router.get("/", getAll);
router.post("/", create);
router.delete("/:id", deleteById);
export default router;
