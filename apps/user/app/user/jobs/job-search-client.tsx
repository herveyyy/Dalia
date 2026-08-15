"use client";

import * as React from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineArrowRight,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineArrowPath,
  HiOutlineClock,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import { SearchableSelect } from "@repo/ui/components/atoms/SearchableSelect";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@repo/ui/components/atoms/Dialog";
import { applyForJobAction, fetchPublishedJobsPaginatedAction } from "../utils/actions";

interface JobPostingItem {
  id: string;
  companyId: string;
  title: string;
  departmentId?: string | null;
  location?: string | null;
  employmentType: string;
  description: string;
  requirements?: string | null;
  salaryRange?: string | null;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string | null;
    headquarters?: string | null;
    description?: string | null;
  };
  department?: {
    id: string;
    name: string;
  } | null;
}

interface JobSearchClientProps {
  initialJobs: JobPostingItem[];
  initialHasMore: boolean;
  departments: { id: string; name: string }[];
  userSession: {
    id: string;
    name: string;
    email: string;
  } | null;
  userAppliedJobIds: string[];
  initialJobId?: string;
}

const BATCH_SIZE = 6;

export function JobSearchClient({
  initialJobs,
  initialHasMore,
  departments,
  userSession,
  userAppliedJobIds,
  initialJobId,
}: JobSearchClientProps) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("ALL");
  const [selectedDepartment, setSelectedDepartment] = React.useState("ALL");

  // Infinite Scroll State
  const [jobs, setJobs] = React.useState<JobPostingItem[]>(initialJobs);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(initialHasMore);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // Dialog / Modal State
  const [modalJob, setModalJob] = React.useState<JobPostingItem | null>(null);

  // Application Form State
  const [coverLetter, setCoverLetter] = React.useState("");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [applyError, setApplyError] = React.useState<string | null>(null);
  const [applySuccess, setApplySuccess] = React.useState<string | null>(null);
  const [appliedIds, setAppliedIds] = React.useState<string[]>(userAppliedJobIds);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const employmentTypes = ["ALL", "Full-time", "Part-time", "Contract", "Internship"];

  // Automatically open modal if initialJobId is provided in URL
  React.useEffect(() => {
    if (initialJobId && jobs.length > 0) {
      const match = jobs.find((j) => j.id === initialJobId);
      if (match) {
        setModalJob(match);
      }
    }
  }, [initialJobId, jobs]);

  // Debounced Filter Handler — Resets page & fetches fresh results
  React.useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const res = await fetchPublishedJobsPaginatedAction({
        page: 1,
        limit: BATCH_SIZE,
        search: searchQuery,
        employmentType: selectedType,
        departmentId: selectedDepartment,
      });

      if (!isCancelled && res.success) {
        const newJobs = res.jobs as JobPostingItem[];
        setJobs(newJobs);
        setHasMore(res.hasMore);
        setPage(1);
      }
      setIsLoading(false);
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedType, selectedDepartment]);

  // Infinite Scroll loader
  const loadNextPage = React.useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetchPublishedJobsPaginatedAction({
      page: nextPage,
      limit: BATCH_SIZE,
      search: searchQuery,
      employmentType: selectedType,
      departmentId: selectedDepartment,
    });

    if (res.success) {
      const newJobs = res.jobs as JobPostingItem[];
      setJobs((prev) => {
        const existingIds = new Set(prev.map((j) => j.id));
        const filteredNew = newJobs.filter((j) => !existingIds.has(j.id));
        return [...prev, ...filteredNew];
      });
      setHasMore(res.hasMore);
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  }, [page, hasMore, isLoadingMore, isLoading, searchQuery, selectedType, selectedDepartment]);

  // YouTube Comment Style IntersectionObserver Sentinel
  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadNextPage();
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage, hasMore, isLoadingMore, isLoading]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedType !== "ALL" || selectedDepartment !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedDepartment("ALL");
  };

  const handleOpenModal = (job: JobPostingItem) => {
    setModalJob(job);
    setCoverLetter("");
    setResumeUrl("");
    setApplyError(null);
    setApplySuccess(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession || !modalJob) return;

    setIsSubmitting(true);
    setApplyError(null);
    setApplySuccess(null);

    const res = await applyForJobAction({
      jobPostingId: modalJob.id,
      coverLetter,
      resumeUrl,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setApplyError(res.error || "Failed to submit application.");
    } else {
      setApplySuccess("Application submitted successfully!");
      setAppliedIds((prev) => [...prev, modalJob.id]);
      setTimeout(() => setModalJob(null), 1500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by position title, company name, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-xs bg-background rounded-lg border-input focus-visible:ring-primary"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                <HiOutlineXMark className="size-4" />
              </button>
            ) : null}
          </div>

          {/* Department Shadcn Dropdown */}
          <div className="w-full md:w-64">
            <SearchableSelect
              name="department"
              value={selectedDepartment}
              onChange={(val) => setSelectedDepartment(val)}
              options={[
                { value: "ALL", label: "All Departments" },
                ...departments.map((dept) => ({ value: dept.id, label: dept.name })),
              ]}
              placeholder="All Departments"
              searchPlaceholder="Search departments..."
              allowCustom={false}
              className="h-10 text-xs rounded-lg bg-background"
            />
          </div>
        </div>

        {/* Filter Pills & Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1.5">
              <HiOutlineFunnel className="size-3.5" />
              Type:
            </span>
            {employmentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {type === "ALL" ? "All Types" : type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-medium text-muted-foreground">
              Showing <span className="font-bold text-foreground">{jobs.length}</span> position{jobs.length !== 1 ? "s" : ""}
            </span>
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <HiOutlineXMark className="size-3.5" />
                Reset filters
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modern Responsive Job Cards Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 w-20 bg-muted rounded" />
                  <div className="h-5 w-36 bg-muted rounded" />
                </div>
              </div>
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-9 w-full bg-muted rounded-lg mt-4" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HiOutlineBriefcase className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No matching positions found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            We couldn't find any positions matching your search. Try resetting your filters to explore available opportunities.
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="font-semibold rounded-lg">
              Clear All Filters
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const hasApplied = appliedIds.includes(job.id);

            return (
              <div
                key={job.id}
                className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md group"
              >
                <div className="space-y-3 cursor-pointer" onClick={() => handleOpenModal(job)}>
                  {/* Header: Avatar, Company, Title & Type */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                        {job.company.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block truncate">
                          {job.company.name}
                        </span>
                        <h2 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                          {job.title}
                        </h2>
                      </div>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground shrink-0 border border-border/50">
                      {job.employmentType}
                    </span>
                  </div>

                  {/* Metadata: Location, Department, Salary */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
                    {job.location ? (
                      <span className="flex items-center gap-1">
                        <HiOutlineMapPin className="size-3.5 text-primary shrink-0" />
                        {job.location}
                      </span>
                    ) : null}
                    {job.department?.name ? (
                      <span className="flex items-center gap-1">
                        <HiOutlineBuildingOffice2 className="size-3.5 text-primary shrink-0" />
                        {job.department.name}
                      </span>
                    ) : null}
                    {job.salaryRange ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <HiOutlineCurrencyDollar className="size-3.5 shrink-0" />
                        {job.salaryRange}
                      </span>
                    ) : null}
                  </div>

                  {/* Truncated Description */}
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <HiOutlineClock className="size-3.5" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {hasApplied ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        <HiOutlineCheckCircle className="size-3.5" />
                        Applied
                      </span>
                    ) : null}
                    <Button
                      variant={hasApplied ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleOpenModal(job)}
                      className="font-semibold gap-1.5 text-xs rounded-lg h-8 px-3"
                    >
                      <span>View Details</span>
                      <HiOutlineArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="py-6 text-center">
        {isLoadingMore ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-semibold text-primary shadow-xs border border-border">
            <HiOutlineArrowPath className="size-4 animate-spin text-primary" />
            <span>Loading more job openings...</span>
          </div>
        ) : !hasMore && jobs.length > 0 ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <HiOutlineCheckCircle className="size-3.5 text-emerald-500" />
            <span>You've reached the end of available job listings.</span>
          </div>
        ) : null}
      </div>

      {/* Official Shadcn Dialog Component for Clean Modal Popup */}
      {modalJob ? (
        <Dialog open={Boolean(modalJob)} onOpenChange={(open) => !open && setModalJob(null)}>
          <DialogPortal>
            <DialogOverlay onClick={() => setModalJob(null)} />
            <DialogContent className="max-w-xl rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5">
              <DialogHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-base border border-primary/20">
                    {modalJob.company.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
                      {modalJob.company.name}
                    </span>
                    <DialogTitle className="text-lg font-bold text-foreground leading-tight">
                      {modalJob.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{modalJob.employmentType}</span>
                      {modalJob.location ? <span>• {modalJob.location}</span> : null}
                      {modalJob.salaryRange ? (
                        <span className="font-semibold text-emerald-600">
                          • {modalJob.salaryRange}
                        </span>
                      ) : null}
                    </DialogDescription>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalJob(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  aria-label="Close dialog"
                >
                  <HiOutlineXMark className="size-5" />
                </button>
              </DialogHeader>

              {/* Scrollable Content Body */}
              <div className="space-y-4 text-xs text-foreground leading-relaxed overflow-y-auto max-h-[55vh] pr-1">
                <div className="bg-muted/40 p-4 rounded-lg border border-border/60 space-y-1.5">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5">
                    <HiOutlineDocumentText className="size-4 text-primary" />
                    Position Overview
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {modalJob.description}
                  </p>
                </div>

                {modalJob.requirements ? (
                  <div className="bg-muted/40 p-4 rounded-lg border border-border/60 space-y-1.5">
                    <h4 className="font-bold text-foreground flex items-center gap-1.5">
                      <HiOutlineSparkles className="size-4 text-primary" />
                      Requirements & Qualifications
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {modalJob.requirements}
                    </p>
                  </div>
                ) : null}

                {/* Application Form */}
                <div className="pt-2">
                  {appliedIds.includes(modalJob.id) ? (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-center space-y-1">
                      <HiOutlineCheckCircle className="size-6 text-emerald-500 mx-auto" />
                      <h5 className="text-xs font-bold text-emerald-600">
                        Application Already Submitted
                      </h5>
                      <p className="text-[11px] text-muted-foreground">
                        You have already applied for this role.
                      </p>
                    </div>
                  ) : userSession ? (
                    <form id="job-apply-form" onSubmit={handleApplySubmit} className="space-y-3.5">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-t border-border pt-3">
                        <HiOutlineSparkles className="size-4 text-primary" />
                        Submit Your Application
                      </h4>

                      {applyError ? (
                        <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
                          {applyError}
                        </p>
                      ) : null}

                      {applySuccess ? (
                        <p className="text-xs text-emerald-600 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                          <HiOutlineCheckCircle className="size-4" />
                          {applySuccess}
                        </p>
                      ) : null}

                      <div className="space-y-1.5">
                        <Label htmlFor="coverLetter" className="text-xs font-medium">Cover Letter / Note (Optional)</Label>
                        <textarea
                          id="coverLetter"
                          rows={3}
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Introduce yourself and state your key qualifications..."
                          className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="resumeUrl" className="text-xs font-medium">Resume / LinkedIn / Portfolio URL (Optional)</Label>
                        <Input
                          id="resumeUrl"
                          type="url"
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile or https://drive.google.com/..."
                          className="h-9 text-xs rounded-lg border-input"
                        />
                      </div>
                    </form>
                  ) : (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
                      <h5 className="text-xs font-bold text-foreground">Sign in to apply</h5>
                      <p className="text-[11px] text-muted-foreground">
                        Create an account or sign in to submit your job application.
                      </p>
                      <a
                        href={`/user/register?jobId=${encodeURIComponent(modalJob.id)}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
                      >
                        <span>Apply / Register Account</span>
                        <HiOutlineArrowRight className="size-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Dialog Footer Actions */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalJob(null)}
                  disabled={isSubmitting}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                {userSession && !appliedIds.includes(modalJob.id) ? (
                  <Button
                    type="submit"
                    form="job-apply-form"
                    variant="default"
                    size="sm"
                    disabled={isSubmitting}
                    className="font-bold text-xs rounded-lg gap-1.5"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm & Submit Application"}
                    <HiOutlineArrowRight className="size-3.5" />
                  </Button>
                ) : null}
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      ) : null}

    </div>
  );
}
