import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GlossaryForm from "@/components/admin/GlossaryForm";
import type { GlossaryEntry } from "@/types";

export default async function GlossaryAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: pendingCount }, { data: entries }] = await Promise.all([
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    createPublicClient()
      .from("glossary_entries")
      .select("*")
      .order("term", { ascending: true }),
  ]);

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={pendingCount ?? 0} />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold font-sans text-[#111111] mb-8">Glossary Data</h1>
        <GlossaryForm initialEntries={(entries ?? []) as GlossaryEntry[]} />
      </div>
    </div>
  );
}
