import { Router, Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { ProfileService } from "../../application/services/profile.service.js";

export const getAll = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const profile = await ProfileService.getByUserId(uid);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  const { displayName, avatarUrl, location } = req.body;
  try {
    const result = await ProfileService.upsert(uid, {
      displayName,
      avatarUrl,
      location,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const router = Router();
router.get("/", getAll);
router.post("/", create);
export default router;
