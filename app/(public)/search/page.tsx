import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";
import PostCard from "@/components/public/PostCard";
import type { PostWithTags, Post, Tag } from "@/types";

const STATIC_PAGES = [
  {
    href: "/about",
    title: "About",
    excerpt:
      "Ffellonics is a philosophical and geometric model of relational self-assembly, inspired by physics, sphere-packing mathematics, and ancient metaphysics.",
  },
  {
    href: "/glossary",
    title: "Glossary",
    excerpt:
      "A growing lexicon of geometric and philosophical terms — from emergence and symmetry to Platonic solids and beyond.",
  },
  {
    href: "/contact",
    title: "Contact",
    excerpt: "Get in touch with the Ffellonics journal at ffellonicforms@gmail.com.",
  },
];

export function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Metadata {
  const q = searchParams.q?.trim() ?? "";
  return {
    title: q ? `"${q}" — Search` : "Search",
    robots: { index: false },
  };
}

async function getAllPosts(): Promise<PostWithTags[]> {
  try {
    const supabase = createPublicClient();
    const { data: rawPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (!rawPosts) return [];
    const posts = rawPosts as Post[];
    const postIds = posts.map((p) => p.id);
    if (postIds.length === 0) return [];

    const { data: postTags } = await supabase
      .from("post_tags")
      .select("post_id, tags(*)")
      .in("post_id", postIds);

    type PTRow = { post_id: string; tags: Tag | null };
    const typedPostTags = (postTags ?? []) as PTRow[];

    return posts.map((post) => {
      const tags = typedPostTags
        .filter((pt) => pt.post_id === post.id)
        .map((pt) => pt.tags)
        .filter((t): t is Tag => t !== null);
      return { ...post, tags, author: null };
    });
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q ?? "").trim();
  const q = query.toLowerCase();

  const allPosts = await getAllPosts();

  const matchedPosts = q
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt?.toLowerCase().includes(q) ?? false) ||
          p.tags?.some((t) => t.name.toLowerCase().includes(q))
      )
    : [];

  const matchedPages = q
    ? STATIC_PAGES.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      )
    : [];

  const totalResults = matchedPosts.length + matchedPages.length;

  return (
    <div className="mx-4 sm:mx-[100px] py-12">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-[#ddd5c8]">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#0f2240] tracking-tight leading-tight">
          {query ? (
            <>
              Results for{" "}
              <span className="italic">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Search"
          )}
        </h1>
        <p className="font-serif italic text-[#7c6f64] text-sm mt-2">
          {query
            ? `${totalResults} ${totalResults === 1 ? "result" : "results"} found`
            : "Use the search bar in the navigation to find posts and pages."}
        </p>
      </div>

      {/* Page matches */}
      {matchedPages.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-lg text-[#0f2240] tracking-tight mb-4 uppercase text-xs font-sans tracking-widest text-[#7c6f64]">
            Pages
          </h2>
          <div className="space-y-3">
            {matchedPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="block p-5 bg-white border border-[#ddd5c8] rounded-sm hover:shadow-md transition-shadow group"
              >
                <p className="font-serif text-[#0f2240] group-hover:text-[#b8862a] transition-colors">
                  {page.title}
                </p>
                <p className="font-serif italic text-[#7c6f64] text-sm mt-1 leading-relaxed">
                  {page.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Post matches */}
      {matchedPosts.length > 0 && (
        <section>
          {matchedPages.length > 0 && (
            <p className="text-xs font-sans uppercase tracking-widest text-[#7c6f64] mb-4">
              Essays
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchedPosts.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i < 4} />
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {query && totalResults === 0 && (
        <p className="font-serif italic text-[#7c6f64] text-center py-20">
          No results for &ldquo;{query}&rdquo;. Try different keywords.
        </p>
      )}
    </div>
  );
}
