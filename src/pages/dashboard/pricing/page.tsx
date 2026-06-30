import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For getting started",
    features: [
      "50 AI generations per month",
      "Basic tools access",
      "Standard output quality",
      "Email support",
    ],
    priceId: "free",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For individual teachers",
    features: [
      "Unlimited AI generations",
      "All tools & features",
      "Premium output quality",
      "Priority support",
      "Advanced analytics",
      "Content sharing",
    ],
    priceId: "pro",
    popular: true,
  },
  {
    name: "School",
    price: "$49",
    period: "/month",
    description: "For schools & districts",
    features: [
      "Everything in Pro",
      "Team accounts (up to 10)",
      "Admin dashboard",
      "Usage analytics",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    priceId: "school",
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  const handleUpgrade = async (priceId: string) => {
    if (priceId === "free") {
      toast.info("You're already on the Free plan");
      return;
    }
    try {
      await api.post("/api/users/upgrade", { plan: priceId });
      toast.success(`Upgraded to ${priceId} plan!`);
      navigate("/dashboard");
    } catch {
      toast.error("Failed to upgrade plan");
    }
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose the plan that works best for you
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mx-auto max-w-5xl">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular ? "border-primary shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
                onClick={() => handleUpgrade(plan.priceId)}
              >
                {plan.priceId === "free" ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
