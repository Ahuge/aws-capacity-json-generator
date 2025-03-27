export interface JsonPreviewProps {
  data: object | null;
  onImportJson: (data: {
    accountId: string;
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  }) => void;
}

export interface AwsConfigFormProps {
  onSubmit: (data: {
    accountId: string;
    launchTemplateId: string;
    targetCapacity: number;
    instanceTypes: string[];
    subnetIds: string[];
  }) => void;
  onInstanceSelectionChanged: (selected: string[]) => void;
}

export interface InstanceManagerProps {
  onUrlPasted: (selected: string[]) => void;
  selectedInstances: string[]
}

export interface exportToVantageUrlProps {
  filter: string[];
  selected: string[];
  compareOn: boolean;
}