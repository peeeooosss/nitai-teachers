import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";

import { db } from "../db";
import { users, generatedContent } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { getTokenIdentifier } from "../types";

const app = new Hono();

app.use("*", authMiddleware);

app.get("/", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json([]);

  const items = await db
    .select()
    .from(generatedContent)
    .where(eq(generatedContent.userId, user.id))
    .orderBy(desc(generatedContent.createdAt))
    .limit(50);

  return c.json(items);
});

app.post("/", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  const { toolId, toolName, inputs, output } = await c.req.json<{
    toolId: string;
    toolName: string;
    inputs: Record<string, string>;
    output: string;
  }>();

  const [item] = await db
    .insert(generatedContent)
    .values({ userId: user.id, toolId, toolName, inputs, output })
    .returning();

  return c.json(item);
});

app.delete("/:id", async (c) => {
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

  await db.delete(generatedContent).where(eq(generatedContent.id, id));
  return c.json({ success: true });
});

export default app;
