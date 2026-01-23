// LanguageSwitcher/index.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";

import { locales } from "./types";

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get current locale info
  const currentLocaleInfo =
    locales.find((locale) => locale.code === currentLocale) || locales[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut to toggle language switcher (Ctrl/Cmd + L)
  useKeyboardShortcut(
    "l",
    () => {
      setIsOpen((prev) => {
        if (!prev) setFocusedIndex(0);
        return !prev;
      });
    },
    [],
  );

  const handleLocaleChange = useCallback(
    (localeCode: string) => {
      if (localeCode === currentLocale) {
        setIsOpen(false);
        return;
      }

      const segments = pathname.split("/");
      // Remove the locale segment (typically segments[1])
      if (segments[1] === currentLocale) {
        segments.splice(1, 1);
      }
      const pathWithoutLocale = segments.join("/") || "/";
      const newPath = `/${localeCode}${pathWithoutLocale}`;

      setIsOpen(false);
      setFocusedIndex(-1);
      router.push(newPath);
    },
    [currentLocale, pathname, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % locales.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + locales.length) % locales.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleLocaleChange(locales[focusedIndex].code);
        }
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(locales.length - 1);
        break;
      default:
        // Quick jump: press first letter of language name
        const key = e.key.toLowerCase();
        const index = locales.findIndex((l) =>
          l.name.toLowerCase().startsWith(key),
        );
        if (index !== -1) setFocusedIndex(index);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setFocusedIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="text-lg leading-none">{currentLocaleInfo.flag}</span>
        <span className="text-slate-700 font-medium">
          {currentLocaleInfo.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Keyboard hint */}
      <span className="hidden sm:inline-flex items-center ml-2 px-1.5 py-0.5 text-[10px] text-slate-400 bg-slate-100 rounded">
        ⌘L
      </span>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50"
          role="listbox"
          aria-activedescendant={
            focusedIndex >= 0
              ? `locale-${locales[focusedIndex].code}`
              : undefined
          }
        >
          <ul className="py-1">
            {locales.map((locale, index) => (
              <li key={locale.code}>
                <button
                  id={`locale-${locale.code}`}
                  role="option"
                  aria-selected={locale.code === currentLocale}
                  onClick={() => handleLocaleChange(locale.code)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onKeyDown={handleKeyDown}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-150 ${
                    focusedIndex === index ? "bg-slate-100" : ""
                  } ${
                    locale.code === currentLocale
                      ? "text-blue-600 font-medium"
                      : "text-slate-700"
                  } hover:bg-slate-100`}
                >
                  <span className="text-lg leading-none">{locale.flag}</span>
                  <span className="flex-1 text-left">{locale.name}</span>
                  {locale.code === currentLocale && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
