import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALL_TOOLS } from "@/pages/dashboard/tools/_lib/toolConfig";
import DownloadActions from "@/components/download-actions";

export default function ToolPage() {
  const toolId = window.location.pathname.split("/").pop()!;
  const tool = ALL_TOOLS.find((t) => t.id === toolId);

  const [values, setValues] = useState<Record<string, string>>({});
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

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const buildPrompt = (): string => {
    let prompt = tool.userPrompt;
    for (const field of tool.fields) {
      const val = values[field.name] || "";
      prompt = prompt.replace(new RegExp(`\\{${field.name}\\}`, "g"), val);
    }
    return prompt;
  };

  const handleGenerate = async () => {
    const missing = tool.fields
      .filter((f) => f.required && !values[f.name]?.trim())
      .map((f) => f.label);
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const inputs: Record<string, string> = {};
      for (const field of tool.fields) {
        inputs[field.name] = values[field.name] || "";
      }

      const result = await api.post<{
        output: string;
        contentId: string;
      }>("/api/ai/generate", {
        prompt: buildPrompt(),
        tool: toolId,
        systemPrompt: tool.systemPrompt,
        inputs,
        toolName: tool.title,
      });
      setOutput(result.output);
      toast.success("Content generated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: (typeof tool.fields)[number]) => {
    const value = values[field.name] || "";

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setValue(field.name, e.target.value)}
            className="min-h-[120px] resize-y"
          />
        );
      case "number":
        return (
          <Input
            id={field.name}
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setValue(field.name, e.target.value)}
          />
        );
      case "select":
        return (
          <Select value={value} onValueChange={(v) => setValue(field.name, v)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setValue(field.name, e.target.value)}
          />
        );
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
        <h1 className="mt-2 text-3xl font-bold">{tool.title}</h1>
        <p className="mt-1 text-muted-foreground">{tool.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tool.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
              <Button
                onClick={handleGenerate}
                disabled={loading}
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                id="tool-output"
                className="prose prose-sm max-w-none dark:prose-invert"
              >
                {output ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {output}
                  </ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <Sparkles className="mb-2 h-8 w-8" />
                    <p>Your generated content will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {output && (
            <DownloadActions
              output={output}
              toolTitle={tool.title}
              formats={tool.downloadFormats}
              outputElementId="tool-output"
            />
          )}
        </div>
      </div>
    </div>
  );
}
