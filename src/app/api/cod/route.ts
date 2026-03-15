import { NextRequest, NextResponse } from "next/server";
import {
  sendCodConfirmation,
  sendNewOrderArtistNotification,
} from "@/lib/email";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, shippingAddress } = body;

    if (!items?.length || !email || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (shippingAddress.country !== "Pakistan") {
      return NextResponse.json(
        { error: "Cash on Delivery is only available for deliveries within Pakistan." },
        { status: 400 }
      );
    }

    // Validate all items are still available
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

    const orderId = `COD_${Date.now()}`;

    // Mark all ordered artworks as "reserved"
    for (const item of items) {
      if (item.artworkId) {
        try {
          await sanityClient
            .patch(item.artworkId)
            .set({ status: "reserved" })
            .commit();
        } catch (err) {
          console.error(`Failed to reserve ${item.artworkId}:`, err);
        }
      }
    }

    if (process.env.RESEND_API_KEY) {
      await sendCodConfirmation({
        customerEmail: email,
        customerName: shippingAddress.fullName || "Customer",
        orderId,
        items: items.map((i: { title: string; price: number }) => ({
          title: i.title,
          price: i.price,
        })),
        total: totalAmount,
        shippingAddress,
      });

      await sendNewOrderArtistNotification({
        customerEmail: email,
        customerName: shippingAddress.fullName || "Customer",
        orderId,
        items: items.map((i: { title: string; price: number }) => ({
          title: i.title,
          price: i.price,
        })),
        total: totalAmount,
        paymentMethod: "Cash on Delivery",
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order placed! You will pay when your artwork is delivered.",
    });
  } catch (error) {
    console.error("COD order error:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
