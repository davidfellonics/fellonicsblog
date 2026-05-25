import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PostEditorPage from "@/components/admin/PostEditorPage";

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: tags }, { count: pendingCount }] = await Promise.all([
    supabase.from("tags").select("*").order("name"),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={pendingCount ?? 0} />
      <div className="flex-1 overflow-auto">
        <PostEditorPage allTags={tags ?? []} authorId={user.id} />
      </div>
    </div>
  );
}
