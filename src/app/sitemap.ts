import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getCollections, getAllArtworks, getBlogPosts } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, artworks, posts] = await Promise.all([
    getCollections(),
    getAllArtworks(),
    getBlogPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/commission`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${SITE_URL}/collections/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const artworkRoutes: MetadataRoute.Sitemap = artworks.map((artwork) => ({
    url: `${SITE_URL}/artwork/${artwork.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...collectionRoutes, ...artworkRoutes, ...blogRoutes];
}
