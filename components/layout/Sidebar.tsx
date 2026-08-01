"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  GitCompareArrows,
  LayoutDashboard,
  MessageCircle,
  Network,
  Settings,
  Upload,
} from "lucide-react";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload data", icon: Upload },
  { href: "/analysis", label: "Analysis", icon: BarChart3 },
  { href: "/comparison", label: "Compare", icon: GitCompareArrows },
  { href: "/graph", label: "Network graph", icon: Network },
  { href: "/chat", label: "Nexus AI", icon: MessageCircle },
];

export function Sidebar() {
  // Next.js gives us the current URL path in the browser.
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-800 bg-slate-950 px-5 py-7 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-lg font-black text-slate-950">
          S
        </span>

        <span>
          <span className="block font-bold text-white">Sahakari Nexus</span>
          <span className="block text-[10px] tracking-[0.16em] text-slate-500">
            COOPERATIVE INTELLIGENCE
          </span>
        </span>
      </Link>

      <nav className="mt-10 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          AI confidence
        </p>

        <p className="mt-2 text-3xl font-bold text-white">94.2%</p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Based on the latest cooperative data.
        </p>
      </div>

      <Link
        href="/settings"
        className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
      >
        <Settings size={18} />
        Settings
      </Link>
    </aside>
  );
}