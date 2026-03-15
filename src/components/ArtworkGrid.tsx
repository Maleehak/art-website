"use client";

import type { Artwork } from "@/types";
import { ArtworkCard } from "./ArtworkCard";

interface ArtworkGridProps {
  artworks: Artwork[];
  columns?: 2 | 3 | 4;
}

export function ArtworkGrid({ artworks, columns = 3 }: ArtworkGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (artworks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gallery-gray text-lg">
          No artworks in this collection yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-8`}>
      {artworks.map((artwork, index) => (
        <ArtworkCard key={artwork._id} artwork={artwork} index={index} />
      ))}
    </div>
  );
}
