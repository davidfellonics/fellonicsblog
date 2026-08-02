"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FilePlus, MessageSquare, BookOpen, FileText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  pendingComments?: number;
}

export default function AdminSidebar({ pendingComments = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts/new", label: "New Post", icon: FilePlus },
    { href: "/admin/comments", label: "Comments", icon: MessageSquare, badge: pendingComments },
    { href: "/admin/glossary", label: "Glossary Data", icon: BookOpen },
    { href: "/admin/about", label: "About Page", icon: FileText },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-[#e5e7eb] flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-[#e5e7eb]">
        <p className="font-bold font-sans text-[#111111] text-sm">FFellonics Admin</p>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-5 py-2.5 text-sm font-sans transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-[#f0f4f8] text-[#1a3a5c] font-medium"
                : "text-[#6b7280] hover:text-[#111111] hover:bg-[#f0f4f8]"
            )}
          >
            <Icon size={16} />
            {label}
            {badge != null && badge > 0 && (
              <span className="ml-auto bg-[#1a3a5c] text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-[#e5e7eb]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 text-sm text-[#6b7280] hover:text-[#111111] transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
