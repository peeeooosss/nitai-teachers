import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ALL_TOOLS } from "./_lib/toolConfig";

const categories = ["All", "Planning", "Assessment", "Content", "Research"];

export default function DashboardTools() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = ALL_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || tool.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tools Library</h1>
        <p className="text-muted-foreground">
          Choose an AI-powered tool to generate educational content.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <Link key={tool.id} to={`/dashboard/tools/${tool.id}`}>
            <Card
              className={`group h-full cursor-pointer border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5 ${tool.bg} ${tool.border} border-2`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color}`}
                  >
                    <tool.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex gap-1">
                    {tool.popular && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        Popular
                      </Badge>
                    )}
                    {tool.isNew && (
                      <Badge className="bg-gradient-to-r from-violet-500 to-blue-500 text-white border-0 text-[10px] px-1.5 py-0">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-base mt-3">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  {tool.category}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <SlidersHorizontal className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="text-lg font-medium">No tools found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
