"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-[480px] mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] h-4 w-4 pointer-events-none" />
      <Input
        type="search"
        placeholder="Search posts…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-white border-[#e5e7eb] focus-visible:ring-[#1a3a5c]"
        aria-label="Search posts"
      />
    </div>
  );
}
