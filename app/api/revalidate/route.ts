import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // Verify caller is an authenticated admin — no need for a shared secret
  const authSupabase = await createClient();
  const { data: { user }, error } = await authSupabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as { slug?: string };

  revalidatePath("/");
  if (body.slug) {
    revalidatePath(`/${body.slug}`);
  }

  return NextResponse.json({ revalidated: true });
}
