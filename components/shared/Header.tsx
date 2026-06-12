import Link from "next/link";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#f9f6f2]/95 backdrop-blur-sm border-b border-[#ddd5c8]">
      <div className="mx-4 sm:mx-[100px] h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-[22px] text-[#0f2240] tracking-tight hover:text-[#b8862a] transition-colors duration-200"
        >
          Ffellonics
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/#search"
            aria-label="Search posts"
            className="text-[#7c6f64] hover:text-[#0f2240] transition-colors duration-200"
          >
            <Search size={18} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
