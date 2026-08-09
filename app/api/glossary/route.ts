import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { term, date_range, body } = await request.json();
  if (!term || !body) return NextResponse.json({ error: "term and body are required" }, { status: 400 });

  const { data, error } = await supabase
    .from("glossary_entries")
    .insert({ term, date_range: date_range || null, body } as never)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/glossary");
  return NextResponse.json({ entry: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, term, date_range, body } = await request.json();
  if (!id || !term || !body) return NextResponse.json({ error: "id, term and body are required" }, { status: 400 });

  const { data, error } = await supabase
    .from("glossary_entries")
    .update({ term, date_range: date_range || null, body } as never)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/glossary");
  return NextResponse.json({ entry: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("glossary_entries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/glossary");
  return NextResponse.json({ ok: true });
}
