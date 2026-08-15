import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveJobPosting, deleteJobPosting } from "../actions/job-actions";

export interface JobPostingRecord {
  id: string;
  title: string;
  departmentId?: string | null;
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

export interface DepartmentRecord {
  id: string;
  name: string;
}

export interface BranchRecord {
  id: string;
  name: string;
  code?: string | null;
  address?: string | null;
}

const VIEW_STORAGE_KEY = "hris_job_postings_table";

export function useJobPostingsList(
  initialSearch: string,
  companyId: string,
  departments: DepartmentRecord[],
  branches: BranchRecord[]
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostingRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "rows">("rows");

  useEffect(() => {
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
      departmentId: formData.get("department") as string,
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

  // Format department options for SearchableSelect
  const departmentOptions = departments.map((d) => ({
    value: d.id,
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

  return {
    isOpen,
    setIsOpen,
    selectedJob,
    setSelectedJob,
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
  };
}
