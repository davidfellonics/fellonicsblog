"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { GlossaryEntry } from "@/types";

interface Props {
  initialEntries: GlossaryEntry[];
}

export default function GlossaryForm({ initialEntries }: Props) {
  const [term, setTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [entries, setEntries] = useState<GlossaryEntry[]>(initialEntries);
  const [editingId, setEditingId] = useState<string | null>(null);

  function startEdit(entry: GlossaryEntry) {
    setEditingId(entry.id);
    setTerm(entry.term);
    setDateRange(entry.date_range ?? "");
    setBody(entry.body);
    setStatus("idle");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setTerm("");
    setDateRange("");
    setBody("");
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim() || !body.trim()) return;
    setStatus("saving");
    setErrorMsg("");

    const isEditing = editingId !== null;
    const res = await fetch("/api/glossary", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, term: term.trim(), date_range: dateRange.trim() || null, body: body.trim() }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMsg(json.error ?? "Something went wrong.");
      return;
    }

    const { entry } = await res.json();
    setEntries((prev) =>
      isEditing
        ? prev.map(e => e.id === entry.id ? entry as GlossaryEntry : e).sort((a, b) => a.term.localeCompare(b.term))
        : [entry as GlossaryEntry, ...prev].sort((a, b) => a.term.localeCompare(b.term))
    );
    setTerm("");
    setDateRange("");
    setBody("");
    setEditingId(null);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  }

  async function handleDelete(id: string) {
    await fetch("/api/glossary", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-10">
      {/* Data entry form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-5">
        <h2 className="text-lg font-semibold font-sans text-[#111111]">
          {editingId ? "Edit Glossary Entry" : "New Glossary Entry"}
        </h2>

        <div className="space-y-1">
          <label className="block text-sm font-medium font-sans text-[#374151]">
            Term <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. Newton, Isaac  or  Free Energy Principle"
            required
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium font-sans text-[#374151]">
            Date / Period{" "}
            <span className="text-[#9ca3af] font-normal">(optional — for people, e.g. 1643–1727)</span>
          </label>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="e.g. (1643–1727)"
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium font-sans text-[#374151]">
            Body text <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-[#6b7280] font-sans">
            Separate paragraphs with a blank line. The entry will appear on the Glossary page
            alphabetically by Term.
          </p>
          <p className="text-xs text-[#6b7280] font-sans mt-1">
            To link to another Glossary entry, use{" "}
            <code className="bg-[#f3f4f6] px-1 rounded">[word](#anchor)</code> — for example{" "}
            <code className="bg-[#f3f4f6] px-1 rounded">[Platonic Solids](#platonic-solids)</code>{" "}
            or <code className="bg-[#f3f4f6] px-1 rounded">[Teleology](#teleology)</code>.
            The anchor is the term lowercased with spaces replaced by hyphens.
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={12}
            placeholder="Enter the glossary entry text here..."
            className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-sans text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] resize-y"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : editingId ? "Update Entry" : "Add Entry"}
          </Button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-sm text-[#6b7280] font-sans hover:text-[#111] transition-colors">
              Cancel
            </button>
          )}
          {status === "success" && (
            <span className="text-sm text-green-600 font-sans">
              {editingId ? "Entry updated." : "Entry added successfully."}
            </span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-600 font-sans">{errorMsg}</span>
          )}
        </div>
      </form>

      {/* Existing entries */}
      <div>
        <h2 className="text-lg font-semibold font-sans text-[#111111] mb-4">
          Entries ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <p className="text-sm text-[#6b7280] font-sans">No entries yet. Add your first entry above.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-4 bg-white border border-[#e5e7eb] rounded-lg px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-sans font-medium text-sm text-[#111]">
                    {entry.term}
                    {entry.date_range && (
                      <span className="ml-2 text-[#6b7280] font-normal">{entry.date_range}</span>
                    )}
                  </p>
                  <p className="text-xs text-[#9ca3af] font-sans mt-0.5 truncate max-w-xl">
                    {entry.body.slice(0, 120)}…
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(entry)}
                    className="text-xs text-[#1a3a5c] hover:text-[#b8862a] font-sans transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-sans transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
