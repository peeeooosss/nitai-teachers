import { ArrowRight } from "lucide-react";

import { useAuthState } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

function googleSignInUrl() {
  const redirect = `${window.location.origin}/auth/callback`;
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirect,
    response_type: "code",
    scope: "openid email profile",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export default function CTA() {
  const { isAuthenticated } = useAuthState();

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 p-10 sm:p-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Teaching?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join thousands of educators using NITAI AI to save time and create
            better learning experiences.
          </p>
          <div className="mt-8">
            {isAuthenticated ? (
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <a href={googleSignInUrl()}>
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
