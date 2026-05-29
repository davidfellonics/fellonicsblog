import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { slug?: string };

  // Accept EITHER an authenticated browser session OR the service-role key
  // in the Authorization header (used by the /new-blog-post CLI skill).
  const authHeader = request.headers.get("authorization") ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasServiceKey = !!serviceKey && authHeader === `Bearer ${serviceKey}`;

  if (!hasServiceKey) {
    const authSupabase = await createClient();
    const { data: { user } } = await authSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  revalidatePath("/");
  if (body.slug) revalidatePath(`/${body.slug}`);

  return NextResponse.json({ revalidated: true });
}
