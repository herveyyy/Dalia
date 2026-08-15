import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserProfileAndEmployment, getUserDefaultMaterials } from "../utils/queries";
import { changePasswordAction } from "../utils/actions";
import { ProfileMaterialsForm } from "./profile-materials-form";
import {
  HiOutlineUser,
  HiOutlineBuildingOffice2,
  HiOutlineLockClosed,
  HiOutlineEnvelope,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineKey,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";

export default async function ProfilePage(props: {
  searchParams?: Promise<{ error?: string; success?: string }>;
}) {
  const session = await getSafeSession(await headers());

  if (!session) {
    redirect("/user/login");
  }

  const { user } = session;
  const [profileData, defaultMaterials] = await Promise.all([
    getUserProfileAndEmployment(user.id),
    getUserDefaultMaterials(user.id),
  ]);
  const emp = profileData?.employee;

  const params = (await props.searchParams) || {};
  const errorMessage = params.error;
  const successMessage = params.success;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          My Profile & Employment Details
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your default application materials, personal account settings, security, and view employment records.
        </p>
      </div>

      {/* Banners for feedback */}
      {errorMessage ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
          <HiOutlineExclamationTriangle className="size-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 flex items-center gap-3">
          <HiOutlineCheckCircle className="size-5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      ) : null}

      {/* Section 1: Default Application Materials (Video, Resume, Cover Letter) */}
      <ProfileMaterialsForm initialFiles={defaultMaterials.files} />

      {/* Section 2: Grid: Profile info & Employment info */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* User Account Info Card */}
        <div className="md:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col items-center text-center pb-4 border-b border-border">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl shadow-inner mb-3">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Candidate / User
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account ID</span>
              <span className="font-mono text-foreground font-medium truncate max-w-[140px]">{user.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Joined Date</span>
              <span className="text-foreground font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Employed Company & Job Details */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <HiOutlineBuildingOffice2 className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Employment Record</h2>
                <p className="text-xs text-muted-foreground">Details from your active employer HRIS file</p>
              </div>
            </div>
            {emp ? (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold dark:text-emerald-400">
                {emp.employmentStatus}
              </span>
            ) : null}
          </div>

          {emp ? (
            <div className="space-y-6">
              {/* Company Banner */}
              <div className="rounded-xl bg-muted/40 p-4 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Company Name</span>
                  <h3 className="text-lg font-bold text-foreground">{emp.company.name}</h3>
                  {emp.company.businessType ? (
                    <p className="text-xs text-muted-foreground">{emp.company.businessType}</p>
                  ) : null}
                </div>
                {emp.company.headquarters ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <HiOutlineMapPin className="size-4 shrink-0" />
                    <span>{emp.company.headquarters}</span>
                  </div>
                ) : null}
              </div>

              {/* Job & Payroll Fields */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1 rounded-xl border border-border p-3">
                  <span className="text-muted-foreground font-medium">Job Title</span>
                  <p className="text-sm font-bold text-foreground">{emp.jobTitle ?? "N/A"}</p>
                </div>

                <div className="space-y-1 rounded-xl border border-border p-3">
                  <span className="text-muted-foreground font-medium">Department</span>
                  <p className="text-sm font-bold text-foreground">{emp.department?.name ?? "General"}</p>
                </div>

                <div className="space-y-1 rounded-xl border border-border p-3">
                  <span className="text-muted-foreground font-medium">Work Email</span>
                  <p className="text-sm font-bold text-foreground truncate">{emp.workEmail ?? user.email}</p>
                </div>

                <div className="space-y-1 rounded-xl border border-border p-3">
                  <span className="text-muted-foreground font-medium">Date of Hire</span>
                  <p className="text-sm font-bold text-foreground">
                    {emp.dateOfHire ? new Date(emp.dateOfHire).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                <div className="space-y-1 rounded-xl border border-border p-3">
                  <span className="text-muted-foreground font-medium">Employee No.</span>
                  <p className="text-sm font-bold text-foreground">{emp.employeeNo ?? "N/A"}</p>
                </div>

                <div className="space-y-1 rounded-xl border border-border p-3">
                  <span className="text-muted-foreground font-medium">Pay Frequency</span>
                  <p className="text-sm font-bold text-foreground">{emp.payFrequency ?? "Semi-monthly"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <HiOutlineBuildingOffice2 className="size-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No Employment Record Found</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                You are currently registered as an independent candidate. Once a partner company hires you and adds your profile in HRIS, your employment details will automatically display here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Change Password Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 dark:text-amber-400">
            <HiOutlineKey className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Change Password</h2>
            <p className="text-xs text-muted-foreground">Update your account security password</p>
          </div>
        </div>

        <form action={changePasswordAction} className="max-w-xl space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                minLength={8}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="default" size="default" className="font-bold gap-2">
            <HiOutlineLockClosed className="size-4" />
            <span>Update Password</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
