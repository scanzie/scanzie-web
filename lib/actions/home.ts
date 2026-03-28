"use server";

import { unstable_cache } from "next/cache";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { seo_analysis, user } from "@/db/schema";

export type HomeStats = {
  totalUsers: number;
  totalAnalyses: number;
};

const getCachedHomeStats = unstable_cache(
  async (): Promise<HomeStats> => {
    try {
      const [usersCountRow, analysesCountRow] = await Promise.all([
        db.select({ value: count(user.id) }).from(user),
        db.select({ value: count(seo_analysis.id) }).from(seo_analysis),
      ]);

      return {
        totalUsers: Number(usersCountRow[0]?.value ?? 0),
        totalAnalyses: Number(analysesCountRow[0]?.value ?? 0),
      };
    } catch (error) {
      console.error("Failed to fetch home stats:", error);

      return {
        totalUsers: 0,
        totalAnalyses: 0,
      };
    }
  },
  ["home-stats"],
  {
    revalidate: 300,
  },
);

export async function getHomeStats() {
  return getCachedHomeStats();
}
