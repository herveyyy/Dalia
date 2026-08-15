import * as React from "react";
import { Label } from "@repo/ui/components/atoms/Label";
import { Input } from "@repo/ui/components/atoms/Input";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

interface Step2Props {
  employee: any;
}

export function ProfileStep2({ employee }: Step2Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <HiOutlineBuildingOffice2 className="size-5 text-primary" />
        <h4 className="font-display font-bold text-foreground">2. Statutory Identifications</h4>
      </div>
      <div className="grid gap-4 sm:grid-cols-5">
        <div>
          <Label htmlFor="tin">TIN</Label>
          <Input id="tin" name="tin" defaultValue={employee.tin || ""} placeholder="xxx-xxx-xxx" />
        </div>
        <div>
          <Label htmlFor="philhealth">PhilHealth</Label>
          <Input id="philhealth" name="philhealth" defaultValue={employee.philhealth || ""} placeholder="xx-xxxxxxxxx-x" />
        </div>
        <div>
          <Label htmlFor="pagIbig">PAG-IBIG MID</Label>
          <Input id="pagIbig" name="pagIbig" defaultValue={employee.pagIbig || ""} placeholder="xxxx-xxxx-xxxx" />
        </div>
        <div>
          <Label htmlFor="sssNo">SSS No.</Label>
          <Input id="sssNo" name="sssNo" defaultValue={employee.sssNo || ""} placeholder="xx-xxxxxxx-x" />
        </div>
        <div>
          <Label htmlFor="philIdNo">PhilID No.</Label>
          <Input id="philIdNo" name="philIdNo" defaultValue={employee.philIdNo || ""} placeholder="National ID" />
        </div>
      </div>
    </div>
  );
}
