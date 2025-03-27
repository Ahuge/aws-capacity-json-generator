
import {useState, useEffect, ChangeEvent, useRef, useLayoutEffect} from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {Textarea} from "@/components/ui/textarea.tsx";
import {JsonConfiguration, newSearchParamsData, OverrideJsonType} from "../lib/types"
import { JsonPreviewProps } from "../lib/props"
import {ValidateInputs} from "@/lib/validateInputs.ts";

export function JsonPreview({ data, onImportJson }: JsonPreviewProps) {
  const [jsonText, setJsonText] = useState<string>("");
  const jsonString = JSON.stringify(data, null, 2);
  const [lastSyncedData, setLastSyncedData] = useState(data);
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef(null);
  const timerRef = useRef();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const savePosition = () => {
    if (!textareaRef.current) return null;
    return {
      selectionStart: textareaRef.current.selectionStart,
      selectionEnd: textareaRef.current.selectionEnd,
      scrollTop: textareaRef.current.scrollTop,
    };
  };
  const restorePosition = (position) => {
    if (!textareaRef.current || !position) return;
    requestAnimationFrame(() => {
      textareaRef.current.selectionStart = position.selectionStart;
      textareaRef.current.selectionEnd = position.selectionEnd;
      textareaRef.current.scrollTop = position.scrollTop;
    });
  };

  useEffect(() => {
    if (data !== lastSyncedData) {
      const position = savePosition();
      const newValue = JSON.stringify(data, null, 2);

      // Directly update the DOM to avoid React's re-render delay
      if (textareaRef.current) {
        textareaRef.current.value = newValue;
        restorePosition(position);
      }

      setJsonText(newValue);
      setLastSyncedData(data);
    }
  }, [data]);

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

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
  const newValue = event.target.value;
  const position = savePosition();

  // Update local state immediately for responsive typing
  setJsonText(newValue);

  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  timerRef.current = setTimeout(() => {
    if (newValue !== JSON.stringify(lastSyncedData, null, 2)) {
      handleImportWithData(newValue);
      restorePosition(position);
    }
  }, 500);
};

  const handleImportWithData = (data: string) : boolean => {
    try {
      console.log("handleImportWithData")
      console.log(data)
      const parsedJson = JSON.parse(data);
      const importedData = extractDataFromJson(parsedJson);
      console.log(importedData);
      onImportJson(importedData);
      toast.success("JSON imported successfully!");
      return true
    } catch (error) {
      toast.error("Invalid JSON format.");
      console.log(error)
      return false
    }
  };

  const handleImport = () => {
    handleImportWithData(jsonText)
  };

  const extractDataFromJson = (json: JsonConfiguration): {
    accountId: string;
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  } => {
    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }

    console.log(json)
    console.log(json.IamFleetRole)
    const accountId = json.IamFleetRole.match(/arn:aws:iam::(\d+):role/)[1];
    const launchTemplateId = json.LaunchTemplateConfigs[0].LaunchTemplateSpecification.LaunchTemplateId;
    const targetCapacity = json.TargetCapacity;
    const instanceTypes = json.LaunchTemplateConfigs[0].Overrides.map((override: OverrideJsonType) => override.InstanceType).filter(onlyUnique);
    const subnetIds = json.LaunchTemplateConfigs[0].Overrides.map((override: OverrideJsonType) => override.SubnetId).filter(onlyUnique);

    const searchParamsData = newSearchParamsData(accountId, instanceTypes, launchTemplateId, subnetIds, targetCapacity)
    if (!ValidateInputs(searchParamsData)) {
      throw "Invalid Inputs"
    }

    return {
      accountId,
      launchTemplateId,
      targetCapacity,
      instanceTypes,
      subnetIds,
    };
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
      <ScrollArea className="h-[450px] w-full">
        <pre
          ref={preRef}
        >
          <Textarea
            ref={textareaRef}
            className="p-6 text-sm font-mono bg-muted/50 overflow-auto h-[450px] w-full"
            value={jsonText}
            onChange={handleJsonChange}
          />
        </pre>
      </ScrollArea>
    </div>
  );
}