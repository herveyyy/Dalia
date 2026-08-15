import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { getJobPostingById, getUserApplications, getUserDefaultMaterials } from "../utils/queries";
import {
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineSparkles,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { RegisterForm } from "./register-form";

export default async function RegisterPage(props: {
  searchParams?: Promise<{ jobId?: string; error?: string }>;
}) {
  const session = await getSafeSession(await headers());
  const currentUser = session?.user ?? null;

  const params = (await props.searchParams) || {};
  const jobId = params.jobId || "";
  const error = params.error;

  const [targetJob, userApplications, defaultMaterials] = await Promise.all([
    jobId ? getJobPostingById(jobId) : Promise.resolve(null),
    currentUser ? getUserApplications(currentUser.id) : Promise.resolve([]),
    currentUser ? getUserDefaultMaterials(currentUser.id) : Promise.resolve({ files: [] }),
  ]);

  const alreadyApplied = targetJob
    ? userApplications.some((app) => app.jobPosting.id === targetJob.id)
    : false;

  if (!targetJob) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl flex-col justify-center px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HiOutlineBriefcase className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Select a Position to Apply
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Browse our available job postings, pick an open position, and submit your application materials!
            </p>
          </div>
          <div>
            <a
              href="/user/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <HiOutlineBriefcase className="size-4" />
              <span>Browse Open Positions</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <a
            href="/user/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <HiOutlineArrowLeft className="size-3.5" />
            <span>Back to all job postings</span>
          </a>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <span>
              {alreadyApplied
                ? "Application Status"
                : currentUser
                  ? "Submit Your Job Application"
                  : "Apply & Register Candidate Account"}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <HiOutlineSparkles className="size-3.5" />
              Direct Application
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {alreadyApplied
              ? "You have already applied for this role. You can review your submission in your candidate dashboard."
              : currentUser
                ? `Applying as ${currentUser.name || currentUser.email}. Review the position details and attach your application materials below.`
                : "Complete your profile and upload your application materials in one seamless step."}
          </p>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Target Job Context & Guide (Sticky on Desktop) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Target Position Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md">
                Target Role
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {targetJob.company.name}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground leading-snug">
                {targetJob.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
                  <HiOutlineBuildingOffice2 className="size-3.5 text-primary" />
                  {targetJob.company.name}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/40">
                  <HiOutlineClock className="size-3.5" />
                  {targetJob.employmentType}
                </span>
                {targetJob.location ? (
                  <span className="inline-flex items-center gap-1 font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/40">
                    <HiOutlineMapPin className="size-3.5" />
                    {targetJob.location}
                  </span>
                ) : null}
              </div>
            </div>

            {targetJob.description ? (
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <h3 className="text-xs font-bold text-foreground">About the Role</h3>
                <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {targetJob.description}
                </p>
              </div>
            ) : null}

            {targetJob.requirements ? (
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <h3 className="text-xs font-bold text-foreground">Key Requirements</h3>
                <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {targetJob.requirements}
                </p>
              </div>
            ) : null}
          </div>

          {/* Hiring Timeline & Video Pitch Tips */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <HiOutlineSparkles className="size-4 text-primary" />
              What to Expect Next
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <HiOutlineCheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Your application is automatically routed to the hiring team.</span>
              </li>
              <li className="flex items-start gap-2">
                <HiOutlineCheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
                <span>A short self-intro video pitch significantly boosts your profile visibility.</span>
              </li>
              <li className="flex items-start gap-2">
                <HiOutlineCheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Track live interview progress and feedback anytime from your candidate portal.</span>
              </li>
            </ul>
          </div>

          {/* Trust & Security Badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground">
            <HiOutlineShieldCheck className="size-5 text-emerald-500 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              All documents, resumes, and media are safely encrypted and securely stored with AWS S3.
            </p>
          </div>
        </div>

        {/* Right Column: Application & Registration Form OR Already Applied Notice */}
        <div className="lg:col-span-7">
          {alreadyApplied ? (
            /* Already Applied Clean State */
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center space-y-6">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <HiOutlineCheckCircle className="size-8" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Application Submitted
                </span>
                <h2 className="text-xl font-bold text-foreground">
                  You have already applied for this position
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your profile and materials have been received by <span className="font-semibold text-foreground">{targetJob.company.name}</span>. You can review your submission and track status updates in your dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href="/user/applications"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <HiOutlineClipboardDocumentList className="size-4" />
                  <span>View My Applications</span>
                </a>
                <a
                  href="/user/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-xs font-semibold text-foreground hover:bg-accent transition-all cursor-pointer"
                >
                  <HiOutlineBriefcase className="size-4" />
                  <span>Browse Other Open Jobs</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-border/60 pb-4">
                <h2 className="text-lg font-bold text-foreground">
                  {currentUser ? "Submit Application" : "Candidate Application Form"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {currentUser
                    ? "Attach your self-intro video, resume, and optional cover note to apply."
                    : "Please fill in your contact information and attach your resume and video pitch."}
                </p>
              </div>

              <RegisterForm
                jobId={targetJob.id}
                error={error}
                currentUser={currentUser}
                defaultFiles={defaultMaterials.files}
              />

              {!currentUser ? (
                <div className="pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href={`/user/login?redirect=${encodeURIComponent(`/user/register?jobId=${targetJob.id}`)}`}
                    className="font-bold text-primary hover:underline"
                  >
                    Sign In to Apply Directly
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
