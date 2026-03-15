import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { verifyWebhookSignature } = await import("@/lib/xpay");

  const body = await request.text();
  const signature = request.headers.get("xpay-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing xpay-signature header" },
      { status: 400 }
    );
  }

  try {
    const isValid = verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  const event = JSON.parse(body) as {
    eventId: string;
    eventType: string;
    eventTime: number;
    intentId: string;
    receiptId?: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    customerDetails?: {
      name: string;
      email: string;
      contactNumber?: string;
    };
    errorCode?: string;
    metadata?: Record<string, string>;
  };

  switch (event.eventType) {
    case "intent.success": {
      console.log("Payment successful:", event.intentId);

      // TODO: 1. Create order in Supabase
      // const { artworkIds, shippingAddress } = event.metadata || {};
      // await createOrder({ ... });

      // TODO: 2. Update artwork status to "sold" in Sanity
      // const ids = event.metadata?.artworkIds?.split(",") || [];
      // for (const id of ids) { await updateArtworkStatus(id, "sold"); }

      // TODO: 3. Send confirmation email via Resend
      // await sendOrderConfirmation(event.customerDetails?.email, event.intentId);

      break;
    }

    case "intent.failed": {
      console.error(
        "Payment failed:",
        event.intentId,
        "Error:",
        event.errorCode
      );
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.eventType}`);
  }

  return NextResponse.json({ received: true });
}
