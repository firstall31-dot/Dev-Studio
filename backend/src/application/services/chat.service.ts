import { getOpenAI } from "../../infrastructure/lib/openai.js";

export class ChatService {
  static async createChatCompletion(
    prompt: string,
    systemPrompt?: string,
    config?: { model?: string; temperature?: number; maxTokens?: number },
  ) {
    if (!prompt) {
      throw new Error("prompt is required");
    }

    const response = await getOpenAI().chat.completions.create({
      model: config?.model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are an expert AI coding assistant.",
        },
        { role: "user", content: prompt },
      ],
      temperature: config?.temperature ?? 0.7,
      max_completion_tokens: config?.maxTokens,
    });

    return response.choices[0]?.message?.content ?? "";
  }
}
