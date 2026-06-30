try {
  // Only needed in local dev; Netlify injects env vars natively
  const dotenv = await import("dotenv");
  dotenv.config();
} catch {}
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
