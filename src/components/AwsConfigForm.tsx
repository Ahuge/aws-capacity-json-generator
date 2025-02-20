
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { awsInstanceTypes } from "@/lib/awsInstanceTypes";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AwsConfigFormProps {
  onSubmit: (data: {
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  }) => void;
}

export function AwsConfigForm({ onSubmit }: AwsConfigFormProps) {
  const [launchTemplateId, setLaunchTemplateId] = useState("");
  const [targetCapacity, setTargetCapacity] = useState("");
  const [selectedInstanceTypes, setSelectedInstanceTypes] = useState<string[]>([]);
  const [subnetIds, setSubnetIds] = useState<string[]>([""]);
  const [newSubnetId, setNewSubnetId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!launchTemplateId || !targetCapacity || selectedInstanceTypes.length === 0 || subnetIds[0] === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit({
      launchTemplateId,
      targetCapacity: parseInt(targetCapacity),
      instanceTypes: selectedInstanceTypes,
      subnetIds: subnetIds.filter(Boolean),
    });
  };

  const handleInstanceTypeSelect = (type: string) => {
    if (selectedInstanceTypes.includes(type)) {
      setSelectedInstanceTypes(selectedInstanceTypes.filter((t) => t !== type));
    } else {
      setSelectedInstanceTypes([...selectedInstanceTypes, type]);
    }
  };

  const addSubnetId = () => {
    if (!newSubnetId) return;
    if (subnetIds.includes(newSubnetId)) {
      toast.error("This subnet ID is already added");
      return;
    }
    setSubnetIds([...subnetIds.filter(Boolean), newSubnetId]);
    setNewSubnetId("");
  };

  const removeSubnetId = (index: number) => {
    setSubnetIds(subnetIds.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="launchTemplateId">Launch Template ID</Label>
          <Input
            id="launchTemplateId"
            placeholder="Enter Launch Template ID"
            value={launchTemplateId}
            onChange={(e) => setLaunchTemplateId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetCapacity">Target Capacity</Label>
          <Input
            id="targetCapacity"
            type="number"
            min="1"
            placeholder="Enter target capacity"
            value={targetCapacity}
            onChange={(e) => setTargetCapacity(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Instance Types</Label>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            <div className="space-y-2">
              {awsInstanceTypes.map((type) => (
                <div
                  key={type}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedInstanceTypes.includes(type)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleInstanceTypeSelect(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedInstanceTypes.map((type) => (
              <Badge key={type} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subnet IDs</Label>
          <div className="space-y-2">
            {subnetIds.map((subnetId, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={subnetId}
                  onChange={(e) => {
                    const newSubnetIds = [...subnetIds];
                    newSubnetIds[index] = e.target.value;
                    setSubnetIds(newSubnetIds);
                  }}
                  placeholder="Enter Subnet ID"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeSubnetId(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSubnetId}
              onChange={(e) => setNewSubnetId(e.target.value)}
              placeholder="New Subnet ID"
            />
            <Button type="button" onClick={addSubnetId}>
              Add Subnet
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Generate Configuration
      </Button>
    </form>
  );
}
