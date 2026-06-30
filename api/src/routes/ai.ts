import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { users, generatedContent } from "../db/schema";
import { getClient } from "../lib/ai";
import { authMiddleware } from "../middleware/auth";
import { getTokenIdentifier } from "../types";

const app = new Hono();

app.use("*", authMiddleware);

app.post("/generate", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  const limit = user.plan === "free" ? 10 : Infinity;
  if (user.monthlyUsage >= limit) {
    return c.json({ output: null, limitReached: true });
  }

  const { prompt, tool, systemPrompt, inputs, toolName } = await c.req.json<{
    prompt: string;
    tool: string;
    systemPrompt?: string;
    inputs?: Record<string, string>;
    toolName?: string;
  }>();

  const systemPrompts: Record<string, string> = {
    "lesson-planner": "You are an expert lesson plan creator. Create detailed, engaging lesson plans with objectives, activities, assessments, and differentiation strategies.",
    "quiz-generator": "You are an expert quiz creator. Generate well-structured quizzes with various question types at appropriate difficulty levels.",
    "content-differentiator": "You are an expert at differentiating educational content. Adapt material for different reading levels and learning needs while maintaining key concepts.",
    "rubric-maker": "You are an expert rubric designer. Create clear, detailed rubrics with well-defined criteria and performance levels.",
    "iep-assistant": "You are an expert IEP writer. Draft appropriate IEP goals, accommodations, and progress monitoring plans.",
    "custom": "You are NITAI AI Teacher Assistant, a helpful AI for educators. Generate educational content as requested.",
  };

  const sp = systemPrompt ?? systemPrompts[tool] ?? systemPrompts["custom"];

  const completion = await getClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: sp },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const output = completion.choices[0]?.message.content ?? "";

  await db
    .update(users)
    .set({ monthlyUsage: user.monthlyUsage + 1 })
    .where(eq(users.id, user.id));

  const [item] = await db
    .insert(generatedContent)
    .values({
      userId: user.id,
      toolId: tool,
      toolName: toolName ?? tool,
      inputs: inputs ?? { prompt },
      output,
    })
    .returning();

  return c.json({ output, contentId: String(item.id), limitReached: false });
});

app.post("/chat", async (c) => {
  const { messages } = await c.req.json<{
    messages: { role: "user" | "assistant"; content: string }[];
  }>();

  const completion = await getClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are NITAI AI Teacher Assistant, a helpful AI assistant for educators. " +
          "Help teachers with lesson planning, assessment creation, content generation, " +
          "and educational research. Be concise, practical, and pedagogically sound.",
      },
      ...messages,
    ],
    temperature: 0.7,
  });

  return c.json({ output: completion.choices[0]?.message.content ?? "" });
});

export default app;
