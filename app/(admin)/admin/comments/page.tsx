import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CommentTable from "@/components/admin/CommentTable";
import type { CommentWithPost } from "@/types";

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: comments } = await supabase
    .from("comments")
    .select("*, post:posts(title,slug)")
    .order("created_at", { ascending: false });

  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={count ?? 0} />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold font-sans text-[#111111] mb-8">Comment Moderation</h1>
        <CommentTable comments={(comments ?? []) as CommentWithPost[]} />
      </div>
    </div>
  );
}
