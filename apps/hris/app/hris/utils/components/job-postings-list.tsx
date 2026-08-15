"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import { SearchableSelect } from "@repo/ui/components/atoms/SearchableSelect";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/atoms/Dialog";
import { saveJobPosting, deleteJobPosting, getJobApplicationsAction, updateApplicationStatusAction } from "../actions/job-actions";
import { ConfirmDialog } from "@repo/ui/components/molecules/ConfirmDialog";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineCurrencyDollar,
  HiOutlineMagnifyingGlass,
  HiOutlineEnvelope,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineExclamationCircle,
  HiOutlineUser,
} from "react-icons/hi2";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";

interface JobPostingRecord {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employmentType: string;
  description: string;
  requirements: string | null;
  salaryRange: string | null;
  status: string;
  createdAt: string;
  applicantCount?: number;
}

interface DepartmentRecord {
  id: string;
  name: string;
}

interface BranchRecord {
  id: string;
  name: string;
  code?: string | null;
  address?: string | null;
}

interface JobPostingsListProps {
  jobPostings: JobPostingRecord[];
  totalCount: number;
  departments?: DepartmentRecord[];
  branches?: BranchRecord[];
  companyId: string;
  page?: number;
  itemsPerPage?: number;
  search?: string;
  viewMode?: "grid" | "rows";
}

const VIEW_STORAGE_KEY = "hris_job_postings_table";

