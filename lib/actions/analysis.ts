"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { seo_analysis, project } from "../../db/schema";
import { auth } from "../../utils/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { revalidateTag as revalidateTagNext } from "next/cache";

const getSessionUserId = async (): Promise<string> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthenticated");

  return session.user.id;
};

// Cached function for fetching analysis details
export const fetchAnalysisDetails = async (url: string) => {
  const userId = await getSessionUserId();

  const getCachedAnalysisDetails = unstable_cache(
    async (userId: string, url: string) => {
      try {
        const analysis = await db
          .select({
            analysis: seo_analysis,
            projectName: project.name,
          })
          .from(seo_analysis)
          .innerJoin(project, eq(seo_analysis.projectId, project.id))
          .where(
            and(eq(seo_analysis.userId, userId), eq(seo_analysis.url, url)),
          )
          .limit(1);

        return analysis[0];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    ["analysis-details"],
    {
      tags: [`analysis-details-${userId}`, `analysis-details-${userId}-${url}`],
      revalidate: 2, // 5 minutes
    },
  );

  return getCachedAnalysisDetails(userId, url);
};

// Cached function for fetching user analysis with pagination
export const fetchUserAnalysis = async (
  page: number = 1,
  itemsPerPage: number = 12,
) => {
  const userId = await getSessionUserId();
  const offset = (page - 1) * itemsPerPage;

  const getCachedUserAnalysis = unstable_cache(
    async (userId: string, offset: number, limit: number, pageNum: number) => {
      try {
        // Get total count
        const countResult = await db
          .select({ count: seo_analysis.id })
          .from(seo_analysis)
          .where(eq(seo_analysis.userId, userId));

        const total = countResult.length;
        const totalPages = Math.ceil(total / limit);

        // Get paginated results
        const analysis = await db
          .select({
            analysis: seo_analysis,
            projectName: project.name,
          })
          .from(seo_analysis)
          .innerJoin(project, eq(seo_analysis.projectId, project.id))
          .where(eq(seo_analysis.userId, userId))
          .orderBy(seo_analysis.createdAt)
          .limit(limit)
          .offset(offset);

        return {
          data: analysis,
          total,
          totalPages,
          currentPage: pageNum,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    ["user-analysis-paginated"],
    {
      tags: [`user-analysis-${userId}`],
      revalidate: 2, // 5 minutes
    },
  );

  return getCachedUserAnalysis(userId, offset, itemsPerPage, page);
};

// Fetch only the last 4 analyses for Dashboard
export const fetchRecentAnalysis = async () => {
  const userId = await getSessionUserId();

  const getCachedRecentAnalysis = unstable_cache(
    async (userId: string) => {
      try {
        const analysis = await db
          .select({ analysis: seo_analysis })
          .from(seo_analysis)
          .where(eq(seo_analysis.userId, userId))
          .orderBy(seo_analysis.updatedAt)
          .limit(4);

        return analysis.map((item) => item.analysis);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    ["recent-analysis"],
    {
      tags: [`user-analysis-${userId}`],
      revalidate: 2, 
    },
  );

  return getCachedRecentAnalysis(userId);
};

// Delete function with cache invalidation
export const deleteAnalysis = async (id: string) => {
  const userId = await getSessionUserId();
  try {
    await db
      .delete(seo_analysis)
      .where(and(eq(seo_analysis.userId, userId), eq(seo_analysis.id, id)));

    // @ts-expect-error - revalidateTag API mismatch
    revalidateTagNext(`user-analysis-${userId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Helper function to invalidate all user analysis caches
export const invalidateUserAnalysisCache = async (userId?: string) => {
  const targetUserId = userId || (await getSessionUserId());

  // @ts-expect-error - revalidateTag API mismatch
  revalidateTagNext(`user-analysis-${targetUserId}`);
};

// Helper function to invalidate specific analysis cache
export const invalidateAnalysisDetailsCache = async (
  url: string,
  userId?: string,
) => {
  const targetUserId = userId || (await getSessionUserId());

//   @ts-expect-error - revalidateTag API mismatch
  revalidateTagNext(`analysis-details-${targetUserId}-${url}`);
};
