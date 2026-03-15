import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const {
    createPaymentIntent,
    formatAmountForXPay,
    getCountryCode,
  } = await import("@/lib/xpay");

  try {
    const body = await request.json();
    const { items, email, shippingAddress } = body;

    if (!items || !items.length || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const description = items
      .map((item: { title: string }) => item.title)
      .join(", ");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const intent = await createPaymentIntent({
      amount: formatAmountForXPay(totalAmount),
      currency: "USD",
      callbackUrl: `${siteUrl}/checkout/success`,
      cancelUrl: `${siteUrl}/cart`,
      receiptId: `order_${Date.now()}`,
      description: `Art Purchase: ${description}`,
      customerDetails: {
        name: shippingAddress?.fullName || "Customer",
        email,
        contactNumber: shippingAddress?.phone,
        customerAddress: {
          line1: shippingAddress?.addressLine1,
          line2: shippingAddress?.addressLine2,
          city: shippingAddress?.city,
          state: shippingAddress?.state,
          country: getCountryCode(shippingAddress?.country || "Pakistan"),
          postalCode: shippingAddress?.postalCode,
        },
      },
      paymentMethods: ["CARD", "GOOGLE_PAY"],
      metadata: {
        artworkIds: items
          .map((i: { artworkId: string }) => i.artworkId)
          .join(","),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    return NextResponse.json({
      url: intent.fwdUrl,
      intentId: intent.xIntentId,
    });
  } catch (error) {
    console.error("XPay checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
