import {
  BookOpen,
  Brain,
  ClipboardList,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Lesson Planning",
    description: "Create detailed lesson plans with objectives, activities, and assessments in seconds.",
    color: "from-blue-500 to-violet-500",
  },
  {
    icon: ClipboardList,
    title: "Quiz Generation",
    description: "Generate quizzes with multiple question types and automatic answer keys.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: FileText,
    title: "Content Creation",
    description: "Create worksheets, presentations, flashcards, and educational content effortlessly.",
    color: "from-orange-500 to-rose-500",
  },
  {
    icon: Brain,
    title: "AI Chat Assistant",
    description: "Get instant answers and teaching advice from our AI assistant.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Discussion Topics",
    description: "Generate thought-provoking discussion questions for any subject.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Sub Plans",
    description: "Create emergency substitute plans that are easy for any teacher to follow.",
    color: "from-amber-500 to-yellow-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to{" "}
            <span className="gradient-text">Teach Better</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            AI-powered tools designed for educators, by educators.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group border-border/50 transition-all hover:shadow-md">
              <CardHeader>
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color}`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
