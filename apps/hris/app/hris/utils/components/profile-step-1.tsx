import * as React from "react";
import { Label } from "@repo/ui/components/atoms/Label";
import { Input } from "@repo/ui/components/atoms/Input";
import { HiOutlineUser } from "react-icons/hi2";

interface Step1Props {
  employee: any;
}

export function ProfileStep1({ employee }: Step1Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <HiOutlineUser className="size-5 text-primary" />
        <h4 className="font-display font-bold text-foreground">1. Personal Profile</h4>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <Label htmlFor="employeeNo">Employee ID/No.</Label>
          <Input id="employeeNo" name="employeeNo" defaultValue={employee.employeeNo || ""} placeholder="EMP-001" />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" name="firstName" defaultValue={employee.firstName || ""} required />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input id="middleName" name="middleName" defaultValue={employee.middleName || ""} />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" name="lastName" defaultValue={employee.lastName || ""} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <Label htmlFor="suffix">Suffix (Jr/III)</Label>
          <Input id="suffix" name="suffix" defaultValue={employee.suffix || ""} placeholder="e.g. Jr." />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : ""} />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input id="gender" name="gender" defaultValue={employee.gender || ""} placeholder="e.g. Female" />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" defaultValue={employee.phoneNumber || ""} placeholder="0917-xxx-xxxx" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="personalEmail">Personal Email</Label>
          <Input id="personalEmail" name="personalEmail" type="email" defaultValue={employee.personalEmail || ""} />
        </div>
        <div>
          <Label htmlFor="workEmail">Work Email</Label>
          <Input id="workEmail" name="workEmail" type="email" defaultValue={employee.workEmail || ""} />
        </div>
      </div>
      <div>
        <Label htmlFor="residentialAddress">Residential Address</Label>
        <Input id="residentialAddress" name="residentialAddress" defaultValue={employee.residentialAddress || ""} />
      </div>
    </div>
  );
}
