"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Database,
  HardDrive,
  BarChart3,
  BookOpen,
  Settings,
} from "lucide-react";
import { i18n, Locale } from "@/lib/i18n-config";

import { t } from "@/lib/demo-dictionary";

export function Sidebar() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] as Locale) || i18n.defaultLocale;

  const navItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: `/${currentLocale}`,
    },
    {
      label: "Database",
      icon: Database,
      href: `/${currentLocale}/database`,
    },
    {
      label: "Storage",
      icon: HardDrive,
      href: `/${currentLocale}/storage`,
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: `/${currentLocale}/analytics`,
    },
    {
      label: "Documentation",
      icon: BookOpen,
      href: `/${currentLocale}/docs`,
    },
  ];

  return (
    <aside className="fixed top-0 left-0 z-50 h-screen w-[260px] border-r border-[#1E1E1E] bg-[#050505] flex flex-col transition-transform duration-300">
      <div className="flex h-[56px] items-center px-4 border-b border-[#1E1E1E]">
        <div className="h-6 w-6 rounded bg-[#3ECF8E]" />
        <span className="ml-3 text-lg font-bold text-[#EDEDED] tracking-tight">
          urBackend
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-[#555]">
          {t("Platform", currentLocale)}
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${currentLocale}` && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[rgba(62,207,142,0.1)] text-[#3ECF8E]"
                      : "text-[#888] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#EDEDED]"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {t(item.label, currentLocale)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 mb-2 px-2 text-xs font-bold uppercase tracking-wider text-[#555]">
          {t("Settings", currentLocale)}
        </div>
        <ul className="space-y-1">
          <li>
            <Link
              href={`/${currentLocale}/settings`}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[#888] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#EDEDED] transition-all"
            >
              <Settings className="h-4 w-4" />
              {t("Project Settings", currentLocale)}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-[#1E1E1E]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#3ECF8E] to-blue-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#EDEDED]">Lingo Dev</span>
            <span className="text-xs text-[#888]">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
