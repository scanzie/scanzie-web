import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  text,
  jsonb,
  uuid,
  primaryKey,
  unique,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* =========================
   ENUMS
========================= */

export const projectRoleEnum = pgEnum("project_role", [
  "owner",
  "admin",
  "member",
]);

export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "pro",
  "enterprise",
]);

export const user = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(), // ← FIXED

  name: varchar("name", { length: 255 }),

  email: varchar("email", { length: 255 }).notNull().unique(),

  emailVerified: boolean("emailVerified").default(false).notNull(),

  image: varchar("image", { length: 500 }),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 }) // ← FIXED
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: varchar("userAgent", { length: 1000 }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("session_user_idx").on(table.userId),
  }),
);

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 }) // ← FIXED
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: varchar("accountId", { length: 255 }).notNull(),
    providerId: varchar("providerId", { length: 255 }).notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      withTimezone: true,
    }),
    scope: varchar("scope", { length: 500 }),
    idToken: text("idToken"),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("account_user_idx").on(table.userId),
  }),
);

export const verification = pgTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const project = pgTable(
  "project",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }) // ← FIXED
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userProjectNameUnique: unique("project_user_name_unique").on(
      table.userId,
      table.name,
    ),
    userIdx: index("project_user_idx").on(table.userId),
  }),
);

export const seo_analysis = pgTable(
  "seo_analysis",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    userId: varchar("userId", { length: 255 }) // ← FIXED
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    url: varchar("url", { length: 400 }).notNull(),
    normalizedUrl: varchar("normalizedUrl", { length: 400 }),

    on_page: jsonb("on_page"),
    content: jsonb("content"),
    technical: jsonb("technical"),

    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueUrl: unique("seo_analysis_unique").on(
      table.projectId,
      table.userId,
      table.normalizedUrl,
    ),
    projectIdx: index("seo_project_idx").on(table.projectId),
    userIdx: index("seo_user_idx").on(table.userId),
  }),
);

export const project_members = pgTable(
  "project_members",
  {
    projectId: uuid("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    userId: varchar("userId", { length: 255 }) // ← FIXED
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    role: projectRoleEnum("role").default("member").notNull(),

    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.projectId, table.userId),
    userIdx: index("pm_user_idx").on(table.userId),
  }),
);

export const project_invite = pgTable(
  "project_invite",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    inviterUserId: varchar("inviterUserId", { length: 255 }) // ← FIXED
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    email: varchar("email", { length: 255 }).notNull(),

    token: varchar("token", { length: 255 }).notNull().unique(),

    status: inviteStatusEnum("status").default("pending").notNull(),

    acceptedAt: timestamp("acceptedAt", { withTimezone: true }),

    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    projectIdx: index("invite_project_idx").on(table.projectId),
  }),
);

export const subscription = pgTable(
  "subscription",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: varchar("userId", { length: 255 }) // ← FIXED
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(),

    plan: subscriptionPlanEnum("plan").notNull(),

    status: subscriptionStatusEnum("status").notNull(),

    subscriptionCode: varchar("subscriptionCode", { length: 255 })
      .notNull()
      .unique(),

    nextPaymentDate: timestamp("nextPaymentDate", {
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("sub_user_idx").on(table.userId),
  }),
);

// Table relations

export const projectRelations = relations(project, ({ one, many }) => ({
  creator: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),

  analyses: many(seo_analysis),

  members: many(project_members),

  invites: many(project_invite),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),

  createdProjects: many(project),

  createdSeoAnalyses: many(seo_analysis),

  projectMemberships: many(project_members),

  projectInvitesSent: many(project_invite),

  subscriptions: many(subscription),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const seoAnalysisRelations = relations(seo_analysis, ({ one }) => ({
  creator: one(user, {
    fields: [seo_analysis.userId],
    references: [user.id],
  }),

  project: one(project, {
    fields: [seo_analysis.projectId],
    references: [project.id],
  }),
}));

export const projectMembersRelations = relations(
  project_members,
  ({ one }) => ({
    user: one(user, {
      fields: [project_members.userId],
      references: [user.id],
    }),

    project: one(project, {
      fields: [project_members.projectId],
      references: [project.id],
    }),
  }),
);

export const projectInviteRelations = relations(project_invite, ({ one }) => ({
  inviter: one(user, {
    fields: [project_invite.inviterUserId],
    references: [user.id],
  }),

  project: one(project, {
    fields: [project_invite.projectId],
    references: [project.id],
  }),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}));

// Types Inferred from tables
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type SeoAnalysis = typeof seo_analysis.$inferSelect;
export type NewSeoAnalysis = typeof seo_analysis.$inferInsert;

export type ProjectMember = typeof project_members.$inferSelect;
export type NewProjectMember = typeof project_members.$inferInsert;

export type ProjectInvite = typeof project_invite.$inferSelect;
export type NewProjectInvite = typeof project_invite.$inferInsert;

export type Subscription = typeof subscription.$inferSelect;
export type NewSubscription = typeof subscription.$inferInsert;
