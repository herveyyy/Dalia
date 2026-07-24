import { getUserRecord } from "./get-user-record.query";
import { getCompanyRecord } from "./get-company-record.query";
import { getCompanyWorkspaces } from "./get-company-workspaces.query";
import { unstable_cache } from "next/cache";

export const getOverviewCompany = (userId: string) =>
  unstable_cache(
    async () => {
      try {
        const userRecord = await getUserRecord(userId);
        if (!userRecord || !userRecord.companyId) {
          return null;
        }

        const companyRecord = await getCompanyRecord(userRecord.companyId);
        if (!companyRecord) {
          return null;
        }

        const workspacesList = await getCompanyWorkspaces(userRecord.companyId);

        return {
          company: companyRecord,
          workspaces: workspacesList,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch company overview data");
      }
    },
    [`overview-company-${userId}`],
    { tags: [`overview-company-${userId}`] }
  )();
