"use client";

import { useState, useMemo } from "react";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";
import type { PostWithTags } from "@/types";

const SECTION_MAX = 12;

interface HomePostsProps {
  posts: PostWithTags[];
}

export default function HomePosts({ posts }: HomePostsProps) {
  const [query, setQuery] = useState("");

  const academicPosts = useMemo(
    () => posts.filter((p) => (p.post_type ?? "academic") === "academic"),
    [posts]
  );

  const reflectionPosts = useMemo(
    () => posts.filter((p) => p.post_type === "reflection"),
    [posts]
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt?.toLowerCase().includes(q) ?? false) ||
        p.tags?.some((t) => t.name.toLowerCase().includes(q))
    );
  }, [posts, query]);

  return (
    <div>
      <div id="search" className="mb-12">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {query.trim() ? (
        <SectionGrid
          title={`Results for "${query}"`}
          tagline={`${searchResults.length} essay${searchResults.length !== 1 ? "s" : ""} found`}
          posts={searchResults}
        />
      ) : (
        <div className="space-y-20">
          <SectionGrid
            title="Academic Essays"
            tagline="In-depth explorations of geometry, topology, and mathematical form"
            posts={academicPosts.slice(0, SECTION_MAX)}
            priorityCount={2}
          />
          {reflectionPosts.length > 0 && (
            <SectionGrid
              title="Personal Reflections"
              tagline="Shorter thoughts on mathematics, art, and the geometry of everyday life"
              posts={reflectionPosts.slice(0, SECTION_MAX)}
            />
          )}
        </div>
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
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} priority={i < priorityCount} />
        ))}
      </div>
    </section>
  );
}
