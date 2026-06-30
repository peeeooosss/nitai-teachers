import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { users, notifications } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { getTokenIdentifier } from "../types";

const app = new Hono();

app.use("*", authMiddleware);

app.get("/me", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);
  return c.json(user);
});

app.post("/usage/increment", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  const limit = user.plan === "free" ? 10 : Infinity;

  if (user.monthlyUsage >= limit) {
    return c.json({ allowed: false, usage: user.monthlyUsage, limit });
  }

  await db
    .update(users)
    .set({ monthlyUsage: user.monthlyUsage + 1 })
    .where(eq(users.id, user.id));

  return c.json({
    allowed: true,
    usage: user.monthlyUsage + 1,
    limit,
  });
});

app.post("/plan", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const { plan } = await c.req.json<{ plan: string }>();

  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  await db.update(users).set({ plan }).where(eq(users.id, user.id));

  await db.insert(notifications).values({
    userId: user.id,
    title: "Plan Upgraded!",
    message: `Your plan has been upgraded to ${plan}. Enjoy unlimited AI generations!`,
    type: "success",
    read: false,
  });

  return c.json({ success: true });
});

app.post("/onboarding", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);
  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  await db.update(users).set({ onboarded: true }).where(eq(users.id, user.id));
  return c.json({ success: true });
});

app.post("/promote-admin", async (c) => {
  const tokenIdentifier = getTokenIdentifier(c);

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.role, "admin"),
  });
  if (existingAdmin) return c.json({ error: "Admin already exists" }, 400);

  const user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });
  if (!user) return c.json({ error: "Not found" }, 404);

  await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
  return c.json({ success: true });
});

export default app;
