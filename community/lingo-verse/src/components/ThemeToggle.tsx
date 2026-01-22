"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { motion } from "framer-motion";
import { useEffect } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("lingo-verse-theme") as
      | "dark"
      | "light"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lingo-verse-theme", theme);
  }, [theme]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full glass p-1 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Track background */}
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          theme === "light"
            ? "bg-gradient-to-r from-amber-200 to-orange-300"
            : "bg-gradient-to-r from-slate-700 to-slate-800"
        }`}
      />

      {/* Sliding circle */}
      <motion.div
        className="relative w-6 h-6 rounded-full flex items-center justify-center shadow-md"
        animate={{
          x: theme === "dark" ? 0 : 22,
          backgroundColor: theme === "dark" ? "#1e293b" : "#fef3c7",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Sun icon */}
        <motion.svg
          className="w-4 h-4 text-amber-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          animate={{ 
            opacity: theme === "light" ? 1 : 0,
            rotate: theme === "light" ? 0 : -90,
            scale: theme === "light" ? 1 : 0.5,
          }}
          transition={{ duration: 0.2 }}
          style={{ position: "absolute" }}
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </motion.svg>

        {/* Moon icon */}
        <motion.svg
          className="w-4 h-4 text-slate-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          animate={{ 
            opacity: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : 90,
            scale: theme === "dark" ? 1 : 0.5,
          }}
          transition={{ duration: 0.2 }}
          style={{ position: "absolute" }}
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </motion.svg>
      </motion.div>
    </motion.button>
  );
}
