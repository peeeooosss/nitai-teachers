import { useQuery } from "convex/react";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardHome() {
  const currentUser = useQuery(api.users.getCurrentUser);

  const usage = currentUser?.monthlyUsage ?? 0;
  const limit = currentUser?.plan === "free" ? 10 : Infinity;
  const usagePercent = Math.min((usage / limit) * 100, 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your NITAI AI dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentUser?.plan === "free"
                ? `${limit - usage} remaining this month`
                : "Unlimited"}
            </p>
            {currentUser?.plan === "free" && (
              <Progress value={usagePercent} className="mt-3" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {currentUser?.plan ?? "free"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentUser?.plan === "free"
                ? "Upgrade for unlimited access"
                : "Unlimited generations"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump into your most-used tools
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard/tools/lesson-planner">
            <Button variant="outline" className="w-full justify-start gap-2">
              <BookOpen className="h-4 w-4" />
              Lesson Planner
            </Button>
          </Link>
          <Link to="/dashboard/tools/quiz-generator">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Sparkles className="h-4 w-4" />
              Quiz Generator
            </Button>
          </Link>
          <Link to="/dashboard/tools/assignment-creator">
            <Button variant="outline" className="w-full justify-start gap-2">
              <TrendingUp className="h-4 w-4" />
              Assignment Creator
            </Button>
          </Link>
          <Link to="/dashboard/tools/study-guide">
            <Button variant="outline" className="w-full justify-start gap-2">
              <BookOpen className="h-4 w-4" />
              Study Guide
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
