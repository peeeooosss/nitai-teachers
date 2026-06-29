import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://ai-gateway.hercules.app/v1",
  apiKey: process.env.OPENAI_API_KEY!,
});

export const generateContent = action({
  args: {
    toolId: v.string(),
    toolName: v.string(),
    systemPrompt: v.string(),
    userPrompt: v.string(),
    inputs: v.record(v.string(), v.string()),
  },
  handler: async (ctx, args) => {
    const usageResult = await ctx.runMutation(api.users.incrementUsage, {});
    if (!usageResult.allowed) {
      return { output: null, limitReached: true };
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-5-mini",
      messages: [
        { role: "system", content: args.systemPrompt },
        { role: "user", content: args.userPrompt },
      ],
      temperature: 0.7,
    });

    const output = completion.choices[0]?.message.content ?? "";

    await ctx.runMutation(api.content.saveContent, {
      toolId: args.toolId,
      toolName: args.toolName,
      inputs: args.inputs,
      output,
    });

    return { output, limitReached: false };
  },
});

export const chatWithAssistant = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const completion = await client.chat.completions.create({
      model: "openai/gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are NITAI AI Teacher Assistant, a helpful AI assistant for educators. " +
            "Help teachers with lesson planning, assessment creation, content generation, " +
            "and educational research. Be concise, practical, and pedagogically sound.",
        },
        ...args.messages,
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message.content ?? "";
  },
});
