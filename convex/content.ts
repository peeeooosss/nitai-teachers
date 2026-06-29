import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOpts } from "convex/server";

export const saveContent = mutation({
  args: {
    toolId: v.string(),
    toolName: v.string(),
    inputs: v.record(v.string(), v.string()),
    output: v.string(),
  },
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

    await ctx.db.insert("generatedContent", {
      userId: user._id,
      toolId: args.toolId,
      toolName: args.toolName,
      inputs: args.inputs,
      output: args.output,
    });
  },
});

export const getHistory = query({
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

    if (!user) throw new Error("User not found");

    return await ctx.db
      .query("generatedContent")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const deleteContent = mutation({
  args: { id: v.id("generatedContent") },
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

    const content = await ctx.db.get(args.id);
    if (!content || content.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
