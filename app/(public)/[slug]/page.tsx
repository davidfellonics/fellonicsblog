import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/server";
import AuthorBio from "@/components/public/AuthorBio";
import SocialShareButtons from "@/components/public/SocialShareButtons";
import CommentSection from "@/components/public/CommentSection";
import CommentForm from "@/components/public/CommentForm";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateISO } from "@/lib/utils/formatDate";
import type { PostWithTags, Comment, Post, Profile, Tag } from "@/types";

export const revalidate = 3600; // 1 hour — post content rarely changes

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<PostWithTags | null> {
  try {
    const supabase = createPublicClient();
    const { data: rawPost } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!rawPost) return null;

    const post = rawPost as Post;

    const { data: postTags } = await supabase
      .from("post_tags")
      .select("tags(*)")
      .eq("post_id", post.id);

    const { data: rawAuthor } = post.author_id
      ? await supabase.from("profiles").select("*").eq("id", post.author_id).single()
      : { data: null };

    const author = rawAuthor as Profile | null;
    type PTRow = { tags: Tag | null };
    const tags: Tag[] = ((postTags ?? []) as PTRow[]).map((pt) => pt.tags).filter((t): t is Tag => t !== null);
    return { ...post, tags, author };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[getPost-fail]", msg);
    return null;
  }
}

async function getComments(postId: string): Promise<Comment[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    return (data ?? []) as Comment[];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");
    return ((data ?? []) as { slug: string }[]).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/${post.slug}`;
  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? post.excerpt?.slice(0, 160) ?? "";
  const image = post.og_image_url ?? post.cover_image_url
    ?? `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical: postUrl },
    openGraph: {
      title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    console.log("[PostPage] notFound for slug:", slug);
    notFound();
  }
  const comments = await getComments(post.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? "",
    url: postUrl,
    datePublished: post.published_at ? formatDateISO(post.published_at) : undefined,
    dateModified: formatDateISO(post.updated_at),
    image: post.og_image_url ?? post.cover_image_url ?? undefined,
    author: post.author
      ? { "@type": "Person", name: post.author.full_name, url: `${siteUrl}/about` }
      : { "@type": "Person", name: "David Fell", url: `${siteUrl}/about`, sameAs: ["https://x.com/ffellonicforms"] },
    publisher: {
      "@type": "Organization",
      name: "FFellonics",
      url: siteUrl,
    },
  };

  return (
    <>
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-14">
        {/* Cover image */}
        {post.cover_image_url && (
          <div className="relative w-full aspect-video mb-10 rounded-sm overflow-hidden">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 860px) 100vw, 860px"
            />
          </div>
        )}

        {/* Tags above title */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-x-3 text-[10px] uppercase tracking-widest text-[#b8862a] mb-4">
            {post.tags.map((tag) => (
              <span key={tag.id}>{tag.name}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
          {post.title}
        </h1>

        {/* Gold rule */}
        <div className="w-10 h-[1px] bg-[#b8862a] mb-5" />

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#7c6f64] mb-8">
          {post.published_at && (
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          )}
          {post.reading_time_minutes && (
            <span>· {post.reading_time_minutes} min read</span>
          )}
        </div>

        {/* Author byline */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7c6f64] mb-8">
          <span>By</span>
          <span className="text-[#0f2240] font-medium">
            {post.author?.full_name ?? "David Fell"}
          </span>
        </div>

        {/* Author bio */}
        {post.author && (
          <div className="mb-10 pb-8 border-b border-[#ddd5c8]">
            <AuthorBio author={post.author} />
          </div>
        )}

        {/* Post body */}
        <div
          className="prose prose-lg max-w-none font-serif text-[#1a1614] prose-headings:font-sans prose-headings:text-[#0f2240] prose-a:text-[#0f2240] prose-a:underline-offset-2 prose-blockquote:border-[#b8862a] prose-blockquote:text-[#7c6f64] prose-strong:text-[#0f2240]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Social share */}
        <div className="mt-10 mb-4">
          <SocialShareButtons title={post.title} url={postUrl} />
        </div>

        <Separator className="my-8" />

        {/* Comments */}
        <div className="space-y-8">
          <CommentSection comments={comments} />
          <CommentForm postId={post.id} />
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
