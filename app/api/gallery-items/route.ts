import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, image_url, alt_text, body, display_order } = await request.json();
  if (!title || !image_url) return NextResponse.json({ error: "title and image_url are required" }, { status: 400 });

  const { data, error } = await supabase
    .from("gallery_items")
    .insert({ title, image_url, alt_text: alt_text || "", body: body || "", display_order: display_order ?? 0 } as never)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/gallery");
  return NextResponse.json({ item: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, image_url, alt_text, body, display_order } = await request.json();
  if (!id || !title || !image_url) return NextResponse.json({ error: "id, title and image_url are required" }, { status: 400 });

  const { data, error } = await supabase
    .from("gallery_items")
    .update({ title, image_url, alt_text: alt_text || "", body: body || "", display_order: display_order ?? 0 } as never)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/gallery");
  return NextResponse.json({ item: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
