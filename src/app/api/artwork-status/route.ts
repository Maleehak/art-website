import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient, releaseExpiredReservations } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await releaseExpiredReservations();

  const artwork = await sanityWriteClient.fetch(
    `*[_type == "artwork" && _id == $id][0]{ status }`,
    { id }
  );

  if (!artwork) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    { status: artwork.status },
    { headers: { "Cache-Control": "no-store" } }
  );
}
