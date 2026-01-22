"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Topbar, MobileNav } from "@/components/layout";
import { useAuthMock } from "@/hooks";
import { useTranslation } from "@/i18n";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useAuthMock();
  const { t } = useTranslation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleMenuClick = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const handleCloseNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-[var(--text-secondary)]">{t("common.loading")}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar onLogout={logout} />
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={handleCloseNav}
        onLogout={logout}
      />

      <div className="lg:pl-64">
        <Topbar onMenuClick={handleMenuClick} userName={user?.name} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
