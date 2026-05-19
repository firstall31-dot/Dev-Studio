import { Router, Request, Response } from "express";
import { ChatService } from "../../application/services/chat.service.js";

export const create = async (req: Request, res: Response) => {
  try {
    const { prompt, systemPrompt, config } = req.body;
    const reply = await ChatService.createChatCompletion(
      prompt,
      systemPrompt,
      config,
    );
    res.json({ reply });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(errorMessage === "prompt is required" ? 400 : 500)
      .json({ error: errorMessage });
  }
};

const router = Router();
router.post("/", create);
export default router;
