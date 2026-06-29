import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOpts } from "convex/server";

export const updateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: identity.name ?? undefined,
        email: identity.email ?? undefined,
      });
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name ?? undefined,
      email: identity.email ?? undefined,
      plan: "free",
      monthlyUsage: 0,
      usageResetAt: new Date().toISOString(),
      role: "user",
      onboarded: false,
    });

    await ctx.db.insert("notifications", {
      userId,
      title: "Welcome to NITAI AI!",
      message:
        "Start exploring our AI-powered tools to enhance your teaching workflow.",
      type: "success",
      read: false,
    });

    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
  },
});

export const incrementUsage = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error("User not found");

    const limit = user.plan === "free" ? 10 : Infinity;

    if ((user.monthlyUsage ?? 0) >= limit) {
      return { allowed: false, usage: user.monthlyUsage ?? 0, limit };
    }

    await ctx.db.patch(user._id, {
      monthlyUsage: (user.monthlyUsage ?? 0) + 1,
    });

    return {
      allowed: true,
      usage: (user.monthlyUsage ?? 0) + 1,
      limit,
    };
  },
});

export const upgradePlan = mutation({
  args: { plan: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { plan: args.plan });

    await ctx.db.insert("notifications", {
      userId: user._id,
      title: "Plan Upgraded!",
      message: `Your plan has been upgraded to ${args.plan}. Enjoy unlimited AI generations!`,
      type: "success",
      read: false,
    });
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { onboarded: true });
  },
});

export const selfPromoteAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();

    if (existingAdmin) throw new Error("Admin already exists");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { role: "admin" });
  },
});

export const listAllUsers = query({
  args: { paginationOpts },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user || user.role !== "admin") throw new Error("Not authorized");

    return await ctx.db.query("users").paginate(args.paginationOpts);
  },
});

export const setUserRole = mutation({
  args: { userId: v.id("users"), role: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const setUserPlan = mutation({
  args: { userId: v.id("users"), plan: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    await ctx.db.patch(args.userId, { plan: args.plan });
  },
});

export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    const allUsers = await ctx.db.query("users").collect();
    const totalUsers = allUsers.length;
    const proUsers = allUsers.filter((u) => u.plan === "pro").length;
    const freeUsers = allUsers.filter((u) => u.plan === "free").length;
    const schoolUsers = allUsers.filter((u) => u.plan === "school").length;
    const adminCount = allUsers.filter((u) => u.role === "admin").length;

    return { totalUsers, proUsers, freeUsers, schoolUsers, adminCount };
  },
});

export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    const allContent = await ctx.db.query("generatedContent").collect();
    const totalGenerations = allContent.length;

    const toolCounts = new Map<string, number>();
    for (const c of allContent) {
      toolCounts.set(c.toolId, (toolCounts.get(c.toolId) ?? 0) + 1);
    }
    const generationsByTool = Object.fromEntries(toolCounts);

    return { totalGenerations, generationsByTool };
  },
});

export const listAllContent = query({
  args: { paginationOpts },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    return await ctx.db.query("generatedContent").paginate(args.paginationOpts);
  },
});

export const adminDeleteContent = mutation({
  args: { contentId: v.id("generatedContent") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    await ctx.db.delete(args.contentId);
  },
});
