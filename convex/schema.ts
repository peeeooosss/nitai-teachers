import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    plan: v.optional(v.string()),
    monthlyUsage: v.optional(v.number()),
    usageResetAt: v.optional(v.string()),
    role: v.optional(v.string()),
    onboarded: v.optional(v.boolean()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_role", ["role"]),

  generatedContent: defineTable({
    userId: v.id("users"),
    toolId: v.string(),
    toolName: v.string(),
    inputs: v.record(v.string(), v.string()),
    output: v.string(),
    shareToken: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_tool", ["userId", "toolId"])
    .index("by_share_token", ["shareToken"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("tip"),
    ),
    read: v.boolean(),
    link: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "read"]),
});
