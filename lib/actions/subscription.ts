"use server";

import { db } from "@/db";
import { subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PAYSTACK_VERIFY_TRANSACTION_URL } from "../constants/payment";

export async function getSubscriptionStatus(userId: string): Promise<{
  status: string;
  plan: string;
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
  }
};
export const createUserSubscription = async (
  userId: string,
  planName: string,
  status: string,
  subscriptionCode: string,
  nextPaymentDate: Date,
) => {
  try {
    await db.insert(subscription).values({
      userId,
      plan: planName,
      status,
      subscriptionCode,
      nextPaymentDate,
    });
  } catch (err) {
    console.error("Unable to create user subscription: ", err);
  }
};
