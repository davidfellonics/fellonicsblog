"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/generateSlug";
import { calculateReadingTime } from "@/lib/utils/readingTime";
import type { Post, Tag } from "@/types";
import { X } from "lucide-react";

const PostEditorComponent = dynamic(() => import("./PostEditor"), { ssr: false });

interface PostEditorPageProps {
  post?: Post & { tags?: Tag[] };
  allTags: Tag[];
  authorId: string;
}

export default function PostEditorPage({ post, allTags, authorId }: PostEditorPageProps) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? "");
  const [isPublished, setIsPublished] = useState(post?.status === "published");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(post?.tags ?? []);
  const [newTagInput, setNewTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);


  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) {
      setSlug(generateSlug(val));
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const supabase = createClient();
    const fileName = `covers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
    const { data, error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, file, { upsert: false });
    setCoverUploading(false);
    if (uploadError || !data) { alert("Cover upload failed."); return; }
    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(data.path);
    setCoverImageUrl(publicUrl);
    e.target.value = "";
  }

  async function addTag(tagName: string) {
    const name = tagName.trim();
    if (!name) return;
    const tagSlug = generateSlug(name);
    if (selectedTags.some((t) => t.slug === tagSlug)) return;

    const supabase = createClient();
    let tag: Tag | null = null;

    const { data: existing } = await supabase.from("tags").select("*").eq("slug", tagSlug).single();
    if (existing) {
      tag = existing as Tag;
    } else {
      const { data: created } = await supabase
        .from("tags")
        .insert({ name, slug: tagSlug } as never)
        .select()
        .single();
      tag = created as Tag | null;
    }

    if (tag) setSelectedTags((prev) => [...prev, tag!]);
    setNewTagInput("");
  }

  function removeTag(tagId: string) {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
  }

  async function savePost(publish: boolean) {
    setError(null);
    if (!title.trim()) { setError("Title is required."); return; }
    if (!slug.trim()) { setError("Slug is required."); return; }

    setSaving(true);
    const supabase = createClient();

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content,
      cover_image_url: coverImageUrl || null,
      author_id: authorId,
      status: (publish ? "published" : "draft") as "published" | "draft",
      published_at: publish ? (post?.published_at ?? new Date().toISOString()) : null,
      reading_time_minutes: calculateReadingTime(content),
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      og_image_url: coverImageUrl || null,
      updated_at: new Date().toISOString(),
    };

    let postId = post?.id;

    if (isEdit && postId) {
      const { error: updateError } = await supabase.from("posts").update(postData as never).eq("id", postId);
      if (updateError) { setError(updateError.message); setSaving(false); return; }
    } else {
      const { data, error: insertError } = await supabase.from("posts").insert(postData as never).select().single();
      if (insertError || !data) { setError(insertError?.message ?? "Failed to create post."); setSaving(false); return; }
      postId = (data as { id: string }).id;
    }

    // Sync tags
    if (postId) {
      await supabase.from("post_tags").delete().eq("post_id", postId);
      if (selectedTags.length > 0) {
        await supabase.from("post_tags").insert(
          selectedTags.map((t) => ({ post_id: postId!, tag_id: t.id })) as never
        );
      }
    }

    // Trigger ISR revalidation
    if (publish) {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET, slug }),
      }).catch(() => {});
    }

    setSaving(false);
    router.push("/admin/dashboard");
    router.refresh();
  }


  return (
    <div className="flex gap-6 p-6 md:p-10 min-h-screen">
      {/* Editor */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold font-sans">{isEdit ? "Edit Post" : "New Post"}</h1>
        </div>
        <PostEditorComponent content={content} onChange={setContent} />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => savePost(false)} disabled={saving}>
            {saving ? "Saving…" : "Save Draft"}
          </Button>
          <Button onClick={() => savePost(true)} disabled={saving}>
            {saving ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Settings sidebar */}
      <aside className="w-[300px] flex-shrink-0 space-y-5">
        <div className="space-y-1">
          <Label htmlFor="post-title">Title</Label>
          <Input
            id="post-title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
          />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#6b7280]">Slug:</span>
            <Input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              className="text-xs h-7 px-2"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="excerpt">Excerpt <span className="text-[#6b7280] font-normal">({excerpt.length}/160)</span></Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value.slice(0, 160))}
            placeholder="Short post description…"
            rows={3}
            maxLength={160}
          />
        </div>

        <div className="space-y-1">
          <Label>Cover image</Label>
          {coverImageUrl && (
            <div className="relative aspect-video rounded overflow-hidden border border-[#e5e7eb] mb-2">
              <Image src={coverImageUrl} alt="Cover" fill className="object-cover" />
            </div>
          )}
          <label className="block">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">
                {coverUploading ? "Uploading…" : coverImageUrl ? "Change image" : "Upload image"}
              </span>
            </Button>
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={coverUploading} />
          </label>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {selectedTags.map((tag) => (
              <span key={tag.id} className="inline-flex items-center gap-1 bg-[#f0f4f8] text-[#1a3a5c] text-xs px-2 py-1 rounded-full">
                {tag.name}
                <button type="button" onClick={() => removeTag(tag.id)} className="hover:text-destructive">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <Input
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Add tag…"
              className="text-sm h-8"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(newTagInput); } }}
            />
            <Button variant="outline" size="sm" onClick={() => addTag(newTagInput)}>Add</Button>
          </div>
          {allTags.filter((t) => !selectedTags.some((s) => s.id === t.id)).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {allTags.filter((t) => !selectedTags.some((s) => s.id === t.id)).map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTags((prev) => [...prev, tag])}
                  className="text-xs text-[#6b7280] hover:text-[#1a3a5c] underline"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="meta-title">Meta title override</Label>
          <Input
            id="meta-title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={title || "Defaults to post title"}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="meta-desc">Meta description <span className="text-[#6b7280] font-normal">({metaDescription.length}/160)</span></Label>
          <Textarea
            id="meta-desc"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
            placeholder="SEO description…"
            rows={2}
            maxLength={160}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="publish-switch"
            checked={isPublished}
            onCheckedChange={setIsPublished}
          />
          <Label htmlFor="publish-switch">{isPublished ? "Published" : "Draft"}</Label>
        </div>
      </aside>

    </div>
  );
}
