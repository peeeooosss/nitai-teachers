import { useAuth, useUser } from "@usehercules/auth/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CTA() {
  const { signinRedirect } = useAuth();
  const { isAuthenticated } = useUser();

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
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                onClick={() => signinRedirect()}
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
