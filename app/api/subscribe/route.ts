import { PAYSTACK_INITIALIZE_TRANSACTION_URL } from "@/lib/constants/payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, plan, period } = await req.json();

  const planCode =
    plan === "pro" ?
      period == "monthly" ?
        process.env.PAYSTACK_MONTHLY_PLAN
      : process.env.PAYSTACK_YEARLY_PLAN
    : period == "monthly" ? process.env.PAYSTACK_BUSINESS_MONTHLY_PLAN
    : process.env.PAYSTACK_BUSINESS_YEARLY_PLAN;

  // Build callback URL with reference parameter
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
      amount: plan === "monthly" ? 100 * 100 : 1200 * 100, // Amount in kobo
      plan: planCode,
      callback_url: callbackUrl.toString(),
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
