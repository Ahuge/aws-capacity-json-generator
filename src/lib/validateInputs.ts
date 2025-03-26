import {toast} from "sonner";
import {SearchParamsData} from "@/lib/types.ts";

export const ValidateInputs = (data: SearchParamsData): boolean => {
    if (!data.accountId || !data.launchTemplateId || !data.targetCapacity || data.instanceTypes.length === 0 || data.subnetIds[0] === "") {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Basic validation for AWS account ID format (12 digits)
    if (!/^\d{12}$/.test(data.accountId)) {
      toast.error("AWS Account ID must be exactly 12 digits");
      return false;
    }
    if (!/^lt-[a-z0-9]{17}$/.test(data.launchTemplateId)) {
      toast.error("AWS EC2 Launch Templates must start with \"lt-\" and be followed by 17 characters");
      return false;
    }
    if (data.subnetIds.length < 1) {
      toast.error("You must add add least one subnet ID");
      return false;
    }
    return true
}