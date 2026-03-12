"use server";

import { db } from "@/db";
import { project, project_members, seo_analysis, user } from "@/db/schema";
import { and, count, desc, eq, isNotNull, or } from "drizzle-orm";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSubscriptionStatus } from "./subscription";
import { getPlanLimits, resolvePlan } from "../constants/plans";

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
    .leftJoin(
      project_members,
      and(
        eq(project_members.projectId, project.id),
        eq(project_members.userId, session.user.id),
      ),
    )
    .leftJoin(seo_analysis, eq(project.id, seo_analysis.projectId))
    .where(
      or(eq(project.userId, session.user.id), isNotNull(project_members.userId)),
    )
    .groupBy(project.id, project.name, project.createdAt, project.updatedAt)
    .orderBy((fields) => fields.updatedAt);

  return projects;
}

export async function createProject(name: string): Promise<
  | { ok: true; projectId: string }
  | { ok: false; message: string; code?: "LIMIT" | "VALIDATION" | "UNAUTH" }
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { ok: false, code: "UNAUTH", message: "Unauthorized" };
  }

  const trimmed = (name ?? "").trim();
  if (!trimmed) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "Project name is required",
    };
  }

  const sub = await getSubscriptionStatus(session.user.id);
  const plan = resolvePlan(sub?.plan ?? null, sub?.status ?? null);
  const limits = getPlanLimits(plan);

  const projectsCountRow = await db
    .select({ value: count(project.id) })
    .from(project)
    .where(eq(project.userId, session.user.id))
    .limit(1);

  const createdProjects = Number(projectsCountRow[0]?.value ?? 0);

  if (Number.isFinite(limits.maxProjects) && createdProjects >= limits.maxProjects) {
    return {
      ok: false,
      code: "LIMIT",
      message: `You have reached your maximum of ${limits.maxProjects} projects for your current plan.`,
    };
  }

  const inserted = await db
    .insert(project)
    .values({
      name: trimmed,
      userId: session.user.id,
    })
    .returning({ id: project.id })
    .then((rows) => rows[0]);

  if (!inserted?.id) {
    return { ok: false, message: "Failed to create project" };
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/analysis/new");

  return { ok: true, projectId: inserted.id };
}

export type ProjectPageData = {
  project: { id: string; name: string; ownerId: string };
  members: Array<{
    userId: string;
    name: string | null;
    email: string;
    role: string;
    joinedAt: Date;
  }>;
  analyses: Array<{
    id: string;
    title: string;
    url: string;
    updatedAt: Date;
  }>;
  isOwner: boolean;
};

export async function getProjectPageData(
  projectId: string,
): Promise<ProjectPageData | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const access = await db
    .select({
      id: project.id,
      name: project.name,
      ownerId: project.userId,
      memberUserId: project_members.userId,
    })
    .from(project)
    .leftJoin(
      project_members,
      and(
        eq(project_members.projectId, project.id),
        eq(project_members.userId, session.user.id),
      ),
    )
    .where(
      and(
        eq(project.id, projectId),
        or(eq(project.userId, session.user.id), isNotNull(project_members.userId)),
      ),
    )
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!access) return null;

  const [ownerRow, membersRows, analysesRows] = await Promise.all([
    db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, access.ownerId))
      .limit(1)
      .then((rows) => rows[0] ?? null),
    db
      .select({
        userId: project_members.userId,
        role: project_members.role,
        joinedAt: project_members.createdAt,
        name: user.name,
        email: user.email,
      })
      .from(project_members)
      .innerJoin(user, eq(user.id, project_members.userId))
      .where(eq(project_members.projectId, projectId))
      .orderBy(desc(project_members.createdAt)),
    db
      .select({
        id: seo_analysis.id,
        title: seo_analysis.title,
        url: seo_analysis.url,
        updatedAt: seo_analysis.updatedAt,
      })
      .from(seo_analysis)
      .where(eq(seo_analysis.projectId, projectId))
      .orderBy(desc(seo_analysis.updatedAt))
      .limit(50),
  ]);

  const ownerMember =
    ownerRow
      ? [
          {
            userId: ownerRow.id,
            name: ownerRow.name,
            email: ownerRow.email,
            role: "owner",
            joinedAt: new Date(),
          },
        ]
      : [];

  return {
    project: { id: access.id, name: access.name, ownerId: access.ownerId },
    members: [...ownerMember, ...membersRows],
    analyses: analysesRows.map((a) => ({
      ...a,
      title: a.title ?? "SEO analysis",
    })),
    isOwner: access.ownerId === session.user.id,
  };
}
