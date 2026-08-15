import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getJobPostings,
  getCompanyDepartments,
  getCompanyBranches,
  getJobPostingsStats,
} from "../utils/queries/job-queries";
import { JobPostingsList } from "../utils/components/job-postings-list";

export default async function Page(props: {
  searchParams?: Promise<{ page?: string; items?: string; q?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page || 1);
  const items = Number(searchParams?.items || 10);
  const search = searchParams?.q || searchParams?.search || "";

  const session = await getSafeSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const [{ jobPostings, totalCount }, departmentsList, branchesList, stats] = await Promise.all([
    user.companyId
      ? getJobPostings({
          companyId: user.companyId,
          page,
          itemsPerPage: items,
          search,
        })
      : { jobPostings: [], totalCount: 0 },
    user.companyId ? getCompanyDepartments(user.companyId) : [],
    user.companyId ? getCompanyBranches(user.companyId) : [],
    user.companyId
      ? getJobPostingsStats(user.companyId)
      : { published: 0, closed: 0, totalApplicants: 0, interviewing: 0 },
  ]);

  return (
    <JobPostingsList
      jobPostings={jobPostings}
      totalCount={totalCount}
      departments={departmentsList}
      branches={branchesList}
      companyId={user.companyId || ""}
      page={page}
      itemsPerPage={items}
      search={search}
      stats={stats}
    />
  );
}
