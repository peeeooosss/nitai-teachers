import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";

import { db } from "../db";
import { users, notifications } from "../db/schema";
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
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(30);

  return c.json(items);
});

app.get("/unread", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json(0);

  const items = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, user.id),
        eq(notifications.read, false),
      ),
    );

  return c.json(items.length);
});

app.post("/read", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(
        eq(notifications.userId, user.id),
        eq(notifications.read, false),
      ),
    );

  return c.json({ success: true });
});

app.post("/:id/read", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const id = parseInt(c.req.param("id")!);

  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  const item = await db.query.notifications.findFirst({
    where: eq(notifications.id, id),
  });
  if (!item || item.userId !== user.id) {
    return c.json({ error: "Not found" }, 404);
  }

  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, id));

  return c.json({ success: true });
});

app.delete("/:id", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const id = parseInt(c.req.param("id")!);

  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  const item = await db.query.notifications.findFirst({
    where: eq(notifications.id, id),
  });
  if (!item || item.userId !== user.id) {
    return c.json({ error: "Not found" }, 404);
  }

  await db.delete(notifications).where(eq(notifications.id, id));
  return c.json({ success: true });
});

export default app;
