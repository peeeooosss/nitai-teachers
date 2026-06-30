import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<any>("/api/users/me").catch(() => ({})),
      api.get<any[]>("/api/content").catch(() => []),
    ])
      .then(([userData, contents]) => {
        const contentByTool: Record<string, number> = {};
        contents.forEach((c) => {
          const tool = c.toolName ?? c.tool ?? "unknown";
          contentByTool[tool] = (contentByTool[tool] ?? 0) + 1;
        });
        setStats({
          totalContent: contents.length,
          contentByTool,
          user: userData,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const toolIcons: Record<string, any> = {
    "lesson-planner": BookOpen,
    "quiz-generator": Target,
    "content-differentiator": GraduationCap,
    "rubric-maker": FileText,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Track your usage and content generation
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalContent ?? 0}</div>
            <p className="text-xs text-muted-foreground">pieces generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lesson Plans</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.contentByTool?.["lesson-planner"] ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.contentByTool?.["quiz-generator"] ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.totalContent ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">items generated</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage by Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats?.contentByTool ?? {}).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No data yet. Start using tools to see your usage breakdown.
              </p>
            ) : (
              Object.entries(stats?.contentByTool ?? {}).map(
                ([tool, count]: [string, any]) => {
                  const Icon = toolIcons[tool] ?? FileText;
                  const total = stats?.totalContent ?? 1;
                  const percentage = Math.round((count / total) * 100);
                  return (
                    <div key={tool} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">
                            {tool.replace(/-/g, " ")}
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
