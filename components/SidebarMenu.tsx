 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const dashboardLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Recent files", href: "/dashboard/recent" },
  { label: "Favorites", href: "/dashboard/favorites" },
  { label: "Security", href: "/dashboard/security" }
];

export function SidebarMenu() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-100 bg-white/80 px-4 py-6 md:block">
      <nav className="space-y-1 text-sm font-medium text-slate-600">
        {dashboardLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-slate-50 hover:text-slate-900",
              pathname === link.href && "bg-slate-900 text-white"
            )}
          >
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
