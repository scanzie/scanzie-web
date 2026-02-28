import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, plan } = await req.json();

  const planCode =
    plan === "monthly" ?
      process.env.PAYSTACK_MONTHLY_PLAN
    : process.env.PAYSTACK_YEARLY_PLAN;

  // Build callback URL with reference parameter
  const callbackUrl = new URL(
    "/subscribe/callback",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  );

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
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
    },
  );

  const data = await response.json();

  return NextResponse.json(data);
}
