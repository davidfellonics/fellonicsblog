"use client";

import { useState, useMemo } from "react";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
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

  return (
    <section>
      <div id="search" className="mb-8">
        <SearchBar value={query} onChange={handleSearch} />
      </div>

      {paginated.length === 0 ? (
        <p className="text-[#6b7280] text-center py-12">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginated.map((post, i) => (
            <PostCard key={post.id} post={post} priority={page === 1 && i < 2} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-[#6b7280]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
