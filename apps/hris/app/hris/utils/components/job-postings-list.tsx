"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/atoms/Dialog";
import { saveJobPosting, deleteJobPosting } from "../actions/job-actions";
import { ConfirmDialog } from "@repo/ui/components/molecules/ConfirmDialog";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineCurrencyDollar,
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
}

interface JobPostingsListProps {
  jobPostings: JobPostingRecord[];
  companyId: string;
  page?: number;
  itemsPerPage?: number;
  viewMode?: "grid" | "rows";
}

const VIEW_STORAGE_KEY = "hris_job_postings_table";

export function JobPostingsList({
  jobPostings,
  companyId,
  page = 1,
  itemsPerPage = 20,
}: JobPostingsListProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostingRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [viewMode, setViewMode] = useState<"grid" | "rows" | null>(null);

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

  const totalItems = jobPostings.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedJobs = jobPostings.slice(startIndex, startIndex + itemsPerPage);

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
      ) : viewMode === null ? null : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="border border-border/60 rounded-xl bg-card p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${job.status === "Published"
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

              <div className="border-t border-border/40 mt-4 pt-3 text-[10px] text-muted-foreground flex justify-between">
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden divide-y">
          {paginatedJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30">
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${job.status === "Published"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : job.status === "Draft"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {job.status}
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">{job.title}</h4>
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
        totalItems={totalItems}
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
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        defaultValue={selectedJob?.department || ""}
                        placeholder="e.g. Engineering"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={selectedJob?.location || ""}
                        placeholder="e.g. Manila / Remote"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employmentType">Employment Type *</Label>
                      <select
                        id="employmentType"
                        name="employmentType"
                        defaultValue={selectedJob?.employmentType || "Full-time"}
                        className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none"
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
                      className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none"
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
    </div>
  );
}
