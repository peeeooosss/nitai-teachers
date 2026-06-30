import { ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SharedContentPage() {
  const { token } = useParams();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (token) {
      api.get<any>(`/api/share/${token}`).then(setContent).catch(() => {});
    }
  }, [token]);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to NITAI AI
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Generated with NITAI AI
            </div>
            <CardTitle className="text-2xl">{content.toolName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Generated on{" "}
              {new Date(content.createdAt).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {content.output.split("\n").map((line: string, i: number) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
