"use client";

import * as React from "react";
import Link from "next/link";
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
import { deleteJobPosting } from "../actions/job-actions";
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
  HiOutlineArchiveBox,
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";
import {
  useJobPostingsList,
  JobPostingRecord,
  DepartmentRecord,
  BranchRecord,
} from "./job-postings-list.hooks";

interface JobPostingsListProps {
  jobPostings: JobPostingRecord[];
  totalCount: number;
  departments?: DepartmentRecord[];
  branches?: BranchRecord[];
  companyId: string;
  page?: number;
  itemsPerPage?: number;
  search?: string;
  stats?: {
    published: number;
    closed: number;
    totalApplicants: number;
    interviewing: number;
  };
}

export function JobPostingsList({
  jobPostings,
  totalCount,
  departments = [],
  branches = [],
  companyId,
  page = 1,
  itemsPerPage = 10,
  search: initialSearch = "",
  stats,
}: JobPostingsListProps) {
  const {
    isOpen,
    selectedJob,
    deleteTargetId,
    setDeleteTargetId,
    isPending,
    startTransition,
    searchValue,
    setSearchValue,
    viewMode,
    setViewMode,
    handleSearchSubmit,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
    departmentOptions,
    locationOptions,
    router,
    VIEW_STORAGE_KEY,
  } = useJobPostingsList(initialSearch, companyId, departments, branches);

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

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {/* Published Jobs */}
          <div className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <HiOutlineBriefcase className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Active Listings</p>
              <h4 className="text-xl font-bold text-foreground mt-0.5">{stats.published}</h4>
            </div>
          </div>

          {/* Closed Jobs */}
          <div className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
            <div className="size-10 rounded-xl bg-slate-500/10 text-slate-600 flex items-center justify-center shrink-0">
              <HiOutlineArchiveBox className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Closed Jobs</p>
              <h4 className="text-xl font-bold text-foreground mt-0.5">{stats.closed}</h4>
            </div>
          </div>

          {/* Total Applicants */}
          <div className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <HiOutlineUserGroup className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Applicants</p>
              <h4 className="text-xl font-bold text-foreground mt-0.5">{stats.totalApplicants}</h4>
            </div>
          </div>

          {/* Active Interviews */}
          <div className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <HiOutlineChatBubbleLeftRight className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Interviewing</p>
              <h4 className="text-xl font-bold text-foreground mt-0.5">{stats.interviewing}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Button type="submit" size="sm" className="h-9">
          Search
        </Button>
      </form>

      {/* Jobs Grid / Row List */}
      {jobPostings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card shadow-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HiOutlineBriefcase className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-foreground">No job postings found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
            {searchValue ? "No active jobs match your search query." : "Post a new opening to start accepting candidate applications."}
          </p>
          {!searchValue && (
            <div className="mt-6">
              <Button onClick={() => handleOpenDialog(null)} size="sm">
                Add First Job Posting
              </Button>
            </div>
          )}
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
                <Link
                  href={`/hris/jobs/${job.id}/applicants`}
                  className="font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md transition-colors duration-150 outline-none focus:ring-1 focus:ring-primary/30"
                >
                  {job.applicantCount ?? 0} Applicant{(job.applicantCount ?? 0) !== 1 ? "s" : ""}
                </Link>
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
                    <Link
                      href={`/hris/jobs/${job.id}/applicants`}
                      className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-0.5 rounded-md transition-colors duration-150 outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      {job.applicantCount ?? 0} applicant{(job.applicantCount ?? 0) !== 1 ? "s" : ""}
                    </Link>
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
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selectedJob ? "Edit Job Posting" : "Create Job Posting"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Provide details about the opening to post it on your career listing pages.
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col justify-between">
                <div className="p-6 space-y-4">
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
    </div>
  );
}
