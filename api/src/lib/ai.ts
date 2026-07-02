import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY ?? "sk-placeholder",
      fetch: globalThis.fetch,
    });
  }
  return _client;
}
