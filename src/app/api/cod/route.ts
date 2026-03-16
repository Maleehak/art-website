import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  sendCodConfirmation,
  sendNewOrderArtistNotification,
} from "@/lib/email";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

interface ValidatedItem {
  artworkId: string;
  title: string;
  price: number;
  quantity: number;
}

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

    const hasSaleItem = items.some((item: { isSale?: boolean }) => item.isSale);
    if (hasSaleItem) {
      return NextResponse.json(
        { error: "Cash on Delivery is not available for flash sale items. Please use bank transfer instead." },
        { status: 400 }
      );
    }

    const validatedItems: ValidatedItem[] = [];

    for (const item of items) {
      if (item.artworkId) {
        const artwork = await sanityClient.fetch(
          `*[_type == "artwork" && _id == $id][0]{_rev, status, title, price}`,
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

        // Atomically reserve: only succeeds if no one else modified this document
        try {
          await sanityClient
            .patch(item.artworkId)
            .ifRevisionId(artwork._rev)
            .set({ status: "reserved", reservedAt: new Date().toISOString() })
            .commit();
        } catch {
          return NextResponse.json(
            {
              error: `"${artwork.title}" was just purchased by another customer. Please remove it from your cart.`,
            },
            { status: 409 }
          );
        }

        validatedItems.push({
          artworkId: item.artworkId,
          title: artwork.title,
          price: artwork.price,
          quantity: item.quantity || 1,
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/collections");
    for (const item of validatedItems) {
      revalidatePath(`/artwork/${item.artworkId}`);
    }

    const totalAmount = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderId = `COD_${Date.now()}`;

    if (process.env.RESEND_API_KEY) {
      await sendCodConfirmation({
        customerEmail: email,
        customerName: shippingAddress.fullName || "Customer",
        orderId,
        items: validatedItems.map((i) => ({
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
        items: validatedItems.map((i) => ({
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
