export interface LaunchTemplateSpecification {
  LaunchTemplateId: string;
  Version: string;
}

export interface LaunchTemplateConfig {
  LaunchTemplateSpecification: LaunchTemplateSpecification;
  Overrides: OverrideJsonType[];
}

export interface JsonConfiguration {
  IamFleetRole: string;
  AllocationStrategy: string;
  TargetCapacity: number;
  TerminateInstancesWithExpiration: boolean;
  Type: string;
  OnDemandAllocationStrategy: string;
  LaunchSpecifications: string[];
  LaunchTemplateConfigs: LaunchTemplateConfig[];
}

export interface OverrideJsonType {
  InstanceType: string;
  SubnetId: string;
}

export interface SearchParamsData {
  accountId: string;
  launchTemplateId: string;
  targetCapacity: number;
  instanceTypes: string[];
  subnetIds: string[];
}

export const emptySearchParamsData = () : SearchParamsData => {
  return {
      accountId: "",
      instanceTypes: [],
      launchTemplateId: "",
      subnetIds: [],
      targetCapacity: 0
    }
}

export const newSearchParamsData = (accountId: string, instanceTypes: string[], launchTemplateId: string, subnetIds: string[], targetCapacity: number) : SearchParamsData => {
    return {
      accountId: accountId,
      instanceTypes: instanceTypes,
      launchTemplateId: launchTemplateId,
      subnetIds: subnetIds,
      targetCapacity: targetCapacity,
    }
}