// Logic that get fired when checkout process has finished -
// whether successful or not
import { NextRequest, NextResponse } from "next/server";
import { CREATE_SUBSCRIPTION, PAYMENT_FAILED, PAYMENT_SUCCESS } from "@/lib/constants/payment";
import { getUserByEmail } from "@/lib/actions/profile";
import {
  createUserSubscription,
  getSubscriptionByUserId,
  setSubscriptionToInactive,
  updateUserSubscription,
} from "@/lib/actions/subscription";
import { notifyAnalyzerApi } from "@/lib/internal/notifications";
import { db } from "@/db";
import { subscription } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event } = body;

    const getManageLink = async (subscriptionCode: string) => {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) return null;
      try {
        const res = await fetch(
          `https://api.paystack.co/subscription/${encodeURIComponent(subscriptionCode)}/manage/link`,
          {
            headers: { Authorization: `Bearer ${secret}` },
            cache: "no-store",
          },
        );
        const data = await res.json().catch(() => null);
        const link = data?.data?.link;
        return typeof link === "string" ? link : null;
      } catch {
        return null;
      }
    };

    if (event === CREATE_SUBSCRIPTION) {
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
      const planCode = plan?.plan_code || "";

      // Determine plan name based on plan code
      let planName = "PRO"; // default to PRO
      if (planCode.toLowerCase().includes("business")) {
        planName = "BUSINESS";
      } else if (planCode.toLowerCase().includes("pro")) {
        planName = "PRO";
      }

      const subscriptionCode = subscription_code;
      const nextPaymentDate =
        next_payment_date ?
          new Date(next_payment_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const existingUser = await getUserByEmail(email);

      if (!existingUser) {
        console.error(`User not found for email: ${email}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const { id: userId } = existingUser;

      const existingSubscription = await getSubscriptionByUserId(userId);

      if (existingSubscription && existingSubscription.length > 0) {
        await updateUserSubscription(
          {
            plan: planName,
            status: subscriptionStatus,
            subscriptionCode,
            nextPaymentDate,
            updatedAt: new Date(),
          },
          userId,
        );

        console.log(`Updated subscription for user: ${userId}`);
      } else {
        await createUserSubscription(
          userId,
          planName,
          subscriptionStatus,
          subscriptionCode,
          nextPaymentDate,
        );

        console.log(`Created subscription for user: ${userId}`);
      }

      const manageUrl = await getManageLink(subscriptionCode);
      await notifyAnalyzerApi({
        path: "/subscription/event",
        body: {
          userId,
          event,
          status: subscriptionStatus,
          amount: typeof body?.data?.amount === "number" ? body.data.amount : null,
          nextBillingDate: nextPaymentDate.toISOString(),
          subscriptionCode,
          manageUrl,
        },
      });
    }

    if (event === PAYMENT_FAILED) {
      const {
        data: {
          subscription: { subscription_code },
        },
      } = body;

      if (subscription_code) {
        await setSubscriptionToInactive(subscription_code);

        console.log(`Marked subscription as inactive: ${subscription_code}`);

        const row = await db
          .select({ userId: subscription.userId })
          .from(subscription)
          .where(eq(subscription.subscriptionCode, subscription_code))
          .limit(1)
          .then((rows) => rows[0] ?? null);

        if (row?.userId) {
          const manageUrl = await getManageLink(subscription_code);
          await notifyAnalyzerApi({
            path: "/subscription/event",
            body: {
              userId: row.userId,
              event,
              status: "inactive",
              amount: typeof body?.data?.amount === "number" ? body.data.amount : null,
              nextBillingDate:
                typeof body?.data?.next_payment_date === "string" ? body.data.next_payment_date : null,
              subscriptionCode: subscription_code,
              manageUrl,
            },
          });
        }
      }
    }

    if (event === PAYMENT_SUCCESS) {
      const subscription_code =
        (body?.data?.subscription?.subscription_code as string | undefined) ?? "";

      if (subscription_code) {
        const row = await db
          .select({ userId: subscription.userId })
          .from(subscription)
          .where(eq(subscription.subscriptionCode, subscription_code))
          .limit(1)
          .then((rows) => rows[0] ?? null);

        if (row?.userId) {
          const manageUrl = await getManageLink(subscription_code);
          await notifyAnalyzerApi({
            path: "/subscription/event",
            body: {
              userId: row.userId,
              event,
              status: "active",
              amount: typeof body?.data?.amount === "number" ? body.data.amount : null,
              nextBillingDate:
                typeof body?.data?.next_payment_date === "string" ? body.data.next_payment_date : null,
              subscriptionCode: subscription_code,
              manageUrl,
            },
          });
        }
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
