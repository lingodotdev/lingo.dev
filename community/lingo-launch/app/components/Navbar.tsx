'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe, Moon, Sun, LogOut, LogIn, LayoutDashboard } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import { getCurrentUser, logout } from '@/app/lib/storage';
import type { User } from '@/app/lib/storage';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="h-6 w-6 text-chart-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold text-foreground">LingoLaunch</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {mounted && user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-secondary"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {mounted && <LanguageSwitcher />}

            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}

            {mounted && (
              user ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md hover:bg-secondary transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
