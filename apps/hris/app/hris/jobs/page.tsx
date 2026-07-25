import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getJobPostings } from "../utils/queries/job-queries";
import { JobPostingsList } from "../utils/components/job-postings-list";

export default async function Page(props: {
  searchParams?: Promise<{ page?: string; items?: string; view?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page || 1);
  const itemsPerPage = Number(searchParams?.items || 20);
  const viewMode = (searchParams?.view as "grid" | "rows") || "grid";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const jobPostingsList = user.companyId ? await getJobPostings(user.companyId) : [];

  return (
    <JobPostingsList
      jobPostings={jobPostingsList}
      companyId={user.companyId || ""}
      page={page}
      itemsPerPage={itemsPerPage}
      viewMode={viewMode}
    />
  );
}