export function JobPostingsList({
  jobPostings,
  totalCount,
  departments = [],
  branches = [],
  companyId,
  page = 1,
  itemsPerPage = 10,
  search: initialSearch = "",
}: JobPostingsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostingRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "rows">("rows");

  // Applicants modal states
  const [applicantsJob, setApplicantsJob] = useState<JobPostingRecord | null>(null);
  const [isApplicantsOpen, setIsApplicantsOpen] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);

  const handleViewApplicants = async (job: JobPostingRecord) => {
    setApplicantsJob(job);
    setIsApplicantsOpen(true);
    setLoadingApplicants(true);
    setApplicantsError(null);
    setApplicants([]);

    try {
      const res = await getJobApplicationsAction(job.id);
      if (res.success && res.applications) {
        setApplicants(res.applications);
      } else {
        setApplicantsError(res.error || "Failed to load applicants.");
      }
    } catch (err: any) {
      setApplicantsError(err?.message || "Failed to load applicants.");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: "Accepted" | "Rejected") => {
    setActionPendingId(applicationId);
    try {
      const res = await updateApplicationStatusAction(applicationId, status);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
        );
      } else {
        alert(res.error || "Failed to update application status.");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update status.");
    } finally {
      setActionPendingId(null);
    }
  };

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      if (saved === "row") setViewMode("rows");
      else if (saved === "column") setViewMode("grid");
      else setViewMode("rows");
    } catch {
      setViewMode("rows");
    }
  }, []);

  const updateQueryParams = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    router.push(`/hris/jobs?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ q: searchValue, page: 1 });
  };

  // Format department options for SearchableSelect
  const departmentOptions = departments.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  // Format branch/location options for SearchableSelect
  const locationOptions = [
    ...branches.map((b) => ({
      value: b.name,
      label: b.name,
      sublabel: b.address || b.code || undefined,
    })),
    { value: "Remote", label: "Remote", sublabel: "Work from anywhere" },
  ];

  const handleOpenDialog = (job: JobPostingRecord | null = null) => {
    setSelectedJob(job);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedJob(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: selectedJob?.id || null,
      companyId,
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      location: formData.get("location") as string,
      employmentType: formData.get("employmentType") as string,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      salaryRange: formData.get("salaryRange") as string,
      status: formData.get("status") as string,
    };

    startTransition(async () => {
      const res = await saveJobPosting(payload);
      if (res.success) {
        handleCloseDialog();
      }
    });
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Job Postings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your company's career openings, recruitment pipeline, and job listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle
            storageKey={VIEW_STORAGE_KEY}
            currentView={viewMode}
            onViewChange={setViewMode}
          />
          <Button onClick={() => handleOpenDialog(null)} className="gap-2">
            <HiOutlinePlus className="size-4" /> Post a Job
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar UI */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border/60">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search job postings..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 text-xs"
          />
        </form>
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{jobPostings.length}</span> of{" "}
          <span className="font-semibold text-foreground">{totalCount}</span> listings
        </div>
      </div>

      {/* Jobs Content */}
      {jobPostings.length === 0 ? (
        <div className="border border-border/60 rounded-xl bg-card p-12 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
            <HiOutlineBriefcase className="size-10 text-muted-foreground/60" />
            <p className="font-semibold text-foreground mt-2">No active job postings</p>
            <p className="text-xs">Create job listings to display on your career pages or publish them internally.</p>
            <Button onClick={() => handleOpenDialog(null)} size="sm" className="mt-4">
              Add First Job Posting
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobPostings.map((job) => (
            <div
              key={job.id}
              className="border border-border/60 rounded-xl bg-card p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                      job.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : job.status === "Draft"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {job.status}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(job)}
                      className="h-8 w-8 p-0"
                    >
                      <HiOutlinePencil className="size-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      className="h-8 w-8 p-0 hover:text-destructive text-muted-foreground"
                    >
                      <HiOutlineTrash className="size-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-foreground mt-3 leading-snug">
                  {job.title}
                </h3>

                <div className="space-y-2 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <HiOutlineBuildingOffice className="size-3.5" />
                    <span>{job.department || "General"}</span>
                    <span className="text-border">•</span>
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineMapPin className="size-3.5" />
                    <span>{job.location || "Remote"}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <HiOutlineCurrencyDollar className="size-3.5 text-muted-foreground" />
                      <span>{job.salaryRange}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-4 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="border-t border-border/40 mt-4 pt-3 text-[10px] text-muted-foreground flex items-center justify-between">
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                <button
                  type="button"
                  onClick={() => handleViewApplicants(job)}
                  className="font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md transition-colors duration-150 outline-none focus:ring-1 focus:ring-primary/30"
                >
                  {job.applicantCount ?? 0} Applicant{(job.applicantCount ?? 0) !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden divide-y">
          {jobPostings.map((job) => (
            <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30">
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    job.status === "Published"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : job.status === "Draft"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.status}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-foreground">{job.title}</h4>
                    <button
                      type="button"
                      onClick={() => handleViewApplicants(job)}
                      className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-0.5 rounded-md transition-colors duration-150 outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      {job.applicantCount ?? 0} applicant{(job.applicantCount ?? 0) !== 1 ? "s" : ""}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {job.department || "General"} · {job.employmentType} · {job.location || "Remote"}
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleOpenDialog(job)}
                  title="Edit"
                >
                  <HiOutlinePencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(job.id)}
                  title="Delete"
                  className="text-destructive hover:text-destructive"
                >
                  <HiOutlineTrash className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataPagination
        totalItems={totalCount}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        navigate={(href) => router.push(href, { scroll: false })}
      />

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
              <div className="p-6 pb-4 border-b border-border shrink-0 bg-card">
                <DialogTitle>{selectedJob ? "Edit Job Posting" : "Post a New Job"}</DialogTitle>
                <DialogDescription>
                  Configure the job details, requirements, department, and employment type.
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={selectedJob?.title || ""}
                        placeholder="e.g. Senior Backend Engineer"
                        required
                      />
                    </div>

                    {/* Department Searchable Select */}
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <SearchableSelect
                        id="department"
                        name="department"
                        defaultValue={selectedJob?.department || ""}
                        options={departmentOptions}
                        placeholder="Select or search department..."
                        searchPlaceholder="Search departments..."
                        allowCustom={true}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Location / Branch Searchable Select */}
                    <div>
                      <Label htmlFor="location">Location / Branch</Label>
                      <SearchableSelect
                        id="location"
                        name="location"
                        defaultValue={selectedJob?.location || ""}
                        options={locationOptions}
                        placeholder="Select branch or location..."
                        searchPlaceholder="Search branches..."
                        allowCustom={true}
                      />
                    </div>

                    <div>
                      <Label htmlFor="employmentType">Employment Type *</Label>
                      <select
                        id="employmentType"
                        name="employmentType"
                        defaultValue={selectedJob?.employmentType || "Full-time"}
                        className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none cursor-pointer"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="salaryRange">Salary Range (Optional)</Label>
                      <Input
                        id="salaryRange"
                        name="salaryRange"
                        defaultValue={selectedJob?.salaryRange || ""}
                        placeholder="e.g. ₱60k - ₱80k"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Listing Status</Label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={selectedJob?.status || "Published"}
                      className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none cursor-pointer"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      defaultValue={selectedJob?.description || ""}
                      placeholder="Describe the role and key duties..."
                      className="w-full rounded-lg border border-input bg-card p-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-25"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements (Optional)</Label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      rows={3}
                      defaultValue={selectedJob?.requirements || ""}
                      placeholder="Required qualifications, skills, and tools..."
                      className="w-full rounded-lg border border-input bg-card p-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-card shrink-0">
                  <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Job Posting"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Archive Job Posting"
        description="Are you sure you want to archive this job posting? It will no longer be visible to applicants."
        confirmLabel="Archive"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteTargetId) return;
          startTransition(async () => {
            await deleteJobPosting(deleteTargetId);
            setDeleteTargetId(null);
          });
        }}
      />

      {isApplicantsOpen && (
        <Dialog open={isApplicantsOpen} onOpenChange={(open) => !open && setIsApplicantsOpen(false)}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
              <div className="p-6 pb-4 border-b border-border bg-card shrink-0">
                <DialogTitle className="flex items-center gap-2">
                  <span>Applications for</span>
                  <span className="text-primary font-bold">{applicantsJob?.title}</span>
                </DialogTitle>
                <DialogDescription>
                  Review candidate cover letters, credentials, and update their recruitment status.
                </DialogDescription>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/10">
                {loadingApplicants ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <HiOutlineArrowPath className="size-8 text-primary animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading applicants...</span>
                  </div>
                ) : applicantsError ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive flex flex-col items-center justify-center gap-2">
                    <HiOutlineExclamationTriangle className="size-6" />
                    <p>{applicantsError}</p>
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="text-center py-16 space-y-3 bg-card rounded-2xl border border-dashed border-border p-8">
                    <HiOutlineUser className="size-12 text-muted-foreground mx-auto" />
                    <h3 className="font-bold text-foreground">No applications yet</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Once candidates apply to this job posting, their details and attached documents will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((app) => (
                      <div key={app.id} className="bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/60">
                        {/* Candidate Basic Info */}
                        <div className="p-5 md:w-1/3 flex flex-col justify-between space-y-4 bg-muted/5 shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="size-12 rounded-full overflow-hidden border border-border/80 flex items-center justify-center bg-primary/10 shrink-0">
                              {app.candidate.image ? (
                                <img src={app.candidate.image} alt={app.candidate.name} className="size-full object-cover" />
                              ) : (
                                <span className="text-primary font-bold text-lg">{app.candidate.name?.[0]?.toUpperCase() ?? "C"}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-foreground truncate">{app.candidate.name}</h4>
                              <p className="text-[10px] text-muted-foreground truncate">{app.candidate.email}</p>
                              <span className="text-[9px] text-muted-foreground mt-1 block">
                                Applied {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="space-y-2.5 pt-2 border-t border-border/40">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">Current Status</span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                app.status === "Accepted"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : app.status === "Rejected"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-amber-500/10 text-amber-500"
                              }`}>
                                {app.status === "Accepted" && <HiOutlineCheckCircle className="size-3" />}
                                {app.status === "Rejected" && <HiOutlineExclamationCircle className="size-3" />}
                                {app.status === "Pending" && <HiOutlineArrowPath className="size-3 animate-spin" />}
                                {app.status}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                type="button"
                                disabled={actionPendingId !== null}
                                onClick={() => handleUpdateApplicationStatus(app.id, "Accepted")}
                                className={`flex-1 gap-1 text-[11px] h-8 bg-emerald-600 hover:bg-emerald-500 text-white ${
                                  app.status === "Accepted" ? "ring-2 ring-emerald-500/30 opacity-70" : ""
                                }`}
                              >
                                {actionPendingId === app.id ? (
                                  <HiOutlineArrowPath className="size-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <HiOutlineCheck className="size-3.5" />
                                    <span>Accept</span>
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                type="button"
                                variant="outline"
                                disabled={actionPendingId !== null}
                                onClick={() => handleUpdateApplicationStatus(app.id, "Rejected")}
                                className={`flex-1 gap-1 text-[11px] h-8 border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5 text-destructive ${
                                  app.status === "Rejected" ? "bg-destructive/5 opacity-70" : ""
                                }`}
                              >
                                {actionPendingId === app.id ? (
                                  <HiOutlineArrowPath className="size-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <HiOutlineXMark className="size-3.5" />
                                    <span>Reject</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Cover Letter and Uploaded Materials */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5">Cover Note</h5>
                            <p className="text-xs text-muted-foreground bg-muted/20 border border-border/30 rounded-xl p-3 leading-relaxed whitespace-pre-wrap min-h-16">
                              {app.coverLetter || "No cover note provided by applicant."}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/40">
                            <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">Attached Documents</h5>
                            <div className="flex flex-wrap gap-2">
                              {app.resumeFile ? (
                                <a
                                  href={app.resumeFile.presignedUrl || app.resumeFile.activeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-card hover:bg-primary/5 border border-border/80 hover:border-primary/30 text-xs text-foreground hover:text-primary font-medium px-3 py-1.5 rounded-lg transition-all shadow-sm"
                                >
                                  <HiOutlineDocumentText className="size-4 text-blue-500" />
                                  <span className="truncate max-w-[120px]">{app.resumeFile.fileName}</span>
                                  <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground shrink-0 ml-0.5" />
                                </a>
                              ) : null}

                              {app.coverLetterFile ? (
                                <a
                                  href={app.coverLetterFile.presignedUrl || app.coverLetterFile.activeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-card hover:bg-primary/5 border border-border/80 hover:border-primary/30 text-xs text-foreground hover:text-primary font-medium px-3 py-1.5 rounded-lg transition-all shadow-sm"
                                >
                                  <HiOutlineDocumentText className="size-4 text-emerald-500" />
                                  <span className="truncate max-w-[120px]">{app.coverLetterFile.fileName}</span>
                                  <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground shrink-0 ml-0.5" />
                                </a>
                              ) : null}

                              {app.videoFile ? (
                                <a
                                  href={app.videoFile.presignedUrl || app.videoFile.activeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-card hover:bg-primary/5 border border-border/80 hover:border-primary/30 text-xs text-foreground hover:text-primary font-medium px-3 py-1.5 rounded-lg transition-all shadow-sm"
                                >
                                  <HiOutlineVideoCamera className="size-4 text-rose-500" />
                                  <span className="truncate max-w-[120px]">{app.videoFile.fileName}</span>
                                  <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground shrink-0 ml-0.5" />
                                </a>
                              ) : null}

                              {!app.resumeFile && !app.coverLetterFile && !app.videoFile && (
                                <span className="text-xs text-muted-foreground italic">No attached documents.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end px-6 py-4 border-t border-border bg-card shrink-0">
                <Button type="button" variant="outline" onClick={() => setIsApplicantsOpen(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
}
