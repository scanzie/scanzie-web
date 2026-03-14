import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
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
      `https://api.paystack.co/customer/${encodeURIComponent(email)}`,
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
        data ?? { status: false, message: "Customer not retrieved" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Paystack customer lookup error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to retrieve customer" },
      { status: 500 },
    );
  }
}

