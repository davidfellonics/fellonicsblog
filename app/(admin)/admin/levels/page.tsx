import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LevelsEditor from "@/components/admin/LevelsEditor";

export default async function LevelsAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: pendingCount }, { data: page }] = await Promise.all([
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    createPublicClient().from("pages").select("content").eq("key", "levels").single(),
  ]);

  const initialContent = (page as { content: string } | null)?.content ?? "";

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={pendingCount ?? 0} />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold font-sans text-[#111111] mb-2">Ffellonic Levels</h1>
        <p className="text-sm text-[#6b7280] font-sans mb-8">
          Edit the content of the public Ffellonic Levels page. Changes go live immediately after saving.
        </p>
        <LevelsEditor initialContent={initialContent} />
      </div>
    </div>
  );
}
