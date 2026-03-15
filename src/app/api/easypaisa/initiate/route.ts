import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { createEasypaisaPayment } = await import("@/lib/easypaisa");

    const body = await request.json();
    const { items, email, phone, shippingAddress } = body;

    if (!items || !items.length || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields (items, email, phone)" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const orderRefNum = `EP_${Date.now()}`;

    const formData = createEasypaisaPayment({
      amount: totalAmount,
      orderRefNum,
      emailAddr: email,
      mobileNum: phone.replace(/\s+/g, ""),
      postBackURL: `${siteUrl}/api/easypaisa/callback`,
    });

    return NextResponse.json({
      url: formData.url,
      params: formData.params,
      orderRefNum,
    });
  } catch (error) {
    console.error("EasyPaisa initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate EasyPaisa payment" },
      { status: 500 }
    );
  }
}
