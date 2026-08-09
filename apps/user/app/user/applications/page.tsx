import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserApplications } from "../utils/queries";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineArrowUpRight,
  HiOutlineDocumentText,
} from "react-icons/hi2";

export default async function ApplicationsPage(props: {
  searchParams?: Promise<{ applied?: string }>;
}) {
  const session = await getSafeSession(await headers());

  if (!session) {
    redirect("/user/login");
  }

  const { user } = session;
  const applications = await getUserApplications(user.id);
  const params = (await props.searchParams) || {};
  const justApplied = params.applied === "true";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          My Job Applications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review the status and history of positions you have applied for.
        </p>
      </div>

      {justApplied ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
          <HiOutlineCheckCircle className="size-5 shrink-0" />
          <p className="font-semibold">
            Your job application has been submitted successfully! The hiring team will review your profile.
          </p>
        </div>
      ) : null}

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HiOutlineClipboardDocumentList className="size-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">No applications found</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You haven't submitted any job applications yet. Browse open positions in our career portal to apply today!
            </p>
          </div>
          <a
            href="/user/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <HiOutlineBriefcase className="size-4" />
            <span>Explore Open Positions</span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 transition-all hover:border-primary/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{app.jobPosting.title}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <HiOutlineBuildingOffice2 className="size-3.5 text-primary" />
                      {app.company.name}
                    </span>
                    <span>•</span>
                    <span>{app.jobPosting.employmentType}</span>
                    {app.department?.name ? (
                      <>
                        <span>•</span>
                        <span>{app.department.name}</span>
                      </>
                    ) : null}
                    {app.jobPosting.location ? (
                      <>
                        <span>•</span>
                        <span>{app.jobPosting.location}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      app.status === "Hired"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : app.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          : app.status === "Interviewing"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : app.status === "Shortlisted"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    <HiOutlineClock className="size-3.5" />
                    <span>{app.status}</span>
                  </span>
                </div>
              </div>

              {/* Application details */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-muted-foreground font-semibold">Applied Date</span>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {app.resumeUrl ? (
                  <div>
                    <span className="text-muted-foreground font-semibold">Resume / Portfolio</span>
                    <p className="mt-0.5">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                      >
                        <span>View Attachment</span>
                        <HiOutlineArrowUpRight className="size-3" />
                      </a>
                    </p>
                  </div>
                ) : null}

                {app.coverLetter ? (
                  <div className="sm:col-span-2 space-y-1 bg-muted/30 p-3 rounded-xl border border-border/50">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <HiOutlineDocumentText className="size-3.5" />
                      Cover Letter Note
                    </span>
                    <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                      {app.coverLetter}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
