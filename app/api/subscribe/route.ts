import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, plan } = await req.json();

  const planCode =
    plan === "monthly" ?
      process.env.PAYSTACK_MONTHLY_PLAN
    : process.env.PAYSTACK_YEARLY_PLAN;

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
        amount: plan === "monthly" ? 10000 : 10000, // Amount in kobo (1000 = ₦10.00)
        plan: planCode,
      }),
    },
  );

  const data = await response.json();

  return NextResponse.json(data);
}
