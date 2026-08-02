import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import HomePosts from "@/components/public/HomePosts";
import type { PostWithTags, Post, Tag } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Essays",
  description: "Academic essays and personal reflections on Ffellonics — geometry, relational emergence, and the mathematics of form.",
};

async function getPosts(): Promise<PostWithTags[]> {
  try {
    const supabase = createPublicClient();
    const { data: rawPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (!rawPosts || rawPosts.length === 0) return [];

    const posts = rawPosts as Post[];
    const postIds = posts.map((p) => p.id);

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

export default async function EssaysPage() {
  const posts = await getPosts();

  return (
    <article className="mx-4 sm:mx-[100px] py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
        Essays
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-10" />
      <HomePosts posts={posts} />
    </article>
  );
}
