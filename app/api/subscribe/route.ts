import {
  PAYMENT_CHANNELS,
  PAYSTACK_INITIALIZE_TRANSACTION_URL,
  SCANZIE_BUSINESS_MONTHLY,
  SCANZIE_BUSINESS_YEARLY,
  SCANZIE_PRO_MONTHLY,
  SCANZIE_PRO_YEARLY,
} from "@/lib/constants/payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, plan, period } = await req.json();

  let planCode: string | undefined;
  let subscriptionAmount: number;

  if (plan === "pro") {
    if (period === "monthly") {
      planCode = process.env.PAYSTACK_PRO_MONTHLY_PLAN;
      subscriptionAmount = SCANZIE_PRO_MONTHLY;
    } else {
      planCode = process.env.PAYSTACK_PRO_YEARLY_PLAN;
      subscriptionAmount = SCANZIE_PRO_YEARLY;
    }
  } else {
    if (period === "monthly") {
      planCode = process.env.PAYSTACK_BUSINESS_MONTHLY_PLAN;
      subscriptionAmount = SCANZIE_BUSINESS_MONTHLY;
    } else {
      planCode = process.env.PAYSTACK_BUSINESS_YEARLY_PLAN;
      subscriptionAmount = SCANZIE_BUSINESS_YEARLY;
    }
  }

  const callbackUrl = new URL(
    "/subscribe/callback",
    process.env.NEXT_PUBLIC_BASE_URL!,
  );

  const response = await fetch(PAYSTACK_INITIALIZE_TRANSACTION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: subscriptionAmount,
      plan: planCode,
      callback_url: callbackUrl.toString(),
      channels: PAYMENT_CHANNELS
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
