import { NextRequest, NextResponse } from "next/server";
import { releaseExpiredReservations } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await releaseExpiredReservations();
    return NextResponse.json({ message: "Expired reservations released." });
  } catch (error) {
    console.error("Cron release-expired error:", error);
    return NextResponse.json(
      { error: "Failed to process expired reservations" },
      { status: 500 }
    );
  }
}
