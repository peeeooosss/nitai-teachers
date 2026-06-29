import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createShareLink = mutation({
  args: { contentId: v.id("generatedContent") },
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

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const token = crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).substring(2, 10);

    await ctx.db.patch(args.contentId, { shareToken: token });

    return token;
  },
});

export const getSharedContent = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("generatedContent")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.token))
      .unique();

    if (!content) throw new Error("Not found");

    return {
      toolName: content.toolName,
      inputs: content.inputs,
      output: content.output,
      createdAt: content._creationTime,
    };
  },
});

export const removeShareLink = mutation({
  args: { contentId: v.id("generatedContent") },
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

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.patch(args.contentId, { shareToken: undefined });
  },
});
