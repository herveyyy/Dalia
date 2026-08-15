import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { updateApplicationStatusAction } from "../actions/job-actions";

export interface FileRecordWithActiveUrl {
  id: string;
  parentId: string;
  parentType: string;
  fileCategory: string;
  fileName: string;
  fileKey: string;
  mimeType: string | null;
  fileSize: number | null;
  activeUrl: string;
}

export interface ApplicantRecord {
  id: string;
  jobPostingId: string;
  status: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  appFiles: FileRecordWithActiveUrl[];
  videoFile: FileRecordWithActiveUrl | null;
  resumeFile: FileRecordWithActiveUrl | null;
  coverLetterFile: FileRecordWithActiveUrl | null;
  userFiles: FileRecordWithActiveUrl[];
  defaultVideoFile: FileRecordWithActiveUrl | null;
  defaultResumeFile: FileRecordWithActiveUrl | null;
  defaultCoverLetterFile: FileRecordWithActiveUrl | null;
}

export function useJobApplicants(initialApplicants: ApplicantRecord[]) {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("user_id");

  const [applicants, setApplicants] = useState<ApplicantRecord[]>(initialApplicants);
  
  // Find initial applicant based on user_id query param, fallback to first applicant
  const [selectedAppId, setSelectedAppId] = useState<string | null>(() => {
    if (userIdParam) {
      const matched = initialApplicants.find((a) => a.candidate.id === userIdParam);
      if (matched) return matched.id;
    }
    return initialApplicants.length > 0 ? initialApplicants[0]?.id || null : null;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Pending" | "Viewed" | "Interviewing" | "Accepted" | "Rejected">("ALL");
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);

  // Confirmation & Undo States
  const [confirmTarget, setConfirmTarget] = useState<{
    applicationId: string;
    status: "Pending" | "Viewed" | "Interviewing" | "Accepted" | "Rejected";
  } | null>(null);

  const [lastAction, setLastAction] = useState<{
    applicationId: string;
    previousStatus: "Pending" | "Viewed" | "Interviewing" | "Accepted" | "Rejected";
    newStatus: "Pending" | "Viewed" | "Interviewing" | "Accepted" | "Rejected";
  } | null>(null);

  // Filtered applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Currently selected application
  const selectedApp = applicants.find((app) => app.id === selectedAppId) || null;

  // Handle status update
  const handleUpdateStatus = async (
    applicationId: string,
    status: "Pending" | "Viewed" | "Interviewing" | "Accepted" | "Rejected",
    agreedSalary?: string
  ) => {
    setActionPendingId(applicationId);
    try {
      const res = await updateApplicationStatusAction(applicationId, status, agreedSalary);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
        );
      } else {
        alert(res.error || "Failed to update status.");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred.");
    } finally {
      setActionPendingId(null);
    }
  };

  // Trigger manual confirmation modal
  const triggerConfirmStatus = (
    applicationId: string,
    status: "Pending" | "Viewed" | "Interviewing" | "Accepted" | "Rejected"
  ) => {
    setConfirmTarget({ applicationId, status });
  };

  // Execute manual status update after confirmation
  const handleConfirmStatusUpdate = async (agreedSalary?: string) => {
    if (!confirmTarget) return;
    const { applicationId, status } = confirmTarget;

    const app = applicants.find((a) => a.id === applicationId);
    if (app) {
      setLastAction({
        applicationId,
        previousStatus: app.status as any,
        newStatus: status,
      });
    }

    setConfirmTarget(null);
    await handleUpdateStatus(applicationId, status, agreedSalary);
  };

  // Undo last action
  const handleUndo = async () => {
    if (!lastAction) return;
    const { applicationId, previousStatus } = lastAction;
    setLastAction(null);
    await handleUpdateStatus(applicationId, previousStatus);
  };

  // Auto-view logic: when a candidate is selected, if they are "Pending", update their status to "Viewed"
  useEffect(() => {
    if (!selectedAppId) return;
    const app = applicants.find((a) => a.id === selectedAppId);
    if (app && app.status === "Pending") {
      handleUpdateStatus(app.id, "Viewed");
    }
  }, [selectedAppId, applicants]);

  // Video resolution (prioritize application specific, fall back to default)
  const activeVideo = selectedApp?.videoFile || selectedApp?.defaultVideoFile || null;
  const isDefaultVideo = selectedApp?.videoFile ? false : !!selectedApp?.defaultVideoFile;

  return {
    applicants,
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
    confirmTarget,
    setConfirmTarget,
    lastAction,
    setLastAction,
    triggerConfirmStatus,
    handleConfirmStatusUpdate,
    handleUndo,
  };
}
