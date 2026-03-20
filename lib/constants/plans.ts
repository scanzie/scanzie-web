// Plan identifiers
export const PLAN_FREE = "free" as const;
export const PLAN_PRO = "PRO" as const;
export const PLAN_BUSINESS = "BUSINESS" as const;

export type PlanType = typeof PLAN_FREE | typeof PLAN_PRO | typeof PLAN_BUSINESS;

// Plan limits configuration
export const PLAN_LIMITS = {
  [PLAN_FREE]: {
    maxProjects: 1,
    maxAnalyses: 3,
    maxInvitesPerProject: 0,
    advancedAnalysis: false,
    miniWindow: false,
    pdfDownload: false,
    canInvite: false,
    suggestedFixes: false,
    pageScreenshot: false,
    imageAnalysis: false,
  },
  [PLAN_PRO]: {
    maxProjects: 10,
    maxAnalyses: 100,
    maxInvitesPerProject: 10,
    advancedAnalysis: true,
    miniWindow: true,
    pdfDownload: true,
    canInvite: true,
    suggestedFixes: true,
    pageScreenshot: true,
    imageAnalysis: false,
  },
  [PLAN_BUSINESS]: {
    maxProjects: 50,
    maxAnalyses: 500,
    maxInvitesPerProject: 50,
    advancedAnalysis: true,
    miniWindow: true,
    pdfDownload: true,
    canInvite: true,
    suggestedFixes: true,
    pageScreenshot: true,
    imageAnalysis: true,
  },
} as const;

export type PlanLimits = (typeof PLAN_LIMITS)[PlanType];

// Helper to resolve the plan from subscription status
export const resolvePlan = (
  subscriptionPlan?: string | null,
  subscriptionStatus?: string | null,
): PlanType => {
  if (!subscriptionPlan || subscriptionStatus !== "active") {
    return PLAN_FREE;
  }

  const normalised = subscriptionPlan.toUpperCase();

  if (normalised === PLAN_BUSINESS) return PLAN_BUSINESS;
  if (normalised === PLAN_PRO) return PLAN_PRO;

  return PLAN_FREE;
};

// Get limits for a given plan
export const getPlanLimits = (plan: PlanType): PlanLimits => {
  return PLAN_LIMITS[plan];
};

// User-friendly plan labels
export const PLAN_LABELS: Record<PlanType, string> = {
  [PLAN_FREE]: "Free",
  [PLAN_PRO]: "Pro",
  [PLAN_BUSINESS]: "Business",
};


export const freePlanFeatures = [
  "Base-line SEO analysis",
  "Access to one folder/projects",
  "Can create up to 3 analyses.",
  "Can re-analyze URLS.",
];

export const proPlanFeatures = [
  "Everything in Free",
  "Suggested fixes for Technical, Content & On-Page analysis",
  "Page screenshots/snapshots from URL",
  "Up to 10 folders/projects",
  "Up to 100 unique analyses",
  "Invite up to 10 people per project",
  "Mini-window for page navigation",
  "Download analysis as PDF",
];

export const businessPlanFeatures = [
  "Everything in Pro",
  "Image content analysis: performance, size & suggestions",
  "Per-image feedback (too large, blurry, missing alt, etc.)",
  "Up to 50 projects",
  "Up to 500 unique analyses",
  "Invite up to 50 people per project",
];
