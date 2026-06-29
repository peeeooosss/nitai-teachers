import { useAuthCallback } from "@usehercules/auth/react";
import { useNavigate } from "react-router-dom";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const updateCurrentUser = useMutation(api.users.updateCurrentUser);

  useAuthCallback({
    onSuccess: async () => {
      try {
        await updateCurrentUser();
      } catch {}
      navigate("/", { replace: true });
    },
    onNoAuthParams: () => {
      navigate("/", { replace: true });
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
