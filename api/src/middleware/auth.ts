import type { Context, Next } from "hono";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return encoder.encode(secret);
}

export async function authMiddleware(c: Context, next: Next) {
  const auth = c.req.header("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const { payload } = await jwtVerify(auth.slice(7), getSecret());
    c.set("tokenIdentifier", payload.sub!);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}

export async function optionalAuth(c: Context, next: Next) {
  const auth = c.req.header("Authorization");
  if (auth?.startsWith("Bearer ")) {
    try {
      const { payload } = await jwtVerify(auth.slice(7), getSecret());
      c.set("tokenIdentifier", payload.sub!);
    } catch {}
  }
  await next();
}
