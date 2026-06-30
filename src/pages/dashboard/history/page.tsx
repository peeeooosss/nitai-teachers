import { Copy, FileDown, FileText, Presentation, Share2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_TOOLS } from "@/pages/dashboard/tools/_lib/toolConfig";

function downloadTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPdf(content: string, filename: string) {
  import("html2pdf.js").then((mod) => {
    const container = document.createElement("div");
    container.style.padding = "20px";
    container.style.fontFamily = "sans-serif";
    container.style.whiteSpace = "pre-wrap";
    container.textContent = content;
    document.body.appendChild(container);
    mod.default()
      .from(container)
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${filename}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save()
      .then(() => document.body.removeChild(container));
  });
}

function downloadPptx(content: string, filename: string) {
  import("pptxgenjs").then((mod) => {
    const pptx = new (mod.default as any)();
    const slides = content.split(/---+/).filter((s) => s.trim());
    if (slides.length <= 1) {
      const slide = pptx.addSlide();
      slide.addText(content.trim(), { x: 0.5, y: 0.5, w: 9, h: 6.5, fontSize: 16, valign: "top" });
    } else {
      slides.forEach((slideContent) => {
        const slide = pptx.addSlide();
        const lines = slideContent.trim().split("\n").filter((l) => l.trim());
        const firstLine = lines[0];
        if (firstLine) {
          slide.addText(firstLine.replace(/^#+\s*/, "").trim(), {
            x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 24, bold: true, color: "2C3E50",
          });
          const body = lines.slice(1).join("\n").trim();
          if (body) {
            slide.addText(body, { x: 0.5, y: 1.3, w: 9, h: 5.5, fontSize: 14, valign: "top", lineSpacingMultiple: 1.5 });
          }
        }
      });
    }
    pptx.writeFile({ fileName: `${filename}.pptx` });
  });
}

function getToolFormats(toolId: string): ("txt" | "pdf" | "pptx")[] {
  const tool = ALL_TOOLS.find((t) => t.id === toolId);
  return tool?.downloadFormats ?? [];
}

function getToolName(item: any): string {
  return (item.toolName ?? item.tool ?? "unknown").replace(/-/g, " ");
}

function getToolId(item: any): string {
  return item.toolId ?? item.toolName ?? item.tool ?? "";
}

export default function DashboardHistory() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.get<any[]>("/api/content");
      setContents(data ?? []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/content/${id}`);
      setContents((prev) => prev.filter((c) => c.id !== id));
      toast.success("Content deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleShare = async (id: string) => {
    try {
      const result = await api.post<{ token: string }>(`/api/share`, { contentId: id });
      const shareUrl = `${window.location.origin}/shared/${result.token}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to create share link");
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (format: "txt" | "pdf" | "pptx", content: string, name: string) => {
    switch (format) {
      case "txt":
        downloadTxt(content, name);
        break;
      case "pdf":
        downloadPdf(content, name);
        break;
      case "pptx":
        downloadPptx(content, name);
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage your generated content
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lesson-planner">Lesson Plans</TabsTrigger>
          <TabsTrigger value="quiz-generator">Quizzes</TabsTrigger>
          <TabsTrigger value="content-differentiator">Differentiated</TabsTrigger>
          <TabsTrigger value="rubric-maker">Rubrics</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Content</CardTitle>
              <CardDescription>
                {contents.length} total items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contents.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No content yet. Start by using one of the AI tools.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contents.map((item) => {
                      const toolId = getToolId(item);
                      const formats = getToolFormats(toolId);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium capitalize">
                            {getToolName(item)}
                          </TableCell>
                          <TableCell className="max-w-md truncate text-muted-foreground">
                            {item.output?.substring(0, 100) ?? item.prompt?.substring(0, 100) ?? ""}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopy(item.output ?? "")}
                                title="Copy"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              {formats.includes("txt") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload("txt", item.output ?? "", toolId)}
                                  title="Download TXT"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              )}
                              {formats.includes("pdf") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload("pdf", item.output ?? "", toolId)}
                                  title="Download PDF"
                                >
                                  <FileDown className="h-4 w-4" />
                                </Button>
                              )}
                              {formats.includes("pptx") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload("pptx", item.output ?? "", toolId)}
                                  title="Download PPTX"
                                >
                                  <Presentation className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShare(item.id)}
                                title="Share"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {["lesson-planner", "quiz-generator", "content-differentiator", "rubric-maker"].map(
          (tool) => (
            <TabsContent key={tool} value={tool}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tool.replace(/-/g, " ")}s</CardTitle>
                </CardHeader>
                <CardContent>
                  {contents.filter((c) => (c.toolName ?? c.tool) === tool).length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      No {tool.replace(/-/g, " ")} content yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Preview</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contents
                          .filter((c) => (c.toolName ?? c.tool) === tool)
                          .map((item) => {
                            const formats = getToolFormats(tool);
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="max-w-md truncate text-muted-foreground">
                                  {item.output?.substring(0, 100) ?? ""}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleCopy(item.output ?? "")}
                                      title="Copy"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    {formats.includes("txt") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDownload("txt", item.output ?? "", tool)}
                                        title="Download TXT"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    )}
                                    {formats.includes("pdf") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDownload("pdf", item.output ?? "", tool)}
                                        title="Download PDF"
                                      >
                                        <FileDown className="h-4 w-4" />
                                      </Button>
                                    )}
                                    {formats.includes("pptx") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDownload("pptx", item.output ?? "", tool)}
                                        title="Download PPTX"
                                      >
                                        <Presentation className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(item.id)}
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ),
        )}
      </Tabs>
    </div>
  );
}
