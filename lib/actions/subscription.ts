// scanzie/scanzie-web/lib/actions/subscription.ts
"use server";

import { db } from "@/db";
import { subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PAYSTACK_VERIFY_TRANSACTION_URL } from "../constants/payment";

type SubscriptionPlan = "free" | "pro" | "enterprise";
type SubscriptionStatus = "active" | "canceled" | "past_due";

type UpdateSubscriptionParams = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  subscriptionCode: string;
  nextPaymentDate: Date;
  updatedAt: Date;
};

export type UpsertSubscriptionParams = {
  userId: string;
  plan: SubscriptionPlan | string;
  status: SubscriptionStatus | string;
  subscriptionCode: string;
  nextPaymentDate: Date;
  updatedAt?: Date;
};

const normalizePlan = (plan: string): SubscriptionPlan => {
  const value = plan.trim().toLowerCase();

  if (value === "free") return "free";
  if (value === "pro") return "pro";
  if (value === "enterprise") return "enterprise";

  // Legacy/back-compat mappings
  if (value === "business") return "enterprise";

  return "pro";
};

const normalizeStatus = (status: string): SubscriptionStatus => {
  const value = status.trim().toLowerCase();

  if (value === "active") return "active";
  if (value === "canceled" || value === "cancelled") return "canceled";
  if (value === "past_due" || value === "past-due") return "past_due";

  // Legacy/back-compat mappings
  if (value === "inactive") return "canceled";

  return "active";
};

export async function getSubscriptionStatus(userId: string): Promise<{
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  nextPaymentDate: Date | null;
} | null> {
  try {
    const userSubscription = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    if (!userSubscription || userSubscription.length === 0) {
      return null;
    }

    return {
      status: userSubscription[0].status,
      plan: userSubscription[0].plan,
      nextPaymentDate: userSubscription[0].nextPaymentDate,
    };
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    throw new Error("Failed to fetch subscription status");
  }
}

export async function verifyPaystackTransaction(reference: string) {
  try {
    const response = await fetch(
      `${PAYSTACK_VERIFY_TRANSACTION_URL}/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error);
    throw new Error("Failed to verify transaction");
  }
}

export const getSubscriptionByUserId = async (userId: string) => {
  try {
    const userSubscription = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);
    return userSubscription;
  } catch (err) {
    console.error("Unable to get user subscription: ", err);
    throw err;
  }
};

/**
 * Atomic write path for subscription create/update by user.
 * Requires a unique constraint on subscription.userId.
 */
export const upsertUserSubscription = async (
  params: UpsertSubscriptionParams,
) => {
  const updatedAt = params.updatedAt ?? new Date();
  const normalizedPlan = normalizePlan(params.plan);
  const normalizedStatus = normalizeStatus(params.status);

  try {
    const rows = await db
      .insert(subscription)
      .values({
        userId: params.userId,
        plan: normalizedPlan,
        status: normalizedStatus,
        subscriptionCode: params.subscriptionCode,
        nextPaymentDate: params.nextPaymentDate,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: subscription.userId,
        set: {
          plan: normalizedPlan,
          status: normalizedStatus,
          subscriptionCode: params.subscriptionCode,
          nextPaymentDate: params.nextPaymentDate,
          updatedAt,
        },
      })
      .returning();

    return rows[0] ?? null;
  } catch (err) {
    console.error("Failed to upsert user subscription: ", err);
    throw err;
  }
};

export const createUserSubscription = async (
  userId: string,
  planName: string,
  status: string,
  subscriptionCode: string,
  nextPaymentDate: Date,
) => {
  const normalizedPlan = normalizePlan(planName);
  const normalizedStatus = normalizeStatus(status);

  try {
    const rows = await db
      .insert(subscription)
      .values({
        userId,
        plan: normalizedPlan,
        status: normalizedStatus,
        subscriptionCode,
        nextPaymentDate,
      })
      .returning();

    return rows[0] ?? null;
  } catch (err) {
    console.error("Unable to create user subscription: ", err);
    throw err;
  }
};

export const updateUserSubscription = async (
  params: UpdateSubscriptionParams,
  userId: string,
) => {
  try {
    const rows = await db
      .update(subscription)
      .set({
        ...params,
        plan: normalizePlan(params.plan),
        status: normalizeStatus(params.status),
      })
      .where(eq(subscription.userId, userId))
      .returning();

    return rows[0] ?? null;
  } catch (err) {
    console.error("Failed to update user subscription: ", err);
    throw err;
  }
};

export const setSubscriptionToInactive = async (subscriptionCode: string) => {
  try {
    const rows = await db
      .update(subscription)
      .set({
        // "inactive" is no longer a valid enum value; map to canceled.
        status: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(subscription.subscriptionCode, subscriptionCode))
      .returning();

    return rows[0] ?? null;
  } catch (err) {
    console.error(
      `Failed to set subscription status of code: ${subscriptionCode} to inactive. Error: ${err}`,
    );
    throw err;
  }
};
