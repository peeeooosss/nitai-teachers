import type { FunctionReference } from "convex/server";

export declare const api: {
  users: {
    updateCurrentUser: FunctionReference<"mutation", "public">;
    getCurrentUser: FunctionReference<"query", "public">;
    incrementUsage: FunctionReference<"mutation", "public">;
    upgradePlan: FunctionReference<"mutation", "public", { plan: string }>;
    completeOnboarding: FunctionReference<"mutation", "public">;
    selfPromoteAdmin: FunctionReference<"mutation", "public">;
    listAllUsers: FunctionReference<"query", "public">;
    setUserRole: FunctionReference<"mutation", "public", { userId: string; role: string }>;
    setUserPlan: FunctionReference<"mutation", "public", { userId: string; plan: string }>;
    getAdminStats: FunctionReference<"query", "public">;
    getContentStats: FunctionReference<"query", "public">;
    listAllContent: FunctionReference<"query", "public">;
    adminDeleteContent: FunctionReference<"mutation", "public", { contentId: string }>;
  };
  content: {
    saveContent: FunctionReference<"mutation", "public">;
    getHistory: FunctionReference<"query", "public">;
    deleteContent: FunctionReference<"mutation", "public", { id: string }>;
  };
  ai: {
    generateContent: FunctionReference<"action", "public">;
    chatWithAssistant: FunctionReference<"action", "public">;
  };
  notifications: {
    getMyNotifications: FunctionReference<"query", "public">;
    getUnreadCount: FunctionReference<"query", "public">;
    markAllRead: FunctionReference<"mutation", "public">;
    markRead: FunctionReference<"mutation", "public", { id: string }>;
    deleteNotification: FunctionReference<"mutation", "public", { id: string }>;
  };
  sharing: {
    createShareLink: FunctionReference<"mutation", "public", { contentId: string }>;
    getSharedContent: FunctionReference<"query", "public", { token: string }>;
    removeShareLink: FunctionReference<"mutation", "public", { contentId: string }>;
  };
};

export declare const internal: {};
