"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Search, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/background", label: "Background" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setOpen(false);
      setQuery("");
    }
  }

  function openSearch() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 40);
  }

  function closeSearch() {
    setOpen(false);
    setQuery("");
  }

  return (
    <header className="sticky top-0 z-40 bg-[#f9f6f2]/95 backdrop-blur-sm border-b border-[#ddd5c8]">
      <div className="mx-4 sm:mx-[100px] h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-serif text-[22px] text-[#0f2240] tracking-tight hover:text-[#b8862a] transition-colors duration-200 flex-shrink-0"
        >
          Ffellonics
        </Link>

        <div className="flex items-center gap-5 sm:gap-7 min-w-0">
          {/* Nav links — hidden on small screens when search is open */}
          <nav className={`flex items-center gap-5 sm:gap-7 ${open ? "hidden sm:flex" : "flex"}`}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-sans uppercase tracking-widest text-[#7c6f64] hover:text-[#0f2240] transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          {open ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-b border-[#0f2240] pb-0.5 flex-1 sm:flex-none"
            >
              <Search size={14} className="text-[#7c6f64] flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                placeholder="Search posts and pages…"
                className="w-40 sm:w-56 text-xs font-sans text-[#0f2240] bg-transparent outline-none placeholder:text-[#9d9186]"
                aria-label="Search posts and pages"
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="text-[#9d9186] hover:text-[#0f2240] transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search posts"
              className="text-[#7c6f64] hover:text-[#0f2240] transition-colors duration-200 flex-shrink-0"
            >
              <Search size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
