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

      if (process.env.RESEND_API_KEY && event.customerDetails?.email) {
        try {
          const { sendOrderConfirmation } = await import("@/lib/email");
          const artworkTitles = event.metadata?.artworkIds?.split(",") || [];
          await sendOrderConfirmation({
            customerEmail: event.customerDetails.email,
            customerName: event.customerDetails.name || "Customer",
            orderId: event.receiptId || event.intentId,
            items: artworkTitles.map((id) => ({
              title: id,
              price: event.amount / 100 / artworkTitles.length,
            })),
            total: event.amount / 100,
          });
          console.log("Order confirmation email sent to", event.customerDetails.email);
        } catch (emailErr) {
          console.error("Failed to send order confirmation email:", emailErr);
        }
      }

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
