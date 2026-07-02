import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { setAuthToken } from "@/lib/api";
import { AuthContext, decodeToken, getStoredToken, type AuthUser } from "@/lib/auth";
import AuthCallback from "@/pages/auth/Callback";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardAnalytics from "@/pages/dashboard/analytics/page";
import DashboardAdmin from "@/pages/dashboard/admin/page";
import DashboardHistory from "@/pages/dashboard/history/page";
import DashboardHome from "@/pages/dashboard/page";
import PricingPage from "@/pages/dashboard/pricing/page";
import DashboardProfile from "@/pages/dashboard/profile/page";
import DashboardTools from "@/pages/dashboard/tools/page";
import ToolPage from "@/pages/dashboard/tools/[toolId]/page";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import SharedContentPage from "@/pages/shared/page";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setAuthToken(token);
      setUser(decodeToken(token));
    }
    setLoading(false);
  }, []);

  const authState = { user, isAuthenticated: !!user };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Router>
      <AuthContext.Provider value={authState}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/shared/:token" element={<SharedContentPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="tools" element={<DashboardTools />} />
            <Route path="tools/:toolId" element={<ToolPage />} />
            <Route path="history" element={<DashboardHistory />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="admin" element={<DashboardAdmin />} />
            <Route path="profile" element={<DashboardProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}
