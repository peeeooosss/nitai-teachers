import { useAuth, useUser } from "@usehercules/auth/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function Hero() {
  const { signinRedirect } = useAuth();
  const { isAuthenticated } = useUser();

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
            <Button size="lg" className="gap-2" onClick={() => signinRedirect()}>
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Free plan includes 10 AI generations per month. No credit card required.
        </p>
      </div>
    </section>
  );
}
