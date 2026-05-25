import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt } = await request.json() as { prompt: string };
  if (!prompt?.trim()) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: `You are writing for Fellonics, an intellectually rigorous blog about geometry for academics and passionate hobbyists. Topics include topology, tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical art.

Write in a voice that is: precise and clear, intellectually curious, accessible without being simplified, and occasionally illuminating surprising connections. Structure the post well with an engaging opening, developed body with examples, and a thoughtful conclusion. Use concrete geometric concepts, historical context where relevant, and mathematical intuition over formalism. Aim for 800-1500 words.`,
    messages: [{ role: "user", content: `Write a long-form blog post about: ${prompt}` }],
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
