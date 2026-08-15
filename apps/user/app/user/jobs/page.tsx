import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import {
  getPublishedJobs,
  getDepartmentsList,
  getUserApplications,
} from "../utils/queries";
import { JobSearchClient } from "./job-search-client";

export default async function JobsPage(props: {
  searchParams?: Promise<{ jobId?: string }>;
}) {
  const searchParams = (await props.searchParams) || {};
  const initialJobId = searchParams.jobId;

  const session = await getSafeSession(await headers());
  const user = session?.user ?? null;

  const [allJobs, departments, userApplications] = await Promise.all([
    getPublishedJobs(),
    getDepartmentsList(),
    user ? getUserApplications(user.id) : Promise.resolve([]),
  ]);

  const initialBatchSize = 6;
  const initialJobs = allJobs.slice(0, initialBatchSize);
  const initialHasMore = allJobs.length > initialBatchSize;
  const userAppliedJobIds = userApplications.map((app) => app.jobPosting.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Career Portal</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-0.5">
          Browse Open Positions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore career opportunities across partner companies, filter by department and employment type, and submit your application.
        </p>
      </div>

      <JobSearchClient
        initialJobs={initialJobs}
        initialHasMore={initialHasMore}
        departments={departments}
        userSession={
          user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null
        }
        userAppliedJobIds={userAppliedJobIds}
        initialJobId={initialJobId}
      />
    </div>
  );
}

