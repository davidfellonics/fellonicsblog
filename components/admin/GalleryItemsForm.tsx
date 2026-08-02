"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/types";

interface Props {
  initialItems: GalleryItem[];
}

const EMPTY = { title: "", image_url: "", alt_text: "", body: "", display_order: 0 };

export default function GalleryItemsForm({ initialItems }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function startEdit(item: GalleryItem) {
    setEditingId(item.id);
    setForm({ title: item.title, image_url: item.image_url, alt_text: item.alt_text, body: item.body, display_order: item.display_order });
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url.trim()) return;
    setStatus("saving");
    setErrorMsg("");

    const isEditing = editingId !== null;
    const res = await fetch("/api/gallery-items", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...form }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMsg(json.error ?? "Something went wrong.");
      return;
    }

    const { item } = await res.json();
    setItems(prev =>
      isEditing
        ? prev.map(i => i.id === item.id ? item as GalleryItem : i).sort((a, b) => a.display_order - b.display_order)
        : [...prev, item as GalleryItem].sort((a, b) => a.display_order - b.display_order)
    );
    setForm(EMPTY);
    setEditingId(null);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  }

  async function handleDelete(id: string) {
    await fetch("/api/gallery-items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-5">
        <h2 className="text-lg font-semibold font-sans text-[#111111]">
          {editingId ? "Edit Gallery Item" : "New Gallery Item"}
        </h2>

        <div className="space-y-1">
          <label className="block text-sm font-medium font-sans text-[#374151]">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder="e.g. Composition 56"
            required
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium font-sans text-[#374151]">
            Image URL <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-[#6b7280] font-sans">
            Use <code className="bg-[#f3f4f6] px-1 rounded">/gallery/filename.png</code> for images in the public/gallery folder, or any full URL.
          </p>
          <input
            type="text"
            value={form.image_url}
            onChange={e => set("image_url", e.target.value)}
            placeholder="e.g. /gallery/composition-56.png"
            required
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium font-sans text-[#374151]">
            Alt text <span className="text-[#9ca3af] font-normal">(optional — describes the image for accessibility)</span>
          </label>
          <input
            type="text"
            value={form.alt_text}
            onChange={e => set("alt_text", e.target.value)}
            placeholder="e.g. Diagram showing the dual series of Platonic solids"
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium font-sans text-[#374151]">Body text</label>
          <p className="text-xs text-[#6b7280] font-sans">
            Markdown supported — <code className="bg-[#f3f4f6] px-1 rounded">**bold**</code>{" "}
            <code className="bg-[#f3f4f6] px-1 rounded">*italic*</code>{" "}
            <code className="bg-[#f3f4f6] px-1 rounded">- list item</code>{" "}
            <code className="bg-[#f3f4f6] px-1 rounded">## Heading</code>. Blank line = new paragraph.
          </p>
          <textarea
            value={form.body}
            onChange={e => set("body", e.target.value)}
            rows={10}
            placeholder="Enter descriptive text for this gallery item..."
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] resize-y"
          />
        </div>

        <div className="space-y-1 w-32">
          <label className="block text-sm font-medium font-sans text-[#374151]">Display order</label>
          <input
            type="number"
            value={form.display_order}
            onChange={e => set("display_order", parseInt(e.target.value) || 0)}
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : editingId ? "Update Item" : "Add Item"}
          </Button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-sm text-[#6b7280] font-sans hover:text-[#111] transition-colors">
              Cancel
            </button>
          )}
          {status === "success" && <span className="text-sm text-green-600 font-sans">Saved successfully.</span>}
          {status === "error" && <span className="text-sm text-red-600 font-sans">{errorMsg}</span>}
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold font-sans text-[#111111] mb-4">Items ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-sm text-[#6b7280] font-sans">No items yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-4 bg-white border border-[#e5e7eb] rounded-lg px-4 py-3">
                <div className="min-w-0">
                  <p className="font-sans font-medium text-sm text-[#111]">
                    <span className="text-[#9ca3af] mr-2">#{item.display_order}</span>
                    {item.title}
                  </p>
                  <p className="text-xs text-[#9ca3af] font-sans mt-0.5">{item.image_url}</p>
                  {item.body && (
                    <p className="text-xs text-[#9ca3af] font-sans mt-0.5 truncate max-w-xl">{item.body.slice(0, 100)}…</p>
                  )}
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button type="button" onClick={() => startEdit(item)} className="text-xs text-[#1a3a5c] hover:text-[#b8862a] font-sans transition-colors">Edit</button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="text-xs text-red-500 hover:text-red-700 font-sans transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
