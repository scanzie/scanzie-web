"use server";

import { db } from "@/db";
import { project, seo_analysis } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export async function getUserProjects() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const projects = await db
    .select({
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      analysisCount: count(seo_analysis.id),
    })
    .from(project)
    .leftJoin(seo_analysis, eq(project.id, seo_analysis.projectId))
    .where(eq(project.userId, session.user.id))
    .groupBy(project.id, project.name, project.createdAt, project.updatedAt)
    .orderBy((fields) => fields.updatedAt);

  return projects;
}
