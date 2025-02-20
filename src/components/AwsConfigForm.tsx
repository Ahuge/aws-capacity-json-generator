
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { InstanceTypesSelector } from "./aws-config/InstanceTypesSelector";
import { SubnetIdsInput } from "./aws-config/SubnetIdsInput";
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams, setSearchParams] = useSearchParams();

  const getFromSearchParams = (parameterName: string) => {
    const value = searchParams.get(parameterName)
    if (value === null) {
      return ""
    }
    return value
  }
  const getListFromSearchParams = (parameterName: string) => {
    const value = searchParams.get(parameterName);
    if (value === null) {
      return []
    }
    return value.split(",") || []
  }

  const [accountId, setAccountId] = useState(getFromSearchParams("accountId"));
  const [launchTemplateId, setLaunchTemplateId] = useState(getFromSearchParams("launchTemplateId"));
  const [targetCapacity, setTargetCapacity] = useState(getFromSearchParams("targetCapacity"));
  const [selectedInstanceTypes, setSelectedInstanceTypes] = useState<string[]>(getListFromSearchParams("instances"));
  const [subnetIds, setSubnetIds] = useState<string[]>(getListFromSearchParams("subnetIds"));

  const getAllSearchParams = () => {
    const params = {}

    const instances = getListFromSearchParams("instances")
    const subnetIds = getListFromSearchParams("subnetIds")

    const accountId = getFromSearchParams("accountId")
    const launchTemplateId = getFromSearchParams("launchTemplateId")
    const targetCapacity = getFromSearchParams("targetCapacity")


    if (instances.length > 0) {
      params["instances"] = instances.join(",")
    }
    if (subnetIds.length > 0) {
      params["subnetIds"] = subnetIds.join(",")
    }

    if (accountId !== "") {
      params["accountId"] = accountId
    }
    if (launchTemplateId !== "") {
      params["launchTemplateId"] = launchTemplateId
    }
    if (targetCapacity !== "") {
      params["targetCapacity"] = targetCapacity
    }

    return params
  }

  const handleSetSelectedInstanceTypes = (newInstanceTypes: string[]) => {
    setSelectedInstanceTypes(newInstanceTypes.filter((v) => v.length));
    console.log(newInstanceTypes)
    const params = getAllSearchParams()
    params["instances"] = newInstanceTypes.join(",")
    setSearchParams(params)
  }

  const handleSetAccountId = (newAccountId: string) => {
    setAccountId(newAccountId);
    console.log(newAccountId)
    const params = getAllSearchParams()
    params["accountId"] = newAccountId
    setSearchParams(params)
  }

  const handleSetLaunchTemplateId = (newLaunchTemplateId: string) => {
    setLaunchTemplateId(newLaunchTemplateId);
    console.log(newLaunchTemplateId)
    const params = getAllSearchParams()
    params["launchTemplateId"] = newLaunchTemplateId
    setSearchParams(params)
  }

  const handleSetTargetCapacity = (newTargetCapacity: string) => {
    setTargetCapacity(newTargetCapacity);
    console.log(newTargetCapacity)
    const params = getAllSearchParams()
    params["targetCapacity"] = newTargetCapacity
    setSearchParams(params)
  }

  const handleSetSubnetIds = (newSubnetIds: string[]) => {
    setSubnetIds(newSubnetIds);
    console.log(newSubnetIds)
    const params = getAllSearchParams()
    params["subnetIds"] = newSubnetIds.join(",")
    setSearchParams(params)
  }



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
            onChange={(e) => handleSetAccountId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="launchTemplateId">Launch Template ID</Label>
          <Input
            id="launchTemplateId"
            placeholder="Enter Launch Template ID"
            value={launchTemplateId}
            onChange={(e) => handleSetLaunchTemplateId(e.target.value)}
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
            onChange={(e) => handleSetTargetCapacity(e.target.value)}
          />
        </div>

        <InstanceTypesSelector 
          selectedTypes={selectedInstanceTypes}
          onChange={handleSetSelectedInstanceTypes}
        />

        <SubnetIdsInput 
          subnetIds={subnetIds}
          onChange={handleSetSubnetIds}
        />
      </div>

      <Button type="submit" className="w-full">
        Generate Configuration
      </Button>
    </form>
  );
}
