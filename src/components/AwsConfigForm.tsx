
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { InstanceTypesSelector } from "./aws-config/InstanceTypesSelector";
import { SubnetIdsInput } from "./aws-config/SubnetIdsInput";

interface AwsConfigFormProps {
  onSubmit: (data: {
    accountId: string;
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  }) => void;
}

export function AwsConfigForm({ onSubmit }: AwsConfigFormProps) {
  const [accountId, setAccountId] = useState("");
  const [launchTemplateId, setLaunchTemplateId] = useState("");
  const [targetCapacity, setTargetCapacity] = useState("");
  const [selectedInstanceTypes, setSelectedInstanceTypes] = useState<string[]>([]);
  const [subnetIds, setSubnetIds] = useState<string[]>([""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId || !launchTemplateId || !targetCapacity || selectedInstanceTypes.length === 0 || subnetIds[0] === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    // Basic validation for AWS account ID format (12 digits)
    if (!/^\d{12}$/.test(accountId)) {
      toast.error("AWS Account ID must be exactly 12 digits");
      return;
    }

    onSubmit({
      accountId,
      launchTemplateId,
      targetCapacity: parseInt(targetCapacity),
      instanceTypes: selectedInstanceTypes,
      subnetIds: subnetIds.filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountId">AWS Account ID</Label>
          <Input
            id="accountId"
            placeholder="Enter your 12-digit AWS Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
        </div>

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

        <InstanceTypesSelector 
          selectedTypes={selectedInstanceTypes}
          onChange={setSelectedInstanceTypes}
        />

        <SubnetIdsInput 
          subnetIds={subnetIds}
          onChange={setSubnetIds}
        />
      </div>

      <Button type="submit" className="w-full">
        Generate Configuration
      </Button>
    </form>
  );
}
