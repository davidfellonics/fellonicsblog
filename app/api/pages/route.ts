import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, content } = await request.json();
  if (!key || content === undefined) return NextResponse.json({ error: "key and content are required" }, { status: 400 });

  const { error } = await supabase
    .from("pages")
    .upsert({ key, content, updated_at: new Date().toISOString() } as never);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const pathMap: Record<string, string> = {
    about: "/about",
    levels: "/levels",
  };
  const path = pathMap[key] ?? `/${key}`;
  revalidatePath(path);
  return NextResponse.json({ ok: true });
}
