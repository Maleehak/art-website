import type { Metadata } from "next";
import { getArtwork } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { ArtworkDetail } from "./ArtworkDetail";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtwork(slug);
  return {
    title: artwork?.title || "Artwork",
    description: artwork?.description || "View artwork details.",
    openGraph: {
      title: artwork?.title,
      description: artwork?.description,
      type: "article",
    },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const artwork = await getArtwork(slug);

  if (!artwork) {
    notFound();
  }

  return <ArtworkDetail artwork={artwork} />;
}
