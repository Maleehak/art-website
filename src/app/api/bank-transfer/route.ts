import { NextRequest, NextResponse } from "next/server";
import { sendBankTransferInstructions } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, shippingAddress } = body;

    if (!items?.length || !email) {
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

    const orderId = `BT_${Date.now()}`;

    if (process.env.RESEND_API_KEY) {
      const result = await sendBankTransferInstructions({
        customerEmail: email,
        customerName: shippingAddress?.fullName || "Customer",
        orderId,
        total: totalAmount,
      });

      if (result.error) {
        console.error("Email send failed:", result.error);
      } else {
        console.log("Bank transfer email sent to:", email);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      message:
        "Bank transfer details have been sent to your email. Please complete the transfer within 48 hours.",
    });
  } catch (error) {
    console.error("Bank transfer error:", error);
    return NextResponse.json(
      { error: "Failed to process bank transfer request" },
      { status: 500 }
    );
  }
}
