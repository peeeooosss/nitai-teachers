import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function Hero() {
  const { isAuthenticated } = useAuthState();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent dark:from-violet-950/20" />
      <div className="absolute top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-400/20 to-blue-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
          <Sparkles className="h-4 w-4" />
          AI-Powered Teaching Assistant
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Teach Smarter with{" "}
          <span className="gradient-text">NITAI AI</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
          Generate lesson plans, quizzes, assignments, and more with AI.
          Save hours every week and focus on what matters most — your students.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <a href={googleSignInUrl()}>
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link to="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4" />
                Sign in with email instead
              </Link>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Free plan includes 10 AI generations per month. No credit card required.
        </p>
      </div>
    </section>
  );
}
