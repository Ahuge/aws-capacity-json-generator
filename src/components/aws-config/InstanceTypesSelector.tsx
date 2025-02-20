
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { awsInstanceTypes } from "@/lib/awsInstanceTypes";

interface InstanceTypesSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export function InstanceTypesSelector({ selectedTypes, onChange }: InstanceTypesSelectorProps) {
  const [instanceTypeFilter, setInstanceTypeFilter] = useState("");

  const handleInstanceTypeSelect = (type: string) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter((t) => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  const filteredInstanceTypes = awsInstanceTypes.filter(type => {
    const searchTerm = instanceTypeFilter.toLowerCase().replace(/\./g, '');
    const instanceType = type.toLowerCase().replace(/\./g, '');
    return instanceType.includes(searchTerm);
  });

  return (
    <div className="space-y-2">
      <Label>Instance Types</Label>
      <div className="space-y-2">
        <Input
          placeholder="Search instance types... (e.g., 'c52' for 'c5.2xlarge')"
          value={instanceTypeFilter}
          onChange={(e) => setInstanceTypeFilter(e.target.value)}
          className="mb-2"
        />
        <ScrollArea className="h-[200px] border rounded-md p-4">
          <div className="space-y-2">
            {filteredInstanceTypes.map((type) => (
              <div
                key={type}
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  selectedTypes.includes(type)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleInstanceTypeSelect(type)}
              >
                {type}
              </div>
            ))}
            {filteredInstanceTypes.length === 0 && (
              <div className="text-muted-foreground text-center py-4">
                No instance types found
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
