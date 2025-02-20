
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubnetIdsInputProps {
  subnetIds: string[];
  onChange: (subnetIds: string[]) => void;
}

export function SubnetIdsInput({ subnetIds, onChange }: SubnetIdsInputProps) {
  const [newSubnetId, setNewSubnetId] = useState("");

  const addSubnetId = () => {
    if (!newSubnetId) return;
    if (subnetIds.includes(newSubnetId)) {
      toast.error("This subnet ID is already added");
      return;
    }
    if (!/^subnet-[a-z0-9]{17}$/.test(newSubnetId)) {
      toast.error("AWS VPC Subnets must start with \"subnet-\" and be followed by 17 characters");
      return;
    }
    onChange([...subnetIds.filter(Boolean), newSubnetId]);
    setNewSubnetId("");
  };

  const removeSubnetId = (index: number) => {
    onChange(subnetIds.filter((_, i) => i !== index));
  };

  return (
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
                onChange(newSubnetIds);
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
  );
}
