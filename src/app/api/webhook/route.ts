import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { getStripe } = await import("@/lib/stripe");
  const Stripe = (await import("stripe")).default;

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: import("stripe").Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Payment successful for session:", session.id);

      // 1. Create order in Supabase
      // const { artworkIds, shippingAddress } = session.metadata || {};
      // await createOrder({ ... });

      // 2. Update artwork status to "sold" in Sanity
      // const ids = session.metadata?.artworkIds?.split(",") || [];
      // for (const id of ids) { await updateArtworkStatus(id, "sold"); }

      // 3. Send confirmation email via Resend
      // await sendOrderConfirmation(session.customer_email, session.id);

      break;
    }

    case "payment_intent.payment_failed": {
      console.error("Payment failed:", event.data.object.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
