import { useState } from "react";
import { AwsConfigForm } from "@/components/AwsConfigForm";
import { JsonPreview } from "@/components/JsonPreview";
import { generateAwsConfig } from "@/lib/generateJson";
import {useSearchParams} from "react-router-dom";
import { getAllSearchParamsWithData } from "@/lib/params";
import {InstanceManager} from "@/components/InstanceManager.tsx";
import {JsonConfiguration} from "@/lib/types.ts";


export default function Index() {
  const [jsonConfig, setJsonConfig] = useState<JsonConfiguration | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedInstances, setSelectedInstances] = useState<string[]>()
  const [subnetIds, setSubnetIds] = useState<string[]>()

  const handleFormSubmit = (data: {
    accountId: string;
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  }) => {
    console.log("handleFormSubmit")
    console.log(data)
    const config = generateAwsConfig(data);
    console.log(config)
    setJsonConfig(config);
    setSelectedInstances(data.instanceTypes)
    setSubnetIds(data.subnetIds)
  };

  const handleInstanceSelectionChanged = (instances: string[]) => {
    setSelectedInstances(instances)
  }

  const handleImportJson = (data: {
    accountId: string;
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  }) => {

    console.log("pre: getAllSearchParamsWithData")
    console.log(data);
    const params = getAllSearchParamsWithData(searchParams, data)
    console.log("handleImportJson")
    console.log(params);
    setSearchParams(params)
    setSelectedInstances(data.instanceTypes)
    handleFormSubmit(data);
  };

  const handleUrlPasted = (instances: string[]) => {
    setSelectedInstances(instances);

    setJsonConfig(prev => {
      // Preserve existing LaunchTemplateConfigs if they exist
      const existingConfigs = prev.LaunchTemplateConfigs || [];

      // Create Overrides array from the selected instances
      const newOverrides = instances.flatMap(instanceType =>
      subnetIds.map(subnetId => ({
        InstanceType: instanceType,
        WeightedCapacity: 1, // Default value
        SubnetId: subnetId
      }))
    );

      return {
        ...prev,
        LaunchTemplateConfigs: existingConfigs.map(config => ({
          ...config,
          Overrides: newOverrides
        }))
      };
    });
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AWS Spot Fleet Configuration Generator
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <AwsConfigForm onSubmit={handleFormSubmit} onInstanceSelectionChanged={handleInstanceSelectionChanged} />
            </div>
          </div>
        </div>
        <div>
          <JsonPreview data={jsonConfig} onImportJson={handleImportJson} />
          <InstanceManager onUrlPasted={handleUrlPasted} selectedInstances={selectedInstances}/>
        </div>
      </div>
    </div>
  );
}