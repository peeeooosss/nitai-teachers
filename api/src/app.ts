import { Hono } from "hono";
import { cors } from "hono/cors";

import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import contentRoutes from "./routes/content";
import aiRoutes from "./routes/ai";
import notificationsRoutes from "./routes/notifications";
import sharingRoutes from "./routes/sharing";
import adminRoutes from "./routes/admin";

const app = new Hono();

app.use("/*", cors());

app.route("/api/auth", authRoutes);
app.route("/api/users", usersRoutes);
app.route("/api/content", contentRoutes);
app.route("/api/ai", aiRoutes);
app.route("/api/notifications", notificationsRoutes);
app.route("/api/share", sharingRoutes);
app.route("/api/admin", adminRoutes);

app.get("/api/health", (c) => c.json({ status: "ok" }));

export default app;
