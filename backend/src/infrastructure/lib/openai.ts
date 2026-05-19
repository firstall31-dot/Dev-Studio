import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

/**
 * Returns a configured instance of the OpenAI client.
 * Prioritizes standard local environment variables (OPENAI_API_KEY, OPENAI_BASE_URL)
 * and falls back to Replit's integration environment variables.
 */
export function getOpenAI(): OpenAI {
  const apiKey =
    process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  const baseURL =
    process.env.OPENAI_BASE_URL || process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key is missing. Please configure OPENAI_API_KEY in your local environment variables or .env file.",
    );
  }

  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    });
  }

  return openaiInstance;
}
