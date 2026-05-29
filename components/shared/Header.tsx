import Link from "next/link";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-[22px] font-bold font-sans text-[#111111] tracking-tight hover:text-[#1a3a5c] transition-colors"
        >
          FFellonics
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm font-sans text-[#6b7280] hover:text-[#111111] transition-colors"
          >
            About
          </Link>
          <Link
            href="/#search"
            aria-label="Search posts"
            className="text-[#6b7280] hover:text-[#1a3a5c] transition-colors"
          >
            <Search size={18} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
