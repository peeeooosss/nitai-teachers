import { Copy, FileDown, FileText, Presentation } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type DownloadActionsProps = {
  output: string;
  toolTitle: string;
  formats: ("txt" | "pdf" | "pptx")[];
  outputElementId?: string;
};

function downloadTextAs(filename: string, ext: string, mime: string) {
  return (content: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

function downloadPdf(elementId: string, filename: string) {
  import("html2pdf.js").then((mod) => {
    const html2pdf = mod.default!;
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Could not find output content");
      return;
    }
    html2pdf()
      .from(element)
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${filename}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  });
}

function downloadPptx(content: string, filename: string) {
  import("pptxgenjs").then((mod) => {
    const pptx = new (mod.default as any)();

    const slides = content.split(/---+/).filter((s) => s.trim());

    if (slides.length <= 1) {
      const slide = pptx.addSlide();
      slide.addText(content.trim(), {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 6.5,
        fontSize: 16,
        valign: "top",
      });
    } else {
      slides.forEach((slideContent) => {
        const slide = pptx.addSlide();
        const lines = slideContent
          .trim()
          .split("\n")
          .filter((l) => l.trim());

        const firstLine = lines[0];
        if (firstLine) {
          const title = firstLine.replace(/^#+\s*/, "").trim();
          slide.addText(title, {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: "2C3E50",
          });

          const body = lines.slice(1).join("\n").trim();
          if (body) {
            slide.addText(body, {
              x: 0.5,
              y: 1.3,
              w: 9,
              h: 5.5,
              fontSize: 14,
              valign: "top",
              lineSpacingMultiple: 1.5,
            });
          }
        }
      });
    }

    pptx.writeFile({ fileName: `${filename}.pptx` });
  });
}

export default function DownloadActions({
  output,
  toolTitle,
  formats,
  outputElementId = "tool-output",
}: DownloadActionsProps) {
  if (!output) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (format: "txt" | "pdf" | "pptx") => {
    switch (format) {
      case "txt":
        downloadTextAs(toolTitle, "txt", "text/plain")(output);
        toast.success("Downloading TXT...");
        break;
      case "pdf":
        downloadPdf(outputElementId, toolTitle);
        toast.success("Generating PDF...");
        break;
      case "pptx":
        downloadPptx(output, toolTitle);
        toast.success("Generating PPTX...");
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Copy className="mr-1.5 h-4 w-4" />
        Copy
      </Button>
      {formats.includes("txt") && (
        <Button variant="outline" size="sm" onClick={() => handleDownload("txt")}>
          <FileText className="mr-1.5 h-4 w-4" />
          TXT
        </Button>
      )}
      {formats.includes("pdf") && (
        <Button variant="outline" size="sm" onClick={() => handleDownload("pdf")}>
          <FileDown className="mr-1.5 h-4 w-4" />
          PDF
        </Button>
      )}
      {formats.includes("pptx") && (
        <Button variant="outline" size="sm" onClick={() => handleDownload("pptx")}>
          <Presentation className="mr-1.5 h-4 w-4" />
          PPTX
        </Button>
      )}
    </div>
  );
}
