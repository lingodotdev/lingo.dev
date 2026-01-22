"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { useTranslation } from "@/i18n";

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t("sidebar.dashboard"),
    },
    {
      href: "/dashboard/users",
      icon: Users,
      label: t("sidebar.users"),
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: t("sidebar.settings"),
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)]">
      <div className="flex items-center h-16 px-6 border-b border-[var(--border-subtle)]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center shadow-soft-sm">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)]">Lingo Dashboard</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200 ease-gentle
                ${
                  active
                    ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--border-subtle)]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-200 ease-gentle"
        >
          <LogOut className="w-5 h-5" />
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}
