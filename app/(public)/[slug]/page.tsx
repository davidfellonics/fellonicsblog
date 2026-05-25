import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthorBio from "@/components/public/AuthorBio";
import SocialShareButtons from "@/components/public/SocialShareButtons";
import CommentSection from "@/components/public/CommentSection";
import CommentForm from "@/components/public/CommentForm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateISO } from "@/lib/utils/formatDate";
import type { PostWithTags, Comment, Post, Profile, Tag } from "@/types";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<PostWithTags | null> {
  try {
    const supabase = await createClient();
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
    console.error("[getPost] error for slug:", slug, err);
    return null;
  }
}

async function getComments(postId: string): Promise<Comment[]> {
  try {
    const supabase = await createClient();
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
    const supabase = await createClient();
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
  const image = post.og_image_url ?? post.cover_image_url;

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
      images: image ? [{ url: image, alt: post.title }] : [],
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
      ? { "@type": "Person", name: post.author.full_name }
      : { "@type": "Organization", name: "Fellonics" },
    publisher: {
      "@type": "Organization",
      name: "Fellonics",
      url: siteUrl,
    },
  };

  return (
    <>
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-10">
        {/* Cover image */}
        {post.cover_image_url && (
          <div className="relative w-full aspect-video max-w-[860px] mx-auto mb-8 -mx-4 sm:-mx-6 md:mx-auto">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
              sizes="(max-width: 860px) 100vw, 860px"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold font-sans text-[#111111] leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6b7280] mb-6">
          {post.published_at && (
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          )}
          {post.reading_time_minutes && (
            <>
              <span>·</span>
              <span>{post.reading_time_minutes} min read</span>
            </>
          )}
          {post.tags.map((tag) => (
            <Badge key={tag.id} className="bg-[#f0f4f8] text-[#1a3a5c] border-0 text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Author bio */}
        {post.author && (
          <div className="mb-8">
            <AuthorBio author={post.author} />
          </div>
        )}

        {/* Post body */}
        <div
          className="prose prose-lg max-w-none font-serif text-[#111111] prose-headings:font-sans prose-a:text-[#1a3a5c] prose-blockquote:border-[#1a3a5c] prose-blockquote:text-[#6b7280]"
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
