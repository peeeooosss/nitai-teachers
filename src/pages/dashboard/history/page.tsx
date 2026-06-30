import { Copy, Eye, Share2, Trash2 } from "lucide-react";
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
      setContents((prev) => prev.filter((c) => (c.id) !== id));
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
                    {contents.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium capitalize">
                          {(item.toolName ?? item.tool).replace(/-/g, " ")}
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
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShare(item.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="max-w-md truncate text-muted-foreground">
                                {item.output?.substring(0, 100) ?? ""}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
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
