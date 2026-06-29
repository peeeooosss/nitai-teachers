import { useAction, useQuery } from "convex/react";
import { ArrowLeft, Copy, Download, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALL_TOOLS } from "../_lib/toolConfig";

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = ALL_TOOLS.find((t) => t.id === toolId);

  const generateContent = useAction(api.ai.generateContent);
  const currentUser = useQuery(api.users.getCurrentUser);

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  if (!tool) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg font-medium">Tool not found</p>
        <Link to="/dashboard/tools">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>
        </Link>
      </div>
    );
  }

  const usage = currentUser?.monthlyUsage ?? 0;
  const planLimit = currentUser?.plan === "free" ? 10 : Infinity;

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    const missing = tool.fields
      .filter((f) => f.required && !inputs[f.name])
      .map((f) => f.label);
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setGenerating(true);
    setOutput(null);
    setLimitReached(false);

    try {
      let userPrompt = tool.userPrompt;
      for (const [key, value] of Object.entries(inputs)) {
        userPrompt = userPrompt.replace(`{${key}}`, value);
      }

      const result = await generateContent({
        toolId: tool.id,
        toolName: tool.title,
        systemPrompt: tool.systemPrompt,
        userPrompt,
        inputs,
      });

      if (result.limitReached) {
        setLimitReached(true);
        toast.error("Monthly limit reached. Upgrade your plan to continue.");
      } else if (result.output) {
        setOutput(result.output);
        toast.success("Content generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tool.id}-output.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/tools")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color}`}
          >
            <tool.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{tool.title}</h1>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
            <CardDescription>
              {currentUser?.plan === "free"
                ? `${planLimit - usage} of ${planLimit} generations remaining`
                : "Unlimited generations"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tool.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    placeholder={field.placeholder}
                    value={inputs[field.name] ?? ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={inputs[field.name] ?? ""}
                    onValueChange={(v) => handleInputChange(field.name, v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={inputs[field.name] ?? ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                  />
                )}
              </div>
            ))}

            <Button
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={generating || (currentUser?.plan === "free" && usage >= planLimit)}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "Generating..." : "Generate"}
            </Button>

            {limitReached && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                You've reached your monthly limit.{" "}
                <Link
                  to="/dashboard/pricing"
                  className="font-medium underline underline-offset-2"
                >
                  Upgrade your plan
                </Link>{" "}
                for unlimited generations.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Output</CardTitle>
              {output && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              Your generated content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generating ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Generating with AI...
                  </p>
                </div>
              </div>
            ) : output ? (
              <ScrollArea className="h-[400px]">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {output}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Fill in the inputs and click Generate to create content.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
