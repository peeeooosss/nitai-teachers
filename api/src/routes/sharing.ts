import { Hono } from "hono";
import { eq } from "drizzle-orm";
import crypto from "crypto";

import { db } from "../db";
import { users, generatedContent } from "../db/schema";
import { authMiddleware, optionalAuth } from "../middleware/auth";
import { getTokenIdentifier } from "../types";

const app = new Hono();

app.post("/", authMiddleware, async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  const { contentId } = await c.req.json<{ contentId: number }>();

  const item = await db.query.generatedContent.findFirst({
    where: eq(generatedContent.id, contentId),
  });
  if (!item || item.userId !== user.id) {
    return c.json({ error: "Not found" }, 404);
  }

  const token = crypto.randomUUID().replace(/-/g, "") +
    Math.random().toString(36).substring(2, 10);

  await db
    .update(generatedContent)
    .set({ shareToken: token })
    .where(eq(generatedContent.id, contentId));

  return c.json({ token });
});

app.get("/:token", optionalAuth, async (c) => {
  const token = c.req.param("token");

  const item = await db.query.generatedContent.findFirst({
    where: eq(generatedContent.shareToken, token!),
  });
  if (!item) return c.json({ error: "Not found" }, 404);

  return c.json({
    toolName: item.toolName,
    inputs: item.inputs,
    output: item.output,
    createdAt: item.createdAt?.toISOString(),
  });
});

app.delete("/:id", authMiddleware, async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const id = parseInt(c.req.param("id")!);

  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  const item = await db.query.generatedContent.findFirst({
    where: eq(generatedContent.id, id),
  });
  if (!item || item.userId !== user.id) {
    return c.json({ error: "Not found" }, 404);
  }

  await db
    .update(generatedContent)
    .set({ shareToken: null })
    .where(eq(generatedContent.id, id));

  return c.json({ success: true });
});

export default app;
