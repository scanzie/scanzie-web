// Logic that get fired when checkout process has finished
// whether successful or not
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CREATE_SUBSCRIPTION, PAYMENT_FAILED } from "@/lib/constants/payment";
import { getUserByEmail } from "@/lib/actions/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event } = body;

    if (event === CREATE_SUBSCRIPTION) {
      // Extract customer data from webhook body
      const {
        data: {
          customer: { email },
          plan,
          subscription_code,
          status,
          next_payment_date,
        },
      } = body;

      const subscriptionStatus = status || "active";
      const planName = plan?.name || "pro";
      const subscriptionCode = subscription_code;
      const nextPaymentDate =
        next_payment_date ?
          new Date(next_payment_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Find existing user
      const existingUser = await getUserByEmail(email);

      if (!existingUser) {
        console.error(`User not found for email: ${email}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userId = existingUser.id;

      // Check if subscription already exists
      const existingSubscription = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, userId))
        .limit(1);

      if (existingSubscription && existingSubscription.length > 0) {
        // Update existing subscription
        await db
          .update(subscription)
          .set({
            plan: planName,
            status: subscriptionStatus,
            subscriptionCode,
            nextPaymentDate,
            updatedAt: new Date(),
          })
          .where(eq(subscription.userId, userId));

        console.log(`Updated subscription for user: ${userId}`);
      } else {
        // Create new subscription
        await db.insert(subscription).values({
          userId,
          plan: planName,
          status: subscriptionStatus,
          subscriptionCode,
          nextPaymentDate,
        });

        console.log(`Created subscription for user: ${userId}`);
      }
    }

    if (event === PAYMENT_FAILED) {
      const {
        data: {
          subscription: { subscription_code },
        },
      } = body;

      if (subscription_code) {
        // Change the subscription status of a failed
        // payment to inactive.
        await db
          .update(subscription)
          .set({
            status: "inactive",
            updatedAt: new Date(),
          })
          .where(eq(subscription.subscriptionCode, subscription_code));

        console.log(`Marked subscription as inactive: ${subscription_code}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
