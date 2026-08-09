import { getJobPostingById } from "../utils/queries";
import { registerAndApplyAction } from "../utils/actions";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineArrowRight,
  HiOutlineExclamationTriangle,
  HiOutlineSparkles,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";

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

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2.5">
            <HiOutlineExclamationTriangle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <form action={registerAndApplyAction} className="space-y-4">
          <input type="hidden" name="jobId" value={targetJob.id} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <HiOutlineUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Alex Morgan"
                required
                className="pl-11 h-10 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <HiOutlineEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="alex@example.com"
                required
                className="pl-11 h-10 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Create Password</Label>
            <div className="relative">
              <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
                className="pl-11 h-10 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coverLetter">Cover Letter / Note (Optional)</Label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={3}
              placeholder="Introduce yourself to the hiring team..."
              className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="resumeUrl">Resume / LinkedIn URL (Optional)</Label>
            <Input
              id="resumeUrl"
              name="resumeUrl"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              className="h-10 text-xs"
            />
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full font-bold gap-2 text-xs mt-2">
            <span>Register & Submit Application</span>
            <HiOutlineArrowRight className="size-4" />
          </Button>
        </form>

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
