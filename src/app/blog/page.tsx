import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { getBlogPosts, urlFor } from "@/lib/sanity";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Studio updates, behind-the-scenes looks, and thoughts on art.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-soft-black">
          Journal
        </h1>
        <p className="mt-4 text-lg text-gallery-gray max-w-2xl mx-auto">
          Studio updates, process insights, and reflections on art and
          creativity.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gallery-gray text-lg py-12">
          Posts coming soon.
        </p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post._id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-warm-white">
                    {post.coverImage ? (
                      <Image
                        src={urlFor(post.coverImage).width(400).height(300).url()}
                        alt={post.coverImage.alt || post.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <PlaceholderImage
                        title={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="sm:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs text-gallery-gray mb-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-soft-black group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-gallery-gray leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
