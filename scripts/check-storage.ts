import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  realtime: { transport: ws as any },
});
async function run() {
  // List policies via pg query through the REST API is not available directly.
  // Instead, try a test upload with the anon key to simulate what the browser does.
  const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    realtime: { transport: ws as any },
  });

  // Create a tiny test file
  const testBlob = Buffer.from("test image data");
  const { data, error } = await anonClient.storage
    .from("post-images")
    .upload(`covers/test-${Date.now()}.txt`, testBlob, { upsert: false });

  console.log("Upload with anon key:", error ? `ERROR: ${error.message} (${error.statusCode})` : `OK: ${data?.path}`);

  // Also test with service role key
  const { data: d2, error: e2 } = await sb.storage
    .from("post-images")
    .upload(`covers/test-service-${Date.now()}.txt`, testBlob, { upsert: false });

  console.log("Upload with service key:", e2 ? `ERROR: ${e2.message}` : `OK: ${d2?.path}`);

  // Clean up
  if (d2?.path) await sb.storage.from("post-images").remove([d2.path]);
}
run().catch(console.error);
