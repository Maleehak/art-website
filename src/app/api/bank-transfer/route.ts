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

    interface ValidatedItem {
      artworkId: string;
      title: string;
      price: number;
      quantity: number;
      isSale: boolean;
    }
    const validatedItems: ValidatedItem[] = [];

    for (const item of items) {
      if (item.artworkId) {
        const artwork = await sanityClient.fetch(
          `*[_type == "artwork" && _id == $id][0]{status, title, price, salePrice, saleStart, saleDurationHours}`,
          { id: item.artworkId }
        );
        if (!artwork) {
          return NextResponse.json(
            { error: `Artwork not found: "${item.title}".` },
            { status: 400 }
          );
        }
        if (artwork.status !== "available") {
          return NextResponse.json(
            {
              error: `"${artwork.title}" is no longer available (${artwork.status}). Please remove it from your cart.`,
            },
            { status: 400 }
          );
        }

        let serverPrice = artwork.price;
        let isSale = false;

        if (
          artwork.salePrice &&
          artwork.saleStart &&
          artwork.saleDurationHours
        ) {
          const saleEnd =
            new Date(artwork.saleStart).getTime() +
            artwork.saleDurationHours * 3600000;
          if (Date.now() < saleEnd) {
            serverPrice = artwork.salePrice;
            isSale = true;
          } else if (item.isSale) {
            return NextResponse.json(
              {
                error: `The flash sale for "${artwork.title}" has ended. Please refresh the page for the current price.`,
              },
              { status: 400 }
            );
          }
        }

        validatedItems.push({
          artworkId: item.artworkId,
          title: artwork.title,
          price: serverPrice,
          quantity: item.quantity || 1,
          isSale,
        });
      }
    }

    const totalAmount = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderId = `BT_${Date.now()}`;

    for (const item of validatedItems) {
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

    const hasFlashSaleItem = validatedItems.some((i) => i.isSale);

    if (process.env.RESEND_API_KEY) {
      const result = await sendBankTransferInstructions({
        customerEmail: email,
        customerName: shippingAddress?.fullName || "Customer",
        orderId,
        total: totalAmount,
        isFlashSale: hasFlashSaleItem,
      });

      if (result.error) {
        console.error("Customer email failed:", result.error);
      } else {
        console.log("Bank transfer email sent to:", email);
      }

      await sendNewOrderArtistNotification({
        customerEmail: email,
        customerName: shippingAddress?.fullName || "Customer",
        orderId,
        items: validatedItems.map((i) => ({
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
