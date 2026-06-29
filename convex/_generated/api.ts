export const api = {
  users: {
    updateCurrentUser: "users:updateCurrentUser" as any,
    getCurrentUser: "users:getCurrentUser" as any,
    incrementUsage: "users:incrementUsage" as any,
    upgradePlan: "users:upgradePlan" as any,
    completeOnboarding: "users:completeOnboarding" as any,
    selfPromoteAdmin: "users:selfPromoteAdmin" as any,
    listAllUsers: "users:listAllUsers" as any,
    setUserRole: "users:setUserRole" as any,
    setUserPlan: "users:setUserPlan" as any,
    getAdminStats: "users:getAdminStats" as any,
    getContentStats: "users:getContentStats" as any,
    listAllContent: "users:listAllContent" as any,
    adminDeleteContent: "users:adminDeleteContent" as any,
  },
  content: {
    saveContent: "content:saveContent" as any,
    getHistory: "content:getHistory" as any,
    deleteContent: "content:deleteContent" as any,
  },
  ai: {
    generateContent: "ai:generateContent" as any,
    chatWithAssistant: "ai:chatWithAssistant" as any,
  },
  notifications: {
    getMyNotifications: "notifications:getMyNotifications" as any,
    getUnreadCount: "notifications:getUnreadCount" as any,
    markAllRead: "notifications:markAllRead" as any,
    markRead: "notifications:markRead" as any,
    deleteNotification: "notifications:deleteNotification" as any,
  },
  sharing: {
    createShareLink: "sharing:createShareLink" as any,
    getSharedContent: "sharing:getSharedContent" as any,
    removeShareLink: "sharing:removeShareLink" as any,
  },
};

export const internal = {};
