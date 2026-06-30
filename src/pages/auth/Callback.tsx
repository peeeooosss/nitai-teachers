import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api, setAuthToken } from "@/lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error || !code) {
      toast.error("Authentication failed");
      navigate("/", { replace: true });
      return;
    }

    api
      .post<{ token: string }>("/api/auth/google", { code })
      .then((res) => {
        setAuthToken(res.token);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Authentication failed");
        navigate("/", { replace: true });
      });
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
