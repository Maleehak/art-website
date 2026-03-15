import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const intentId = request.nextUrl.searchParams.get("xpay_intent_id");

  if (!intentId) {
    return NextResponse.json(
      { error: "Missing xpay_intent_id" },
      { status: 400 }
    );
  }

  try {
    const { getPaymentIntent } = await import("@/lib/xpay");
    const intent = await getPaymentIntent(intentId);

    return NextResponse.json({
      status: intent.status,
      intentId: intentId,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({
      status: "UNKNOWN",
      intentId: intentId,
    });
  }
}
