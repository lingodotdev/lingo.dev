"use client";

import { Menu, Bell, User } from "lucide-react";
import { useTranslation } from "@/i18n";
import { ThemeToggle } from "@/components/ui";

interface TopbarProps {
  onMenuClick: () => void;
  userName?: string;
}

export function Topbar({ onMenuClick, userName = "Admin" }: TopbarProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-200"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block lg:hidden">
            <span className="font-semibold text-[var(--text-primary)]">Lingo Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-200 relative"
            aria-label={t("topbar.notifications")}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-[var(--border-default)]">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[var(--text-primary)]">{userName}</p>
            </div>
            <div className="w-9 h-9 bg-[var(--accent-subtle)] rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--accent-text)]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
