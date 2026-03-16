import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

const FLASH_SALE_DEADLINE_MS = 5 * 60 * 1000; // 5 minutes
const REGULAR_DEADLINE_MS = 48 * 60 * 60 * 1000; // 48 hours

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reserved = await sanityClient.fetch<
      {
        _id: string;
        title: string;
        reservedAt: string | null;
        salePrice: number | null;
        saleStart: string | null;
        saleDurationHours: number | null;
      }[]
    >(
      `*[_type == "artwork" && status == "reserved"]{
        _id, title, reservedAt, salePrice, saleStart, saleDurationHours
      }`
    );

    const now = Date.now();
    const released: string[] = [];

    for (const artwork of reserved) {
      if (!artwork.reservedAt) continue;

      const reservedTime = new Date(artwork.reservedAt).getTime();

      const isFlashSale =
        artwork.salePrice &&
        artwork.saleStart &&
        artwork.saleDurationHours;

      const deadline = isFlashSale
        ? FLASH_SALE_DEADLINE_MS
        : REGULAR_DEADLINE_MS;

      if (now - reservedTime > deadline) {
        await sanityClient
          .patch(artwork._id)
          .set({ status: "available" })
          .unset(["reservedAt"])
          .commit();

        released.push(artwork.title);
      }
    }

    if (released.length > 0) {
      revalidatePath("/");
      revalidatePath("/collections");
    }

    return NextResponse.json({
      released,
      checked: reserved.length,
      message: `Released ${released.length} expired reservation(s).`,
    });
  } catch (error) {
    console.error("Cron release-expired error:", error);
    return NextResponse.json(
      { error: "Failed to process expired reservations" },
      { status: 500 }
    );
  }
}
