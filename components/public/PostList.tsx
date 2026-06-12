"use client";

import { useState, useMemo } from "react";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";
import type { PostWithTags } from "@/types";

const POSTS_PER_PAGE = 12;

interface PostListProps {
  posts: PostWithTags[];
}

export default function PostList({ posts }: PostListProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt?.toLowerCase().includes(q) ?? false) ||
        p.tags?.some((t) => t.name.toLowerCase().includes(q))
    );
  }, [posts, query]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function handleSearch(val: string) {
    setQuery(val);
    setPage(1);
  }

  const sectionLabel = query.trim() ? `Results for "${query}"` : "Latest Essays";

  return (
    <section>
      {/* Section header */}
      <div id="search" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ddd5c8]">
        <h2 className="font-serif text-2xl text-[#0f2240] tracking-tight">{sectionLabel}</h2>
        <SearchBar value={query} onChange={handleSearch} />
      </div>

      {paginated.length === 0 ? (
        <p className="font-serif italic text-[#7c6f64] text-center py-12">No essays found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginated.map((post, i) => (
            <PostCard key={post.id} post={post} priority={page === 1 && i < 2} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12">
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
