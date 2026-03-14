import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { db } from "@/db";
import { subscription } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const code = request.nextUrl.searchParams.get("code")?.trim() ?? "";
    if (!code) {
      return NextResponse.json(
        { status: false, message: "Missing subscription code" },
        { status: 400 },
      );
    }

    const rows = await db
      .select({ id: subscription.id })
      .from(subscription)
      .where(and(eq(subscription.userId, userId), eq(subscription.subscriptionCode, code)))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json(
        { status: false, message: "Subscription not found" },
        { status: 404 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { status: false, message: "PAYSTACK_SECRET_KEY is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.paystack.co/subscription/${encodeURIComponent(code)}/manage/link`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { status: false, message: "Unable to create manage link" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Paystack manage-link error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to create manage link" },
      { status: 500 },
    );
  }
}

