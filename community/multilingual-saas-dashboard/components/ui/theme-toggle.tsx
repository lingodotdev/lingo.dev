"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg
        bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        transition-all duration-200 ease-gentle
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]
        ${className}
      `}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-300 ease-spring
            ${theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"}
          `}
        />
        <Moon
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-300 ease-spring
            ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}
          `}
        />
      </div>
    </button>
  );
}
