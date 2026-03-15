import { NextRequest, NextResponse } from "next/server";
import {
  sendBankTransferInstructions,
  sendNewOrderArtistNotification,
} from "@/lib/email";
import { sanityClient } from "@/lib/sanity";

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

    // Validate all items are still available before processing
    for (const item of items) {
      if (item.artworkId) {
        const artwork = await sanityClient.fetch(
          `*[_type == "artwork" && _id == $id][0]{status, title}`,
          { id: item.artworkId }
        );
        if (artwork && artwork.status !== "available") {
          return NextResponse.json(
            {
              error: `"${artwork.title || item.title}" is no longer available (${artwork.status}). Please remove it from your cart.`,
            },
            { status: 400 }
          );
        }
      }
    }

    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const orderId = `BT_${Date.now()}`;

    // Mark all ordered artworks as "reserved" in Sanity
    for (const item of items) {
      if (item.artworkId) {
        try {
          await sanityClient
            .patch(item.artworkId)
            .set({ status: "reserved" })
            .commit();
          console.log(`Reserved artwork: ${item.title} (${item.artworkId})`);
        } catch (err) {
          console.error(`Failed to reserve ${item.artworkId}:`, err);
        }
      }
    }

    if (process.env.RESEND_API_KEY) {
      // Send bank details to customer
      const result = await sendBankTransferInstructions({
        customerEmail: email,
        customerName: shippingAddress?.fullName || "Customer",
        orderId,
        total: totalAmount,
      });

      if (result.error) {
        console.error("Customer email failed:", result.error);
      } else {
        console.log("Bank transfer email sent to:", email);
      }

      // Notify artist about the new order
      await sendNewOrderArtistNotification({
        customerEmail: email,
        customerName: shippingAddress?.fullName || "Customer",
        orderId,
        items: items.map((i: { title: string; price: number }) => ({
          title: i.title,
          price: i.price,
        })),
        total: totalAmount,
        paymentMethod: "Bank Transfer",
      });
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
