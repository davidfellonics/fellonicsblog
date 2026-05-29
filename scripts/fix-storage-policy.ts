/**
 * Adds RLS policies to the post-images bucket so that:
 *  - Anyone can READ (public reads)
 *  - Authenticated users can INSERT (upload)
 *  - Authenticated users can UPDATE and DELETE their uploads
 */
import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  realtime: { transport: ws as any },
  db: { schema: "storage" },
});

async function run() {
  // Check existing policies
  const { data: existing, error: listErr } = await sb
    .from("policies")
    .select("name, definition, action")
    .eq("table", "objects");

  if (listErr) {
    console.log("Can't list policies via this method:", listErr.message);
  } else {
    console.log("Existing storage policies:", JSON.stringify(existing, null, 2));
  }
}
run().catch(console.error);
