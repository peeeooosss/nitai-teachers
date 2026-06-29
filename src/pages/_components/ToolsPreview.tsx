import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALL_TOOLS } from "@/pages/dashboard/tools/_lib/toolConfig";

const categories = [...new Set(ALL_TOOLS.map((t) => t.category))];
const previewTools = ALL_TOOLS.filter((t) => t.popular);

export default function ToolsPreview() {
  return (
    <section id="tools" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">17+ Tools</span> at Your Fingertips
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From planning to assessment, we've got you covered.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Card key={cat} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {cat}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {ALL_TOOLS.filter((t) => t.category === cat).map((tool) => (
                  <div key={tool.id} className="flex items-center gap-2 text-sm">
                    <tool.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{tool.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-center text-xl font-semibold mb-8">
            Most Popular Tools
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {previewTools.map((tool) => (
              <Card key={tool.id} className={`relative overflow-hidden border-2 ${tool.border} ${tool.bg}`}>
                {tool.popular && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-violet-500 to-blue-500 text-white border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color}`}>
                    <tool.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
