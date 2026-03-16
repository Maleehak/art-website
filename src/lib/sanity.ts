import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImage, Artwork, Collection, Artist, BlogPost } from "@/types";
import { isArtworkOnSale } from "@/types";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}

const FLASH_SALE_DEADLINE_MS = 5 * 60 * 1000;
const REGULAR_DEADLINE_MS = 48 * 60 * 60 * 1000;

export async function releaseExpiredReservations(): Promise<void> {
  try {
    const reserved = await sanityClient.fetch<
      {
        _id: string;
        reservedAt: string | null;
        salePrice: number | null;
        saleStart: string | null;
        saleDurationHours: number | null;
      }[]
    >(
      `*[_type == "artwork" && status == "reserved"]{
        _id, reservedAt, salePrice, saleStart, saleDurationHours
      }`
    );

    const now = Date.now();

    for (const artwork of reserved) {
      if (!artwork.reservedAt) continue;

      const reservedTime = new Date(artwork.reservedAt).getTime();
      const isFlashSale =
        artwork.salePrice && artwork.saleStart && artwork.saleDurationHours;
      const deadline = isFlashSale ? FLASH_SALE_DEADLINE_MS : REGULAR_DEADLINE_MS;

      if (now - reservedTime > deadline) {
        await sanityClient
          .patch(artwork._id)
          .set({ status: "available" })
          .unset(["reservedAt"])
          .commit();
      }
    }
  } catch (err) {
    console.error("releaseExpiredReservations error:", err);
  }
}

export async function getCollections(): Promise<Collection[]> {
  return sanityClient.fetch(`
    *[_type == "collection"] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      image,
      "artworkCount": count(*[_type == "artwork" && references(^._id)])
    }
  `);
}

export async function getCollection(slug: string): Promise<Collection | null> {
  return sanityClient.fetch(
    `
    *[_type == "collection" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      image,
      "artworkCount": count(*[_type == "artwork" && references(^._id)])
    }
  `,
    { slug }
  );
}

export async function getArtworksByCollection(
  collectionSlug: string
): Promise<Artwork[]> {
  return sanityClient.fetch(
    `
    *[_type == "artwork" && collection->slug.current == $slug] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      medium,
      dimensions,
      year,
      price,
      currency,
      status,
      image,
      images,
      featured,
      salePrice,
      saleStart,
      saleDurationHours,
      collection->{
        _id,
        title,
        "slug": slug.current
      }
    }
  `,
    { slug: collectionSlug }
  );
}

export async function getArtwork(slug: string): Promise<Artwork | null> {
  return sanityClient.fetch(
    `
    *[_type == "artwork" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      medium,
      dimensions,
      year,
      price,
      currency,
      status,
      image,
      images,
      featured,
      salePrice,
      saleStart,
      saleDurationHours,
      collection->{
        _id,
        title,
        "slug": slug.current
      }
    }
  `,
    { slug }
  );
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  await releaseExpiredReservations();
  return sanityClient.fetch(`
    *[_type == "artwork" && featured == true] | order(_createdAt desc)[0...8] {
      _id,
      title,
      "slug": slug.current,
      description,
      medium,
      dimensions,
      year,
      price,
      currency,
      status,
      image,
      featured,
      salePrice,
      saleStart,
      saleDurationHours,
      collection->{
        _id,
        title,
        "slug": slug.current
      }
    }
  `);
}

export async function getAllArtworks(): Promise<Artwork[]> {
  return sanityClient.fetch(`
    *[_type == "artwork"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      medium,
      dimensions,
      year,
      price,
      currency,
      status,
      image,
      featured,
      salePrice,
      saleStart,
      saleDurationHours,
      collection->{
        _id,
        title,
        "slug": slug.current
      }
    }
  `);
}

export async function getArtist(): Promise<Artist | null> {
  return sanityClient.fetch(`
    *[_type == "artist"][0] {
      name,
      bio,
      statement,
      photo,
      studioPhotos,
      socialLinks
    }
  `);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return sanityClient.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      coverImage,
      publishedAt,
      tags
    }
  `);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return sanityClient.fetch(
    `
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      coverImage,
      publishedAt,
      tags
    }
  `,
    { slug }
  );
}

export async function getActiveSales(): Promise<Artwork[]> {
  await releaseExpiredReservations();
  const artworks: Artwork[] = await sanityClient.fetch(`
    *[_type == "artwork" && defined(salePrice) && defined(saleStart) && defined(saleDurationHours) && status in ["available", "reserved", "sold"]] {
      _id,
      title,
      "slug": slug.current,
      description,
      medium,
      dimensions,
      year,
      price,
      currency,
      status,
      image,
      featured,
      salePrice,
      saleStart,
      saleDurationHours,
      collection->{
        _id,
        title,
        "slug": slug.current
      }
    }
  `);
  return artworks.filter((a) => isArtworkOnSale(a));
}

export async function updateArtworkStatus(
  artworkId: string,
  status: "available" | "sold" | "reserved"
) {
  return sanityClient
    .patch(artworkId)
    .set({ status })
    .commit();
}
