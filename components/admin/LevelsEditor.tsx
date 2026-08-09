"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  initialContent: string;
}

export default function LevelsEditor({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "levels", content }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMsg(json.error ?? "Something went wrong.");
      return;
    }

    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4">
        <p className="text-xs text-[#6b7280] font-sans mb-3">
          Use Markdown to format the page. Examples:{" "}
          <code className="bg-[#f3f4f6] px-1 rounded">## Heading</code>{" "}
          <code className="bg-[#f3f4f6] px-1 rounded">**bold**</code>{" "}
          <code className="bg-[#f3f4f6] px-1 rounded">*italic*</code>{" "}
          <code className="bg-[#f3f4f6] px-1 rounded">- list item</code>.
          Separate paragraphs with a blank line.
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={30}
          className="w-full border border-[#d1d5db] rounded-md px-3 py-2 text-sm font-mono text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] resize-y"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Changes"}
        </Button>
        {status === "success" && (
          <span className="text-sm text-green-600 font-sans">Saved — Ffellonic Levels page updated.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-600 font-sans">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
