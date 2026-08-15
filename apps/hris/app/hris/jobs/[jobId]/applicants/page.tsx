import { JobApplicantsClient } from "@/app/hris/utils/components/job-applicants-client";
import { getJobPostingById, getJobApplicationsWithDetails } from "@/app/hris/utils/queries/job-queries";
import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function Page(props: {
  params: Promise<{ jobId: string }>;
}) {
  const params = await props.params;
  const jobId = params.jobId;

  const session = await getSafeSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const [job, applicants] = await Promise.all([
    getJobPostingById(jobId),
    getJobApplicationsWithDetails(jobId),
  ]);

  if (!job) {
    redirect("/hris/jobs");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <JobApplicantsClient
        job={job}
        initialApplicants={applicants}
      />
    </div>
  );
}
