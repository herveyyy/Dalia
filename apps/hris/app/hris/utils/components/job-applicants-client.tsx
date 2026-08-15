"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import Link from "next/link";
import {
  useJobApplicants,
  ApplicantRecord,
} from "./job-applicants-client.hooks";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineInformationCircle,
  HiOutlineEye,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

interface JobPostingRecord {
  id: string;
  title: string;
  department: string | null;
  employmentType: string;
  location: string | null;
  salaryRange: string | null;
  status: string;
}

interface JobApplicantsClientProps {
  job: JobPostingRecord;
  initialApplicants: ApplicantRecord[];
}

export function JobApplicantsClient({ job, initialApplicants }: JobApplicantsClientProps) {
  const router = useRouter();
  
  const {
    selectedAppId,
    setSelectedAppId,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    actionPendingId,
    filteredApplicants,
    selectedApp,
    handleUpdateStatus,
    activeVideo,
    isDefaultVideo,
  } = useJobApplicants(initialApplicants);

  return (
    <div className="space-y-6">
      {/* Back & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/hris/jobs"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 shadow-xs"
          >
            <HiOutlineArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Recruitment</span>
              <span>/</span>
              <span>Jobs</span>
              <span>/</span>
              <span className="truncate max-w-[150px]">{job.title}</span>
              <span>/</span>
              <span className="text-foreground font-medium">Applicants</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              Applicants for <span className="text-primary">{job.title}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-muted-foreground">Job Status:</span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              job.status === "Published"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-amber-500/10 text-amber-500"
            }`}
          >
            {job.status}
          </span>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Directory of Applicants */}
        <div className="lg:col-span-1 bg-card border border-border/80 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-foreground">Candidate Directory</h3>
            <p className="text-xs text-muted-foreground">
              {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search candidate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {(["ALL", "Pending", "Viewed", "Interviewing", "Accepted", "Rejected"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                    statusFilter === filter
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {filteredApplicants.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed border-border rounded-xl">
                <HiOutlineUser className="size-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">No applicants match criteria</p>
              </div>
            ) : (
              filteredApplicants.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 hover:bg-muted/30 hover:border-border/80 ${
                    selectedAppId === app.id
                      ? "bg-primary/5 border-primary/50 ring-1 ring-primary/20"
                      : "bg-card border-border/50"
                  }`}
                >
                  <div className="size-10 rounded-full overflow-hidden border border-border bg-primary/10 flex items-center justify-center shrink-0">
                    {app.candidate.image ? (
                      <img src={app.candidate.image} alt={app.candidate.name} className="size-full object-cover" />
                    ) : (
                      <span className="text-primary font-bold text-sm">
                        {app.candidate.name?.[0]?.toUpperCase() ?? "C"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-foreground truncate">{app.candidate.name}</h4>
                      <span
                        className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold shrink-0 ${
                          app.status === "Accepted"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : app.status === "Rejected"
                              ? "bg-destructive/10 text-destructive"
                              : app.status === "Interviewing"
                                ? "bg-purple-500/10 text-purple-500"
                                : app.status === "Viewed"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{app.candidate.email}</p>
                    <span className="text-[9px] text-muted-foreground mt-1.5 block">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Applicant Detail Display */}
        <div className="lg:col-span-2 space-y-6">
          {selectedApp ? (
            <div className="space-y-6">
              {/* Profile Card & Action Banner */}
              <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
                      {selectedApp.candidate.image ? (
                        <img src={selectedApp.candidate.image} alt={selectedApp.candidate.name} className="size-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-2xl">
                          {selectedApp.candidate.name?.[0]?.toUpperCase() ?? "C"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{selectedApp.candidate.name}</h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <a href={`mailto:${selectedApp.candidate.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <HiOutlineEnvelope className="size-3.5" />
                          <span>{selectedApp.candidate.email}</span>
                        </a>
                        <span className="text-border hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <HiOutlineCalendar className="size-3.5" />
                          <span>Applied {new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-center border-t border-border/40 sm:border-0 pt-3 sm:pt-0">
                    {/* Mark Viewed */}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionPendingId !== null}
                      onClick={() => handleUpdateStatus(selectedApp.id, "Viewed")}
                      className={`gap-1 text-[11px] h-8 border-blue-200 hover:border-blue-500 hover:bg-blue-50/50 text-blue-600 font-bold px-3 rounded-lg transition-all ${
                        selectedApp.status === "Viewed" ? "bg-blue-50/50 ring-1 ring-blue-500/30" : ""
                      }`}
                    >
                      {actionPendingId === selectedApp.id ? (
                        <HiOutlineArrowPath className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          <HiOutlineEye className="size-3.5" />
                          <span>Viewed</span>
                        </>
                      )}
                    </Button>

                    {/* Interviewing */}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionPendingId !== null}
                      onClick={() => handleUpdateStatus(selectedApp.id, "Interviewing")}
                      className={`gap-1 text-[11px] h-8 border-purple-200 hover:border-purple-500 hover:bg-purple-50/50 text-purple-600 font-bold px-3 rounded-lg transition-all ${
                        selectedApp.status === "Interviewing" ? "bg-purple-50/50 ring-1 ring-purple-500/30" : ""
                      }`}
                    >
                      {actionPendingId === selectedApp.id ? (
                        <HiOutlineArrowPath className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          <HiOutlineChatBubbleLeftRight className="size-3.5" />
                          <span>Interview</span>
                        </>
                      )}
                    </Button>

                    {/* Accept */}
                    <Button
                      size="sm"
                      disabled={actionPendingId !== null}
                      onClick={() => handleUpdateStatus(selectedApp.id, "Accepted")}
                      className={`gap-1 text-[11px] h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 rounded-lg transition-all shadow-sm ${
                        selectedApp.status === "Accepted" ? "ring-2 ring-emerald-500/30 opacity-75" : ""
                      }`}
                    >
                      {actionPendingId === selectedApp.id ? (
                        <HiOutlineArrowPath className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          <HiOutlineCheck className="size-3.5" />
                          <span>Accept</span>
                        </>
                      )}
                    </Button>

                    {/* Reject */}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionPendingId !== null}
                      onClick={() => handleUpdateStatus(selectedApp.id, "Rejected")}
                      className={`gap-1 text-[11px] h-8 border-destructive/20 hover:border-destructive hover:bg-destructive/5 text-destructive font-bold px-3 rounded-lg transition-all ${
                        selectedApp.status === "Rejected" ? "bg-destructive/5 opacity-75" : ""
                      }`}
                    >
                      {actionPendingId === selectedApp.id ? (
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

              {/* Cover Note & Media Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Note Card */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-xs text-foreground uppercase tracking-wider mb-2">Cover Note / Message</h3>
                    <p className="text-xs text-muted-foreground bg-muted/20 border border-border/45 rounded-xl p-3.5 leading-relaxed whitespace-pre-wrap min-h-24">
                      {selectedApp.coverLetter || "No custom cover letter provided by the applicant."}
                    </p>
                  </div>

                  {/* Attached Documents specifically for this application */}
                  <div className="border-t border-border/40 pt-4 space-y-2">
                    <h4 className="font-bold text-[10px] text-foreground uppercase tracking-wider">Application Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.resumeFile && (
                        <a
                          href={selectedApp.resumeFile.activeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-card hover:bg-primary/5 border border-border hover:border-primary/30 text-xs text-foreground hover:text-primary font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs"
                        >
                          <HiOutlineDocumentText className="size-4 text-blue-500" />
                          <span className="truncate max-w-[120px]">{selectedApp.resumeFile.fileName}</span>
                          <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground shrink-0 ml-0.5" />
                        </a>
                      )}
                      {selectedApp.coverLetterFile && (
                        <a
                          href={selectedApp.coverLetterFile.activeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-card hover:bg-primary/5 border border-border hover:border-primary/30 text-xs text-foreground hover:text-primary font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs"
                        >
                          <HiOutlineDocumentText className="size-4 text-emerald-500" />
                          <span className="truncate max-w-[120px]">{selectedApp.coverLetterFile.fileName}</span>
                          <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground shrink-0 ml-0.5" />
                        </a>
                      )}
                      {selectedApp.videoFile && (
                        <a
                          href={selectedApp.videoFile.activeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-card hover:bg-primary/5 border border-border hover:border-primary/30 text-xs text-foreground hover:text-primary font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs"
                        >
                          <HiOutlineVideoCamera className="size-4 text-rose-500" />
                          <span className="truncate max-w-[120px]">{selectedApp.videoFile.fileName}</span>
                          <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground shrink-0 ml-0.5" />
                        </a>
                      )}
                      {!selectedApp.resumeFile && !selectedApp.coverLetterFile && !selectedApp.videoFile && (
                        <span className="text-xs text-muted-foreground italic">No custom attachments.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video pitch player */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Candidate Video Pitch</h3>
                      {activeVideo && (
                        <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                          {isDefaultVideo ? "Default Profile Video" : "Application Video"}
                        </span>
                      )}
                    </div>
                    {activeVideo ? (
                      <div className="bg-black/95 border border-neutral-800 rounded-xl overflow-hidden shadow-inner flex flex-col aspect-video relative group">
                        <video
                          src={activeVideo.activeUrl}
                          controls
                          preload="metadata"
                          className="size-full object-contain focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted/20 border border-dashed border-border rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center aspect-video text-center p-4">
                        <HiOutlineVideoCamera className="size-10 text-muted-foreground mb-2" />
                        <h4 className="font-bold text-xs text-foreground">No Video Uploaded</h4>
                        <p className="text-[10px] text-muted-foreground max-w-[180px] mt-0.5">
                          Candidate has not uploaded an introduction video to their profile or application.
                        </p>
                      </div>
                    )}
                  </div>

                  {activeVideo && (
                    <a
                      href={activeVideo.activeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-linear-to-r from-rose-500/10 to-rose-600/10 hover:from-rose-500/25 hover:to-rose-600/25 border border-rose-500/30 text-rose-600 hover:text-rose-700 font-bold text-xs py-2 rounded-xl transition-all shadow-xs"
                    >
                      <HiOutlineVideoCamera className="size-4" />
                      <span>Open Video In New Tab</span>
                      <HiOutlineArrowTopRightOnSquare className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Default Profile Materials section */}
              <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HiOutlineUser className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Candidate Default Profile Materials</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Primary resources set up on the candidate's self-service user profile</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Default Resume */}
                  <div className="p-3.5 border border-border/60 bg-muted/10 rounded-xl flex flex-col justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <HiOutlineDocumentText className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-foreground truncate">Default Resume</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Primary CV</p>
                      </div>
                    </div>
                    {selectedApp.defaultResumeFile ? (
                      <a
                        href={selectedApp.defaultResumeFile.activeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between bg-card hover:bg-primary/5 border border-border hover:border-primary/30 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        <span className="truncate max-w-[100px]">{selectedApp.defaultResumeFile.fileName}</span>
                        <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic bg-muted/30 p-1.5 rounded-md text-center">
                        Not Uploaded
                      </span>
                    )}
                  </div>

                  {/* Default Cover Letter */}
                  <div className="p-3.5 border border-border/60 bg-muted/10 rounded-xl flex flex-col justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <HiOutlineDocumentText className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-foreground truncate">Default Cover Letter</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Standard template</p>
                      </div>
                    </div>
                    {selectedApp.defaultCoverLetterFile ? (
                      <a
                        href={selectedApp.defaultCoverLetterFile.activeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between bg-card hover:bg-primary/5 border border-border hover:border-primary/30 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        <span className="truncate max-w-[100px]">{selectedApp.defaultCoverLetterFile.fileName}</span>
                        <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic bg-muted/30 p-1.5 rounded-md text-center">
                        Not Uploaded
                      </span>
                    )}
                  </div>

                  {/* Default Video Pitch */}
                  <div className="p-3.5 border border-border/60 bg-muted/10 rounded-xl flex flex-col justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                        <HiOutlineVideoCamera className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-foreground truncate">Default Video Pitch</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Self-intro pitch</p>
                      </div>
                    </div>
                    {selectedApp.defaultVideoFile ? (
                      <a
                        href={selectedApp.defaultVideoFile.activeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between bg-card hover:bg-primary/5 border border-border hover:border-primary/30 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        <span className="truncate max-w-[100px]">{selectedApp.defaultVideoFile.fileName}</span>
                        <HiOutlineArrowTopRightOnSquare className="size-3 text-muted-foreground" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic bg-muted/30 p-1.5 rounded-md text-center">
                        Not Uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border/80 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center space-y-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 border border-border">
                <HiOutlineInformationCircle className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-base text-foreground">Select an Applicant</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Choose a candidate from the directory panel on the left to review their cover letter, credentials, documents, and video pitch.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
