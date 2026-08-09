"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, X, Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/essays", label: "Essays" },
  { href: "/levels", label: "Ffellonic Levels" },
  { href: "/background", label: "Glossary" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setMenuOpen(false);
      setQuery("");
    }
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 40);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#f9f6f2]/95 backdrop-blur-sm border-b border-[#ddd5c8]">
        <div className="mx-4 sm:mx-[100px] h-16 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-serif text-[22px] text-[#0f2240] tracking-tight hover:text-[#b8862a] transition-colors duration-200 flex-shrink-0"
          >
            Ffellonics
          </Link>

          <div className="flex items-center gap-4 sm:gap-7 min-w-0">
            {/* Desktop nav — hidden on mobile */}
            <nav className={`hidden sm:flex items-center gap-7 ${searchOpen ? "hidden" : ""}`}>
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
            {searchOpen ? (
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

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="sm:hidden text-[#7c6f64] hover:text-[#0f2240] transition-colors duration-200 flex-shrink-0"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 top-16 z-30 bg-[#f9f6f2]/98 backdrop-blur-sm border-t border-[#ddd5c8]">
          <nav className="flex flex-col px-8 pt-8 pb-12 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-2xl text-[#0f2240] py-3 border-b border-[#ddd5c8] hover:text-[#b8862a] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
