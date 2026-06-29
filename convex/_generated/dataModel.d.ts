import type { GenericId, TableNamesInDataModel } from "convex/server";

export type TableNames = "users" | "generatedContent" | "chatMessages" | "notifications";

export type Doc<TableName extends TableNames> = {
  users: {
    _id: GenericId<"users">;
    _creationTime: number;
    tokenIdentifier: string;
    name?: string;
    email?: string;
    plan?: string;
    monthlyUsage?: number;
    usageResetAt?: string;
    role?: string;
    onboarded?: boolean;
  };
  generatedContent: {
    _id: GenericId<"generatedContent">;
    _creationTime: number;
    userId: GenericId<"users">;
    toolId: string;
    toolName: string;
    inputs: Record<string, string>;
    output: string;
    shareToken?: string;
  };
  chatMessages: {
    _id: GenericId<"chatMessages">;
    _creationTime: number;
    userId: GenericId<"users">;
    role: "user" | "assistant";
    content: string;
  };
  notifications: {
    _id: GenericId<"notifications">;
    _creationTime: number;
    userId: GenericId<"users">;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "tip";
    read: boolean;
    link?: string;
  };
}[TableName];

export type Id<TableName extends TableNames> = GenericId<TableName>;
