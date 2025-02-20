
interface ConfigInput {
  launchTemplateId: string;
  targetCapacity: number;
  instanceTypes: string[];
  subnetIds: string[];
}

export function generateAwsConfig(input: ConfigInput) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setFullYear(now.getFullYear() + 6);

  const overrides = input.instanceTypes.flatMap(instanceType =>
    input.subnetIds.map(subnetId => ({
      InstanceType: instanceType,
      WeightedCapacity: 1,
      SubnetId: subnetId
    }))
  );

  return {
    IamFleetRole: "arn:aws:iam::633951357428:role/aws-ec2-spot-fleet-tagging-role",
    AllocationStrategy: "priceCapacityOptimized",
    TargetCapacity: input.targetCapacity,
    ValidFrom: now.toISOString(),
    ValidUntil: futureDate.toISOString(),
    TerminateInstancesWithExpiration: true,
    Type: "maintain",
    OnDemandAllocationStrategy: "lowestPrice",
    LaunchSpecifications: [],
    LaunchTemplateConfigs: [
      {
        LaunchTemplateSpecification: {
          LaunchTemplateId: input.launchTemplateId,
          Version: "$Default"
        },
        Overrides: overrides
      }
    ]
  };
}
