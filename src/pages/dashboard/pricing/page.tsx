import { useMutation } from "convex/react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    description: "For trying out NITAI AI",
    features: [
      "10 AI generations per month",
      "All 17+ tools",
      "Basic support",
      "Share links",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For individual teachers",
    features: [
      "Unlimited AI generations",
      "All 17+ tools",
      "Priority support",
      "Share links",
      "Export to PDF",
      "Advanced analytics",
    ],
    popular: true,
  },
  {
    id: "school",
    name: "School",
    price: "$8",
    period: "/teacher/month",
    description: "For schools and districts",
    features: [
      "Everything in Pro",
      "Bulk user management",
      "Admin dashboard",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const upgradePlan = useMutation(api.users.upgradePlan);

  const handleUpgrade = async (plan: string) => {
    setLoading(plan);
    try {
      await upgradePlan({ plan });
      toast.success(`Upgraded to ${plan} plan!`);
    } catch {
      toast.error("Failed to upgrade plan");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plans & Pricing</h1>
        <p className="text-muted-foreground">
          Choose the plan that fits your needs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              plan.popular
                ? "border-2 border-violet-500 shadow-lg shadow-violet-500/10"
                : "border-border/50"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-violet-500 to-blue-500 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading !== null}
              >
                {loading === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {plan.id === "free" ? "Current Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
