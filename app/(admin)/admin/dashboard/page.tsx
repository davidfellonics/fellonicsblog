import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PostTable from "@/components/admin/PostTable";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: posts }, { count: pendingCount }] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={pendingCount ?? 0} />
      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-sans text-[#111111]">Posts</h1>
          <Button asChild>
            <Link href="/admin/posts/new">New Post</Link>
          </Button>
        </div>
        <PostTable posts={posts ?? []} />
      </div>
    </div>
  );
}
