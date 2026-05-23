import { Router, Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";

const router = Router();

/**
 * POST /api/tools/agent-chat
 * Sends a message to the configured model using the agent's system prompt.
 * Supports all OpenAI-compatible models including o3 / o4-mini reasoning models.
 */
router.post("/agent-chat", async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { systemPrompt, model = "gpt-5", temperature, messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  const baseUrl =
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ?? "https://api.openai.com/v1";

  if (!apiKey) {
    return res.status(503).json({
      error:
        "OpenAI API key not configured. Set AI_INTEGRATIONS_OPENAI_API_KEY in your environment.",
    });
  }

  // Reasoning models (o3, o4-mini) use max_completion_tokens and fixed temperature=1
  const isReasoningModel =
    model === "o3" ||
    model === "o4-mini" ||
    model.startsWith("o1") ||
    model.startsWith("o3") ||
    model.startsWith("o4");

  const body: Record<string, unknown> = {
    model,
    messages: [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages,
    ],
    max_completion_tokens: 8192,
  };

  // Temperature is not supported for reasoning models (they use fixed value of 1)
  if (!isReasoningModel && temperature !== undefined) {
    body.temperature = temperature;
  }

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      let errMsg = `Upstream API error ${upstream.status}`;
      try {
        const parsed = JSON.parse(errText);
        errMsg = parsed?.error?.message ?? errMsg;
      } catch {}
      return res
        .status(upstream.status >= 500 ? 502 : upstream.status)
        .json({ error: errMsg });
    }

    const data = (await upstream.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    return res.json({ content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[tools/agent-chat]", msg);
    return res.status(502).json({ error: `Failed to reach AI provider: ${msg}` });
  }
});

export default router;
