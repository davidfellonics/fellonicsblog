import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import PostList from "@/components/public/PostList";
import GeometricPattern from "@/components/shared/GeometricPattern";
import type { PostWithTags, Post, Tag, Profile } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Fellonics — Exploring Geometry",
  description:
    "Exploring geometry — topology, tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical art.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
};

async function getPosts(): Promise<PostWithTags[]> {
  try {
  const supabase = await createClient();

  const { data: rawPosts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !rawPosts) return [];

  const posts = rawPosts as Post[];
  const postIds = posts.map((p) => p.id);
  if (postIds.length === 0) return posts.map((p) => ({ ...p, tags: [], author: null }));

  const { data: postTags } = await supabase
    .from("post_tags")
    .select("post_id, tags(*)")
    .in("post_id", postIds);

  type PTRow = { post_id: string; tags: Tag | null };
  const typedPostTags = (postTags ?? []) as PTRow[];

  return posts.map((post) => {
    const tags: Tag[] = typedPostTags
      .filter((pt) => pt.post_id === post.id)
      .map((pt) => pt.tags)
      .filter((t): t is Tag => t !== null);
    return { ...post, tags, author: null };
  });
  } catch {
    return [];
  }
}

async function getAuthor(): Promise<Profile | null> {
  try {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();
  return (data as Profile | null);
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [posts, author] = await Promise.all([getPosts(), getAuthor()]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e5e7eb]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <GeometricPattern className="w-full h-full" />
        </div>
        <div className="relative max-w-[680px] mx-auto px-4 sm:px-6 py-20 text-center">
          {author?.avatar_url && (
            <Image
              src={author.avatar_url}
              alt={author.full_name}
              width={64}
              height={64}
              className="rounded-full mx-auto mb-5 object-cover w-16 h-16"
            />
          )}
          {!author?.avatar_url && (
            <div className="w-16 h-16 rounded-full bg-[#f0f4f8] mx-auto mb-5 flex items-center justify-center border border-[#e5e7eb]">
              <span className="text-[#1a3a5c] font-bold text-xl font-sans">F</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold font-sans text-[#111111] mb-3">
            {author?.full_name ?? "Fellonics"}
          </h1>
          <p className="text-[#6b7280] text-base sm:text-lg font-sans max-w-[480px] mx-auto">
            {author?.bio ?? "Exploring geometry — topology, tessellation, polyhedra, and mathematical art."}
          </p>
        </div>
      </section>

      {/* Posts */}
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <PostList posts={posts} />
      </div>

      {/* JSON-LD for site */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Fellonics",
            description: "Exploring geometry, one post at a time.",
            url: siteUrl,
            publisher: {
              "@type": "Organization",
              name: "Fellonics",
            },
          }),
        }}
      />
    </>
  );
}
