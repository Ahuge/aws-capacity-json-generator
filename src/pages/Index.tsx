
import { useState } from "react";
import { AwsConfigForm } from "@/components/AwsConfigForm";
import { JsonPreview } from "@/components/JsonPreview";
import { generateAwsConfig } from "@/lib/generateJson";

export default function Index() {
  const [jsonConfig, setJsonConfig] = useState<object | null>(null);

  const handleFormSubmit = (data: {
    accountId: string;
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  }) => {
    const config = generateAwsConfig(data);
    setJsonConfig(config);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AWS Spot Fleet Configuration Generator
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <AwsConfigForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        </div>
        <div>
          <JsonPreview data={jsonConfig} />
        </div>
      </div>
    </div>
  );
}
