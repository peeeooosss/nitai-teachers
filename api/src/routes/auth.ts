import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { SignJWT, createRemoteJWKSet, jwtVerify } from "jose";

import { db } from "../db";
import { users, notifications } from "../db/schema";

const app = new Hono();

const googleJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

app.post("/google", async (c) => {
  const { code } = await c.req.json<{ code: string }>();

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("Google token exchange failed:", err);
    return c.json({ error: "Failed to authenticate with Google" }, 400);
  }

  const tokens = (await tokenRes.json()) as any;
  const idToken = tokens.id_token as string;
  if (!idToken) {
    return c.json({ error: "No ID token received" }, 400);
  }

  // Verify Google's ID token
  let googlePayload: any;
  try {
    const result = await jwtVerify(idToken, googleJwks, {
      issuer: "https://accounts.google.com",
      audience: GOOGLE_CLIENT_ID,
    });
    googlePayload = result.payload;
  } catch {
    return c.json({ error: "Invalid Google token" }, 401);
  }

  const tokenIdentifier = googlePayload.sub as string;
  const email = (googlePayload.email as string) ?? "";
  const name = (googlePayload.name as string) ?? email.split("@")[0] ?? "User";

  // Upsert user
  let user = await db.query.users.findFirst({
    where: eq(users.tokenIdentifier, tokenIdentifier),
  });

  if (user) {
    await db
      .update(users)
      .set({ email, name })
      .where(eq(users.id, user.id));
  } else {
    const [newUser] = await db
      .insert(users)
      .values({ tokenIdentifier, name, email, plan: "free", monthlyUsage: 0, role: "user", onboarded: false })
      .returning();
    user = newUser;

    await db.insert(notifications).values({
      userId: user.id,
      title: "Welcome to NITAI AI!",
      message: "Start exploring our AI-powered tools to enhance your teaching workflow.",
      type: "success",
      read: false,
    });
  }

  // Sign our own JWT
  const jwt = await new SignJWT({ sub: tokenIdentifier, email, name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me"));

  return c.json({ token: jwt, user: { email, name } });
});

export default app;
