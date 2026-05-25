import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { secret?: string; slug?: string };

  if (body.secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/");
  if (body.slug) {
    revalidatePath(`/${body.slug}`);
  }

  return NextResponse.json({ revalidated: true });
}
