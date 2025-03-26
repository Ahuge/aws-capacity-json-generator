import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { InstanceTypesSelector } from "./aws-config/InstanceTypesSelector";
import { SubnetIdsInput } from "./aws-config/SubnetIdsInput";
import { useSearchParams } from 'react-router-dom';
import { AwsConfigFormProps} from "@/lib/props.ts";
import { getFromSearchParams, getListFromSearchParams, getAllSearchParamsWithData } from "@/lib/params.ts";


export function AwsConfigForm({ onSubmit }: AwsConfigFormProps) {
  let initialRender = false
  let noError = true
  const [searchParams, setSearchParams] = useSearchParams();

  const [accountId, setAccountId] = useState(getFromSearchParams(searchParams, "accountId"));
  const [launchTemplateId, setLaunchTemplateId] = useState(getFromSearchParams(searchParams, "launchTemplateId"));
  const [targetCapacity, setTargetCapacity] = useState(getFromSearchParams(searchParams, "targetCapacity"));
  const [selectedInstanceTypes, setSelectedInstanceTypes] = useState<string[]>(getListFromSearchParams(searchParams, "instances"));
  const [subnetIds, setSubnetIds] = useState<string[]>(getListFromSearchParams(searchParams, "subnetIds"));

  useEffect(() => {
    const newAccountId = getFromSearchParams(searchParams, "accountId");
    if (accountId !== newAccountId) {
      setAccountId(newAccountId);
    }

    const newLaunchTemplateId = getFromSearchParams(searchParams, "launchTemplateId");
    if (launchTemplateId !== newLaunchTemplateId) {
      setLaunchTemplateId(newLaunchTemplateId);
    }

    const newTargetCapacity = getFromSearchParams(searchParams, "targetCapacity");
    if (targetCapacity !== newTargetCapacity) {
      setTargetCapacity(newTargetCapacity);
    }

    const newSelectedInstanceTypes = getListFromSearchParams(searchParams, "instances");
    if (selectedInstanceTypes !== newSelectedInstanceTypes) {
      setSelectedInstanceTypes(newSelectedInstanceTypes);
    }

    const newSubnetIds = getListFromSearchParams(searchParams, "subnetIds");
    if (subnetIds !== newSubnetIds) {
      setSubnetIds(newSubnetIds);
    }
  }, [searchParams])

  // handleSetValue
  const handleSetValue = (valueName: string) => {
    let setFunction = null
    let getModifier = (value: string|string[]) => { return value }
    let setModifier = (value: string|string[]) => { return value }
    switch (valueName) {
      case "instances": {
        setFunction = setSelectedInstanceTypes;
        getModifier = (value: string[]) => {
          return value.filter((v) => v.length)
        }
        setModifier = (value: string[]) => {
          return value.join(",")
        }
        break
      }
      case "subnetIds": {
        setFunction = setSubnetIds
        getModifier = (value: string[]) => {
          return value.filter((v) => v.length)
        }
        setModifier = (value: string[]) => {
          return value.join(",")
        }
        break
      }
      case "accountId": {
        setFunction = setAccountId
        break
      }
      case "launchTemplateId": {
        setFunction = setLaunchTemplateId
        break
      }
      case "targetCapacity": {
        setFunction = setTargetCapacity
      }
    }
    return (value: string|string[]) => {
      setFunction(getModifier(value))
      console.log(value)
      const params = getAllSearchParamsWithData(searchParams)
      params[valueName] = setModifier(value)
      setSearchParams(params)
    }
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (noError === true) {
      if (!accountId || !launchTemplateId || !targetCapacity || selectedInstanceTypes.length === 0 || subnetIds[0] === "") {
        // Don't error if it is our first render
        return;
      }
    }

    if (!accountId || !launchTemplateId || !targetCapacity || selectedInstanceTypes.length === 0 || subnetIds[0] === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    // Basic validation for AWS account ID format (12 digits)
    if (!/^\d{12}$/.test(accountId)) {
      toast.error("AWS Account ID must be exactly 12 digits");
      return;
    }
    if (!/^lt-[a-z0-9]{17}$/.test(launchTemplateId)) {
      toast.error("AWS EC2 Launch Templates must start with \"lt-\" and be followed by 17 characters");
      return;
    }
    if (subnetIds.length < 1) {
      toast.error("You must add add least one subnet ID");
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

  useEffect(() => {
    noError = true
    handleSubmit(new Event("null"))
    noError = false
  }, [initialRender])

  initialRender = true
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountId">AWS Account ID</Label>
          <Input
            id="accountId"
            placeholder="Enter your 12-digit AWS Account ID"
            value={accountId}
            onChange={(e) => handleSetValue("accountId")(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="launchTemplateId">Launch Template ID</Label>
          <Input
            id="launchTemplateId"
            placeholder="Enter Launch Template ID"
            value={launchTemplateId}
            onChange={(e) => handleSetValue("launchTemplateId")(e.target.value)}
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
            onChange={(e) => handleSetValue("targetCapacity")(e.target.value)}
          />
        </div>

        <InstanceTypesSelector 
          selectedTypes={selectedInstanceTypes}
          onChange={handleSetValue("instances")}
        />

        <SubnetIdsInput 
          subnetIds={subnetIds}
          onChange={handleSetValue("subnetIds")}
        />
      </div>

      <Button type="submit" className="w-full">
        Generate Configuration
      </Button>
    </form>
  );
}
