import { getJobPostingById } from "../utils/queries";
import {
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { RegisterForm } from "./register-form";

export default async function RegisterPage(props: {
  searchParams?: Promise<{ jobId?: string; error?: string }>;
}) {
  const params = (await props.searchParams) || {};
  const jobId = params.jobId || "";
  const error = params.error;

  const targetJob = jobId ? await getJobPostingById(jobId) : null;

  if (!targetJob) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HiOutlineBriefcase className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Select a Position to Register
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Candidate registration is integrated directly into our job application process. Browse our available job postings, pick a position, and create your account while applying!
            </p>
          </div>
          <a
            href="/user/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <HiOutlineBriefcase className="size-4" />
            <span>Browse Available Positions</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
            <HiOutlineSparkles className="size-3.5" />
            Job Application & Registration
          </span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Apply & Register Candidate Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Create your account to submit your application for this open position
          </p>
        </div>

        {/* Target Job Context Banner */}
        <div className="rounded-xl bg-muted/40 p-4 border border-border/60 space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Target Position</span>
          <h2 className="text-base font-bold text-foreground">{targetJob.title}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <HiOutlineBuildingOffice2 className="size-3.5 text-primary" />
              {targetJob.company.name}
            </span>
            <span>•</span>
            <span>{targetJob.employmentType}</span>
            {targetJob.location ? <span>• {targetJob.location}</span> : null}
          </div>
        </div>

        <RegisterForm jobId={targetJob.id} error={error} />

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <a href={`/user/login?redirect=${encodeURIComponent(`/user/jobs`)}`} className="font-bold text-primary hover:underline">
            Sign In Here
          </a>
        </div>
      </div>
    </div>
  );
}
