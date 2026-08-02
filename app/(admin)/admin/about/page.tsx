import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AboutEditor from "@/components/admin/AboutEditor";

export default async function AboutAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: pendingCount }, { data: page }] = await Promise.all([
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    createPublicClient().from("pages").select("content").eq("key", "about").single(),
  ]);

  const initialContent = (page as { content: string } | null)?.content ?? "";

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={pendingCount ?? 0} />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold font-sans text-[#111111] mb-2">About Page</h1>
        <p className="text-sm text-[#6b7280] font-sans mb-8">
          Edit the content of the public About page. Changes go live immediately after saving.
        </p>
        <AboutEditor initialContent={initialContent} />
      </div>
    </div>
  );
}
