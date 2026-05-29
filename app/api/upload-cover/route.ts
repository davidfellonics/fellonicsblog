import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // 1. Verify the caller is an authenticated admin
  const authSupabase = await createClient();
  const { data: { user }, error: authError } = await authSupabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse the uploaded file from FormData
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Basic type check
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  // 3. Upload using the service-role client (bypasses storage RLS)
  const serviceSupabase = createServiceClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileName = `covers/${Date.now()}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const { data, error: uploadError } = await serviceSupabase.storage
    .from("post-images")
    .upload(fileName, new Uint8Array(bytes), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError || !data) {
    console.error("[upload-cover]", uploadError);
    return NextResponse.json(
      { error: uploadError?.message ?? "Upload failed" },
      { status: 500 }
    );
  }

  // 4. Return the public URL
  const { data: { publicUrl } } = serviceSupabase.storage
    .from("post-images")
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
