"use server";

import { db } from "@/db";
import { subscription, user } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export async function getUserByEmail(email: string) {
  try {
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser || foundUser.length === 0) {
      return null;
    }

    return foundUser[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function verifyPaystackTransaction(reference: string) {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
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
