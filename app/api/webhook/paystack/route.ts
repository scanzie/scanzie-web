import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, subscription } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const event = body.event;

    if (event === "subscription.create") {
      const data = body.data;

      // Extract customer email from the webhook data
      const customerEmail = data.customer?.email;
      const planName = data.plan?.name || "pro"; // Plan name from Paystack
      const subscriptionCode = data.subscription_code;
      const status = data.status || "active";
      const nextPaymentDate =
        data.next_payment_date ?
          new Date(data.next_payment_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      // Find user by email
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, customerEmail))
        .limit(1);

      if (!existingUser || existingUser.length === 0) {
        console.error(`User not found for email: ${customerEmail}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userId = existingUser[0].id;

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
            status: status,
            subscriptionCode: subscriptionCode,
            nextPaymentDate: nextPaymentDate,
            updatedAt: new Date(),
          })
          .where(eq(subscription.userId, userId));

        console.log(`Updated subscription for user: ${userId}`);
      } else {
        // Create new subscription
        await db.insert(subscription).values({
          userId: userId,
          plan: planName,
          status: status,
          subscriptionCode: subscriptionCode,
          nextPaymentDate: nextPaymentDate,
        });

        console.log(`Created subscription for user: ${userId}`);
      }
    }

    if (event === "invoice.payment_failed") {
      // Mark subscription as inactive/past_due
      const data = body.data;
      const subscriptionCode = data.subscription?.subscription_code;

      if (subscriptionCode) {
        await db
          .update(subscription)
          .set({
            status: "inactive",
            updatedAt: new Date(),
          })
          .where(eq(subscription.subscriptionCode, subscriptionCode));

        console.log(`Marked subscription as inactive: ${subscriptionCode}`);
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
