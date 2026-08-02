import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GalleryItemsForm from "@/components/admin/GalleryItemsForm";
import type { GalleryItem } from "@/types";

export default async function GalleryItemsAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: pendingCount }, { data: items }] = await Promise.all([
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    createPublicClient()
      .from("gallery_items")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar pendingComments={pendingCount ?? 0} />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold font-sans text-[#111111] mb-2">Gallery Items</h1>
        <p className="text-sm text-[#6b7280] font-sans mb-8">
          Add, edit, or remove gallery items. Use Display order to control the sequence (lowest number appears first).
        </p>
        <GalleryItemsForm initialItems={(items ?? []) as GalleryItem[]} />
      </div>
    </div>
  );
}
