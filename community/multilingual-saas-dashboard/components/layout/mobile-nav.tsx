"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { useTranslation } from "@/i18n";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileNav({ isOpen, onClose, onLogout }: MobileNavProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 w-72 bg-[var(--bg-secondary)] shadow-soft-xl dark:shadow-dark-lg transition-transform duration-300 ease-gentle">
        <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--border-subtle)]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">Lingo Dashboard</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-200"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl
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

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-200 ease-gentle"
          >
            <LogOut className="w-5 h-5" />
            {t("common.logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
