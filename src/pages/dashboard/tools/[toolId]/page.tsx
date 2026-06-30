import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const tools: Record<string, { name: string; promptPrefix: string; placeholder: string }> = {
  "lesson-planner": {
    name: "Lesson Planner",
    promptPrefix: "Create a detailed lesson plan for: ",
    placeholder: "Describe the topic, grade level, and duration for your lesson plan...",
  },
  "quiz-generator": {
    name: "Quiz Generator",
    promptPrefix: "Generate a quiz about: ",
    placeholder: "Describe the topic, grade level, number of questions, and difficulty...",
  },
  "content-differentiator": {
    name: "Content Differentiator",
    promptPrefix: "Differentiate this content for different learning levels: ",
    placeholder: "Paste the content you want to differentiate, and specify the grade levels...",
  },
  "rubric-maker": {
    name: "Rubric Maker",
    promptPrefix: "Create a rubric for: ",
    placeholder: "Describe the assignment, criteria, and performance levels for the rubric...",
  },
  "iep-assistant": {
    name: "IEP Assistant",
    promptPrefix: "Draft IEP goals and accommodations for: ",
    placeholder: "Describe the student's needs, grade level, and subject areas...",
  },
  "custom": {
    name: "Custom Activity",
    promptPrefix: "",
    placeholder: "Describe the educational content you want to generate...",
  },
};

export default function ToolPage() {
  const toolId = window.location.pathname.split("/").pop()!;
  const tool = tools[toolId];

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Tool not found</h2>
        <p className="mt-2 text-muted-foreground">
          The tool you're looking for doesn't exist.
        </p>
        <Link to="/dashboard/tools">
          <Button variant="outline" className="mt-4">
            Browse Tools
          </Button>
        </Link>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const result = await api.post<{ output: string; contentId: string }>("/api/ai/generate", {
        prompt: tool.promptPrefix + input,
        tool: toolId,
      });
      setOutput(result.output);
      toast.success("Content generated successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/dashboard/tools"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{tool.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={tool.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] resize-y"
              />
              <Button
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              {output ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <Sparkles className="mb-2 h-8 w-8" />
                  <p>Your generated content will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
