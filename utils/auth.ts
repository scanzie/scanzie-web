import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { notifyAnalyzerApi } from "@/lib/internal/notifications";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      account: schema.account,
      session: schema.session,
      verification: schema.verification,
    },
  }),
  databaseHooks: {
    user: {
      create: {
        async after(createdUser) {
          if (!createdUser?.id) return;
          await notifyAnalyzerApi({
            path: "/welcome",
            body: { userId: createdUser.id },
          });
        },
      },
    },
    session: {
      create: {
        async after(createdSession) {
          const userId = (createdSession as { userId?: string }).userId;
          if (!userId) return;

          const rows = await db
            .select({
              id: schema.session.id,
              ipAddress: schema.session.ipAddress,
              userAgent: schema.session.userAgent,
              createdAt: schema.session.createdAt,
            })
            .from(schema.session)
            .where(eq(schema.session.userId, userId))
            .orderBy(desc(schema.session.createdAt))
            .limit(2);

          const previous = rows.find((row) => row.id !== (createdSession as { id?: string }).id) ?? null;
          if (!previous) return;

          const ipAddress = (createdSession as { ipAddress?: string | null }).ipAddress ?? null;
          const userAgent = (createdSession as { userAgent?: string | null }).userAgent ?? null;

          const changed =
            (previous.ipAddress ?? null) !== ipAddress ||
            (previous.userAgent ?? null) !== userAgent;

          if (!changed) return;

          await notifyAnalyzerApi({
            path: "/security/device-change",
            body: {
              userId,
              ipAddress,
              userAgent,
              previousIpAddress: previous.ipAddress ?? null,
              previousUserAgent: previous.userAgent ?? null,
            },
          });
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
});

export type Session = typeof auth.$Infer.Session;
