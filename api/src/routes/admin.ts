import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";

import { db } from "../db";
import { users, generatedContent } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { getTokenIdentifier } from "../types";

const app = new Hono();

app.use("*", authMiddleware);

async function requireAdmin(c: any, next: any) {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user || user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  c.set("adminUser", user);
  await next();
}

app.use("*", requireAdmin);

app.get("/stats", async (c) => {
  const allUsers = await db.select().from(users);
  const totalUsers = allUsers.length;
  const proUsers = allUsers.filter((u) => u.plan === "pro").length;
  const freeUsers = allUsers.filter((u) => u.plan === "free").length;
  const schoolUsers = allUsers.filter((u) => u.plan === "school").length;
  const adminCount = allUsers.filter((u) => u.role === "admin").length;

  return c.json({ totalUsers, proUsers, freeUsers, schoolUsers, adminCount });
});

app.get("/content/stats", async (c) => {
  const allContent = await db.select().from(generatedContent);
  const totalGenerations = allContent.length;

  const toolCounts: Record<string, number> = {};
  for (const item of allContent) {
    toolCounts[item.toolId] = (toolCounts[item.toolId] ?? 0) + 1;
  }

  return c.json({ totalGenerations, generationsByTool: toolCounts });
});

app.get("/users", async (c) => {
  const items = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(100);

  return c.json(items);
});

app.post("/users/role", async (c) => {
  const { userId, role } = await c.req.json<{ userId: number; role: string }>();
  await db.update(users).set({ role }).where(eq(users.id, userId));
  return c.json({ success: true });
});

app.post("/users/plan", async (c) => {
  const { userId, plan } = await c.req.json<{ userId: number; plan: string }>();
  await db.update(users).set({ plan }).where(eq(users.id, userId));
  return c.json({ success: true });
});

app.get("/content", async (c) => {
  const cursor = parseInt(c.req.query("cursor") ?? "0");
  const limit = parseInt(c.req.query("limit") ?? "50");

  const items = await db
    .select()
    .from(generatedContent)
    .orderBy(desc(generatedContent.createdAt))
    .limit(limit)
    .offset(cursor);

  return c.json({ page: items, nextCursor: cursor + items.length });
});

app.delete("/content/:id", async (c) => {
  const id = parseInt(c.req.param("id")!);
  await db.delete(generatedContent).where(eq(generatedContent.id, id));
  return c.json({ success: true });
});

export default app;
