import { useUser } from "@usehercules/auth/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

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
import NotFound from "@/pages/NotFound";
import SharedContentPage from "@/pages/shared/page";

export default function App() {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
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
    </Router>
  );
}
