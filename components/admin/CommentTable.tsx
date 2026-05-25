"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils/formatDate";
import type { CommentWithPost } from "@/types";

interface CommentTableProps {
  comments: CommentWithPost[];
}

type Status = "pending" | "approved" | "rejected";

export default function CommentTable({ comments: initialComments }: CommentTableProps) {
  const [comments, setComments] = useState(initialComments);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState<Set<string>>(new Set());

  async function updateStatus(ids: string[], status: Status) {
    setUpdating(new Set(ids));
    const supabase = createClient();
    await supabase.from("comments").update({ status } as never).in("id", ids);
    setComments((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, status } : c))
    );
    setSelected(new Set());
    setUpdating(new Set());
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleAll(ids: string[]) {
    if (ids.every((id) => selected.has(id))) {
      setSelected((prev) => { const next = new Set(prev); ids.forEach((id) => next.delete(id)); return next; });
    } else {
      setSelected((prev) => { const next = new Set(prev); ids.forEach((id) => next.add(id)); return next; });
    }
  }

  const renderTable = (rows: CommentWithPost[]) => {
    const rowIds = rows.map((r) => r.id);
    const allChecked = rowIds.length > 0 && rowIds.every((id) => selected.has(id));
    const anySelected = rowIds.some((id) => selected.has(id));

    return (
      <div>
        {anySelected && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-[#6b7280]">{rowIds.filter((id) => selected.has(id)).length} selected</span>
            <Button size="sm" variant="outline" onClick={() => updateStatus(rowIds.filter((id) => selected.has(id)), "approved")}>
              Bulk approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => updateStatus(rowIds.filter((id) => selected.has(id)), "rejected")}
              className="text-destructive hover:text-destructive">
              Bulk reject
            </Button>
          </div>
        )}
        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f0f4f8]">
              <tr>
                <th className="px-4 py-3 w-8">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={() => toggleAll(rowIds)}
                    aria-label="Select all"
                  />
                </th>
                <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111]">Post</th>
                <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111] hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111]">Comment</th>
                <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111] hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold font-sans text-[#111111] hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-semibold font-sans text-[#111111]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6b7280]">No comments.</td>
                </tr>
              ) : (
                rows.map((comment) => (
                  <tr key={comment.id} className="hover:bg-[#f0f4f8]/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.has(comment.id)}
                        onCheckedChange={() => toggleSelect(comment.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6b7280] max-w-[120px] truncate">
                      {comment.post?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-xs">
                        <p className="font-medium text-[#111111]">{comment.author_name}</p>
                        <p className="text-[#6b7280]">{comment.author_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="truncate text-xs text-[#111111]">{comment.content}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs text-[#6b7280]">
                      {formatDate(comment.created_at)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge className={
                        comment.status === "approved" ? "bg-green-50 text-green-700 border-0 text-xs" :
                        comment.status === "rejected" ? "bg-red-50 text-red-700 border-0 text-xs" :
                        "bg-yellow-50 text-yellow-700 border-0 text-xs"
                      }>
                        {comment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {comment.status !== "approved" && (
                          <Button size="sm" variant="outline" className="text-xs h-7"
                            disabled={updating.has(comment.id)}
                            onClick={() => updateStatus([comment.id], "approved")}>
                            Approve
                          </Button>
                        )}
                        {comment.status !== "rejected" && (
                          <Button size="sm" variant="outline" className="text-xs h-7 text-destructive hover:text-destructive"
                            disabled={updating.has(comment.id)}
                            onClick={() => updateStatus([comment.id], "rejected")}>
                            Reject
                          </Button>
                        )}
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
  };

  return (
    <Tabs defaultValue="pending">
      <TabsList className="mb-4">
        <TabsTrigger value="pending">Pending ({comments.filter((c) => c.status === "pending").length})</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>
      <TabsContent value="pending">{renderTable(comments.filter((c) => c.status === "pending"))}</TabsContent>
      <TabsContent value="approved">{renderTable(comments.filter((c) => c.status === "approved"))}</TabsContent>
      <TabsContent value="all">{renderTable(comments)}</TabsContent>
    </Tabs>
  );
}
