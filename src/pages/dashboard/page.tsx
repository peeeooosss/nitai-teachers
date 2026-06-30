import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/lib/api";
import { useAuthState } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    id: "lesson-planner",
    name: "Lesson Planner",
    description: "Create comprehensive lesson plans with objectives, activities, and assessments",
    icon: Sparkles,
    color: "bg-blue-500",
    href: "/dashboard/tools/lesson-planner",
  },
  {
    id: "quiz-generator",
    name: "Quiz Generator",
    description: "Generate quizzes, tests, and assessments with varying difficulty levels",
    icon: Sparkles,
    color: "bg-green-500",
    href: "/dashboard/tools/quiz-generator",
  },
  {
    id: "content-dif",
    name: "Content Differentiator",
    description: "Adapt content for different reading levels and learning needs",
    icon: Sparkles,
    color: "bg-violet-500",
    href: "/dashboard/tools/content-differentiator",
  },
  {
    id: "rubric-maker",
    name: "Rubric Maker",
    description: "Design detailed rubrics for projects, presentations, and assignments",
    icon: Sparkles,
    color: "bg-orange-500",
    href: "/dashboard/tools/rubric-maker",
  },
  {
    id: "iep-assistant",
    name: "IEP Assistant",
    description: "Draft IEP goals, accommodations, and progress monitoring plans",
    icon: Sparkles,
    color: "bg-pink-500",
    href: "/dashboard/tools/iep-assistant",
  },
  {
    id: "custom",
    name: "Custom Activity",
    description: "Generate any custom educational content with AI",
    icon: Sparkles,
    color: "bg-amber-500",
    href: "/dashboard/tools/custom",
  },
];

const quickActions = [
  { name: "New Lesson Plan", href: "/dashboard/tools/lesson-planner" },
  { name: "Create Quiz", href: "/dashboard/tools/quiz-generator" },
  { name: "Differentiate Content", href: "/dashboard/tools/content-differentiator" },
];

export default function DashboardHome() {
  const { user } = useAuthState();
  const [usageCount, setUsageCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<any>("/api/users/me").then((data) => {
      setUsageCount(data.contentCount ?? 0);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Teacher"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          You've generated {usageCount} pieces of content. What would you like to create today?
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Card
            key={action.name}
            className="cursor-pointer border-primary/20 transition-colors hover:border-primary/50"
            onClick={() => navigate(action.href)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <span className="font-medium">{action.name}</span>
              <Sparkles className="h-4 w-4 text-violet-500" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">AI Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => navigate(tool.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.color} text-white`}
                  >
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
