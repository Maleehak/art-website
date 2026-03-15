import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { isPaymentSuccessful } = await import("@/lib/easypaisa");

    const formData = await request.formData();

    const callbackData = {
      orderRefNumber: formData.get("orderRefNumber") as string | null,
      responseCode: formData.get("responseCode") as string | null,
      responseDesc: formData.get("responseDesc") as string | null,
      paymentToken: formData.get("paymentToken") as string | null,
      transactionId: formData.get("transactionId") as string | null,
      transactionDateTime: formData.get("transactionDateTime") as string | null,
      msisdn: formData.get("msisdn") as string | null,
      status: formData.get("status") as string | null,
    };

    console.log("EasyPaisa callback received:", callbackData);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (
      callbackData.responseCode &&
      isPaymentSuccessful(callbackData.responseCode)
    ) {
      console.log(
        "EasyPaisa payment successful:",
        callbackData.orderRefNumber
      );

      // TODO: 1. Create order in Supabase
      // TODO: 2. Update artwork status to "sold" in Sanity
      // TODO: 3. Send confirmation email via Resend

      return NextResponse.redirect(
        `${siteUrl}/checkout/success?provider=easypaisa&ref=${callbackData.orderRefNumber}`,
        { status: 303 }
      );
    } else {
      console.error(
        "EasyPaisa payment failed:",
        callbackData.responseCode,
        callbackData.responseDesc
      );

      return NextResponse.redirect(
        `${siteUrl}/checkout/success?provider=easypaisa&status=failed&ref=${callbackData.orderRefNumber}`,
        { status: 303 }
      );
    }
  } catch (error) {
    console.error("EasyPaisa callback error:", error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${siteUrl}/checkout/success?status=failed`, {
      status: 303,
    });
  }
}
