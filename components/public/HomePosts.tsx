"use client";

import { useMemo } from "react";
import PostCard from "./PostCard";
import type { PostWithTags } from "@/types";

const POSTS_PER_PAGE = 12;

interface HomePostsProps {
  posts: PostWithTags[];
}

export default function HomePosts({ posts }: HomePostsProps) {
  const academicPosts = useMemo(
    () => posts.filter((p) => (p.post_type ?? "academic") === "academic"),
    [posts]
  );

  const reflectionPosts = useMemo(
    () => posts.filter((p) => p.post_type === "reflection"),
    [posts]
  );

  return (
    <div className="space-y-20">
      <SectionGrid
        title="Academic Essays"
        tagline="In-depth explorations of geometry, topology, and mathematical form"
        posts={academicPosts}
        priorityCount={2}
      />
      {reflectionPosts.length > 0 && (
        <SectionGrid
          title="Personal Reflections"
          tagline="Shorter thoughts on mathematics, art, and the geometry of everyday life"
          posts={reflectionPosts}
        />
      )}
    </div>
  );
}

function SectionGrid({
  title,
  tagline,
  posts,
  priorityCount = 0,
}: {
  title: string;
  tagline: string;
  posts: PostWithTags[];
  priorityCount?: number;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginated = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  if (posts.length === 0) return (
    <section>
      <div className="mb-8 pb-6 border-b border-[#ddd5c8]">
        <h2 className="font-serif text-2xl text-[#0f2240] tracking-tight">{title}</h2>
        <p className="font-serif italic text-[#7c6f64] text-sm mt-1">{tagline}</p>
      </div>
      <p className="font-serif italic text-[#7c6f64] text-center py-12">No essays found.</p>
    </section>
  );

  return (
    <section>
      <div className="mb-8 pb-6 border-b border-[#ddd5c8]">
        <h2 className="font-serif text-2xl text-[#0f2240] tracking-tight">{title}</h2>
        <p className="font-serif italic text-[#7c6f64] text-sm mt-1">{tagline}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginated.map((post, i) => (
          <PostCard key={post.id} post={post} priority={page === 1 && i < priorityCount} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm font-sans tracking-wider uppercase text-[#7c6f64] hover:text-[#0f2240] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <span className="font-serif text-sm text-[#7c6f64]">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm font-sans tracking-wider uppercase text-[#7c6f64] hover:text-[#0f2240] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
