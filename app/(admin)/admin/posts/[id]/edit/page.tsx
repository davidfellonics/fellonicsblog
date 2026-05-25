import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PostEditorPage from "@/components/admin/PostEditorPage";
import type { Post, Tag } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: rawPost }, { data: postTags }, { data: tags }, { count: pendingCount }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).single(),
    supabase.from("post_tags").select("tags(*)").eq("post_id", id),
    supabase.from("tags").select("*").order("name"),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  if (!rawPost) notFound();

  const post = rawPost as Post;

  type PostTagRow = { tags: Tag | null };
  const resolvedTags: Tag[] = ((postTags ?? []) as PostTagRow[])
    .map((pt) => pt.tags)
    .filter((t): t is Tag => t !== null && typeof t === "object");

  const postWithTags: Post & { tags: Tag[] } = { ...post, tags: resolvedTags };

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={pendingCount ?? 0} />
      <div className="flex-1 overflow-auto">
        <PostEditorPage
          post={postWithTags}
          allTags={tags ?? []}
          authorId={user.id}
        />
      </div>
    </div>
  );
}
