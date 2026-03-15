import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getBlogPost, urlFor } from "@/lib/sanity";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post?.title || "Blog Post",
    description: post?.excerpt || "Read this post on the MK blog.",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gallery-gray hover:text-soft-black transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        All Posts
      </Link>

      <div className="flex items-center gap-2 text-sm text-gallery-gray mb-4">
        <CalendarDays className="h-4 w-4" />
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black mb-8">
        {post.title}
      </h1>

      <div className="aspect-[16/9] overflow-hidden rounded-xl bg-warm-white mb-10">
        {post.coverImage ? (
          <Image
            src={urlFor(post.coverImage).width(1200).height(675).url()}
            alt={post.coverImage.alt || post.title}
            width={1200}
            height={675}
            className="h-full w-full object-cover"
            priority
          />
        ) : (
          <PlaceholderImage
            title={post.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {post.body && (
        <div className="prose prose-lg max-w-none text-gallery-gray leading-relaxed space-y-6">
          {(post.body as { _type: string; _key: string; children?: { text: string }[] }[]).map((block) => {
            if (block._type === "block" && block.children) {
              return (
                <p key={block._key}>
                  {block.children.map((child) => child.text).join("")}
                </p>
              );
            }
            return null;
          })}
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-warm-white flex gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-accent bg-accent/10 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-warm-white">
        <Link
          href="/collections"
          className="text-sm font-medium text-accent hover:text-accent-dark transition-colors underline underline-offset-4"
        >
          View the collection this piece belongs to
        </Link>
      </div>
    </article>
  );
}
