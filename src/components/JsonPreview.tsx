
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface JsonPreviewProps {
  data: object | null;
}

export function JsonPreview({ data }: JsonPreviewProps) {
  const jsonString = JSON.stringify(data, null, 2);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!jsonString) return;
    await navigator.clipboard.writeText(jsonString);
    toast.success("JSON copied to clipboard");
  };

  const handleDownload = () => {
    if (!jsonString) return;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aws-spot-fleet-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON file downloaded");
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Configuration Preview</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleCopy}>
            Copy
          </Button>
          <Button onClick={handleDownload}>Download JSON</Button>
        </div>
      </div>
      <ScrollArea className="h-[600px] w-full">
        <pre
          ref={preRef}
          className="p-6 text-sm font-mono bg-muted/50 overflow-auto"
        >
          {jsonString}
        </pre>
      </ScrollArea>
    </div>
  );
}
