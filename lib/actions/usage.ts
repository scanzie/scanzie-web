"use server";

import { db } from "@/db";
import { project, seo_analysis } from "@/db/schema";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { count, eq } from "drizzle-orm";

export type PlanUsage = {
  projects: number;
  analyses: number;
};

export async function getUserUsage(): Promise<PlanUsage> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const {user: { id: userId }} = session;

  const [projectsCountRow, analysesCountRow] = await Promise.all([
    db
      .select({ value: count(project.id) })
      .from(project)
      .where(eq(project.userId, userId)),
    db
      .select({ value: count(seo_analysis.id) })
      .from(seo_analysis)
      .where(eq(seo_analysis.userId, userId)),
  ]);

  return {
    projects: Number(projectsCountRow[0]?.value ?? 0),
    analyses: Number(analysesCountRow[0]?.value ?? 0),
  };
}

