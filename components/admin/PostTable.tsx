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
import { formatDateTime } from "@/lib/utils/formatDate";
import type { Post } from "@/types";

type SortField = "title" | "status" | "published_at";
type SortDir = "asc" | "desc";

interface PostTableProps {
  posts: Post[];
}

export default function PostTable({ posts: initialPosts }: PostTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("published_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // Date columns default to newest-first; text columns default to A→Z
      setSortDir(field === "published_at" ? "desc" : "asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return (
        <svg className="ml-1 w-3.5 h-3.5 text-[#9ca3af]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 3v10M8 3l-3 3M8 3l3 3M8 13l-3-3M8 13l3-3" />
        </svg>
      );
    return (
      <svg className="ml-1 w-3.5 h-3.5 text-[#1a3a5c]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        {sortDir === "asc"
          ? <path d="M8 13V3M8 3L5 6M8 3l3 3" />
          : <path d="M8 3v10M8 13L5 10M8 13l3-3" />}
      </svg>
    );
  }

  const filtered = query.trim()
    ? posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : posts;

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === "title") {
      cmp = a.title.localeCompare(b.title);
    } else if (sortField === "status") {
      cmp = (a.status ?? "").localeCompare(b.status ?? "");
    } else {
      const aTime = a.published_at ? new Date(a.published_at).getTime() : 0;
      const bTime = b.published_at ? new Date(b.published_at).getTime() : 0;
      cmp = aTime - bTime;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  async function handleDelete(id: string) {
    setDeleting(id);
    const supabase = createClient();
    const post = posts.find((p) => p.id === id);
    await supabase.from("posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: post?.slug }),
    }).catch(() => {});
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
              <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111]">
                <button onClick={() => handleSort("title")} className="flex items-center gap-0.5 cursor-pointer hover:text-[#1a3a5c] select-none transition-colors">
                  Title<SortIcon field="title" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111] hidden sm:table-cell">
                <button onClick={() => handleSort("status")} className="flex items-center gap-0.5 cursor-pointer hover:text-[#1a3a5c] select-none transition-colors">
                  Status<SortIcon field="status" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111] hidden md:table-cell">
                <button onClick={() => handleSort("published_at")} className="flex items-center gap-0.5 cursor-pointer hover:text-[#1a3a5c] select-none transition-colors">
                  Published<SortIcon field="published_at" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-semibold font-sans text-[#111111]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#6b7280]">
                  No posts found.
                </td>
              </tr>
            ) : (
              sorted.map((post) => (
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
                    {post.published_at ? formatDateTime(post.published_at) : "—"}
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
