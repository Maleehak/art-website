import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { getStripe, formatAmountForStripe } = await import("@/lib/stripe");

  try {
    const body = await request.json();
    const { items, email, shippingAddress } = body;

    if (!items || !items.length || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lineItems = items.map(
      (item: { title: string; price: number; quantity: number }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: "Original Painting",
          },
          unit_amount: formatAmountForStripe(item.price),
        },
        quantity: item.quantity,
      })
    );

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: email,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
      ],
      metadata: {
        artworkIds: items
          .map((i: { artworkId: string }) => i.artworkId)
          .join(","),
        shippingAddress: JSON.stringify(shippingAddress),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
