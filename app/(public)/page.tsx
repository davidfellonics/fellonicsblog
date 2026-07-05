import type { Metadata } from "next";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import HomePosts from "@/components/public/HomePosts";
import type { PostWithTags, Post, Tag, Profile } from "@/types";

export const revalidate = 3600; // 1 hour — posts don't change every minute

const siteUrlForMeta = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "FFellonics — Exploring Geometry",
  description:
    "Exploring geometry — topology, tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical art.",
  alternates: {
    canonical: siteUrlForMeta,
  },
  openGraph: {
    title: "FFellonics — Exploring Geometry",
    description:
      "Exploring geometry — topology, tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical art.",
    url: siteUrlForMeta,
    type: "website",
    images: [
      {
        url: `${siteUrlForMeta}/api/og?title=FFellonics%20%E2%80%94%20Exploring%20Geometry`,
        width: 1200,
        height: 630,
        alt: "FFellonics — Exploring Geometry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FFellonics — Exploring Geometry",
    description: "Exploring geometry — topology, tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical art.",
    images: [`${siteUrlForMeta}/api/og?title=FFellonics%20%E2%80%94%20Exploring%20Geometry`],
  },
};

async function getPosts(): Promise<PostWithTags[]> {
  try {
  const supabase = createPublicClient();

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
  const supabase = createPublicClient();
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
      <section className="relative w-full border-b border-[#ddd5c8] overflow-hidden">
        {/* Background image */}
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover w-full"
          priority
          aria-hidden="true"
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#0f2240]/60" aria-hidden="true" />

        {/* Content */}
        <div className="relative mx-4 sm:mx-[100px] py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-white mx-auto mb-6 overflow-hidden ring-2 ring-[#b8862a] ring-offset-4 ring-offset-transparent flex items-center justify-center">
            <Image
              src="/logo-circle.png"
              alt="Ffellonics"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight tracking-tight mb-5">
            Ffellonics
          </h1>
          <div className="w-10 h-[1px] bg-[#b8862a] mx-auto mb-5" />
          <p className="font-serif italic text-white/80 text-lg sm:text-xl max-w-[540px] mx-auto leading-relaxed">
            {author?.bio ?? "A journal of geometric thought — topology, polyhedra, tessellation, and the mathematics of form."}
          </p>
        </div>
      </section>

      {/* Posts */}
      <div className="mx-4 sm:mx-[100px] py-12">
        <HomePosts posts={posts} />
      </div>

      {/* JSON-LD for site */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "FFellonics",
            description: "Exploring geometry, one post at a time.",
            url: siteUrl,
            publisher: {
              "@type": "Organization",
              name: "FFellonics",
            },
          }),
        }}
      />
    </>
  );
}
