"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils/formatDate";
import type { Post } from "@/types";

interface PostTableProps {
  posts: Post[];
}

export default function PostTable({ posts: initialPosts }: PostTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = query.trim()
    ? posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : posts;

  async function handleDelete(id: string) {
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
    router.refresh();
  }

  return (
    <div>
      <Input
        placeholder="Search posts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 max-w-sm"
      />
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f0f4f8]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111]">Title</th>
              <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111] hidden sm:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111] hidden md:table-cell">Published</th>
              <th className="text-right px-4 py-3 font-semibold font-sans text-[#111111]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#6b7280]">
                  No posts found.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="hover:bg-[#f0f4f8]/50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#111111] line-clamp-1">{post.title}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge
                      className={
                        post.status === "published"
                          ? "bg-green-50 text-green-700 border-0"
                          : "bg-[#f0f4f8] text-[#6b7280] border-0"
                      }
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[#6b7280]">
                    {post.published_at ? formatDate(post.published_at) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete &ldquo;{post.title}&rdquo;. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              disabled={deleting === post.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleting === post.id ? "Deleting…" : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
