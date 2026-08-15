import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getUserProfileAndEmployment,
  getUserApplications,
  getPublishedJobs,
} from "./utils/queries";
import {
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentList,
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi2";

export default async function UserDashboardPage() {
  const session = await getSafeSession(await headers());

  if (!session) {
    redirect("/user/login");
  }

  const { user } = session;

  const [profileData, applications, openJobs] = await Promise.all([
    getUserProfileAndEmployment(user.id),
    getUserApplications(user.id),
    getPublishedJobs(),
  ]);

  const emp = profileData?.employee;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 border border-primary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Self-Service Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
            Welcome back, {user.name}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Manage your personal profile, view your current employment details, track submitted job applications, and apply for open career opportunities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/user/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <HiOutlineBriefcase className="size-4" />
            <span>Browse Jobs</span>
          </a>
          <a
            href="/user/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <HiOutlineUserCircle className="size-4" />
            <span>View Profile</span>
          </a>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Employment Status */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <HiOutlineBuildingOffice2 className="size-6" />
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                emp
                  ? "bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-amber-500/10 dark:text-amber-400"
              }`}
            >
              {emp ? emp.employmentStatus : "Not Employed"}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-muted-foreground">Current Employment</span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              {emp?.company?.name ?? "No active employer"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {emp ? `${emp.jobTitle ?? "Employee"} · ${emp.department?.name ?? "General"}` : "You are currently not linked to a company payroll record."}
            </p>
          </div>

          <a
            href="/user/profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Employment details</span>
            <HiOutlineArrowRight className="size-3" />
          </a>
        </div>

        {/* Card 2: Applications Submitted */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <HiOutlineClipboardDocumentList className="size-6" />
            </div>
            <span className="text-2xl font-black text-foreground">{applications.length}</span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-muted-foreground">Job Applications</span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              {applications.length > 0 ? `${applications.length} Active Application${applications.length > 1 ? "s" : ""}` : "No Applications Yet"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Track status updates and interview invitations from employers.
            </p>
          </div>

          <a
            href="/user/applications"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>View my applications</span>
            <HiOutlineArrowRight className="size-3" />
          </a>
        </div>

        {/* Card 3: Open Positions */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <HiOutlineBriefcase className="size-6" />
            </div>
            <span className="text-2xl font-black text-foreground">{openJobs.length}</span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-muted-foreground">Job Marketplace</span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              {openJobs.length} Published Opening{openJobs.length !== 1 ? "s" : ""}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Explore available opportunities and submit job applications.
            </p>
          </div>

          <a
            href="/user/jobs"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Browse open jobs</span>
            <HiOutlineArrowRight className="size-3" />
          </a>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Applications</h2>
            <p className="text-xs text-muted-foreground">Applications you submitted recently</p>
          </div>
          <a
            href="/user/applications"
            className="text-xs font-bold text-primary hover:underline"
          >
            View all ({applications.length})
          </a>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <HiOutlineClipboardDocumentList className="size-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No job applications submitted yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Check out open positions in our career marketplace and submit your application with one click.
            </p>
            <a
              href="/user/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm"
            >
              <HiOutlineBriefcase className="size-4" />
              <span>Browse Openings</span>
            </a>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">{app.jobPosting.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">{app.company.name}</span>
                    <span>•</span>
                    <span>{app.jobPosting.employmentType}</span>
                    {app.jobPosting.location ? (
                      <>
                        <span>•</span>
                        <span>{app.jobPosting.location}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      app.status === "Hired"
                        ? "bg-emerald-500/10  text-emerald-600"
                        : app.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-600"
                          : app.status === "Interviewing"
                            ? "bg-blue-500/10 text-blue-600"
                            : app.status === "Shortlisted"
                              ? "bg-purple-500/10 text-purple-600"
                              : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    <HiOutlineClock className="size-3" />
                    <span>{app.status}</span>
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
