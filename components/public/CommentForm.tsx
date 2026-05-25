"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !content.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("comments").insert({
      post_id: postId,
      author_name: name.trim(),
      author_email: email.trim().toLowerCase(),
      content: content.trim(),
      status: "pending",
    } as never);

    setLoading(false);

    if (insertError) {
      setError("Failed to submit comment. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-[#e5e7eb] rounded-lg p-5 bg-[#f0f4f8]">
        <p className="text-sm font-sans text-[#1a3a5c] font-medium">
          Your comment is awaiting moderation.
        </p>
        <p className="text-sm text-[#6b7280] mt-1">
          Thank you for sharing your thoughts. It will appear once approved.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold font-sans text-lg text-[#111111] mb-4">Leave a comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="comment-name">Name</Label>
            <Input
              id="comment-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="comment-email">Email</Label>
            <Input
              id="comment-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="comment-content">Comment</Label>
          <Textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts…"
            rows={4}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit comment"}
        </Button>
      </form>
    </div>
  );
}
