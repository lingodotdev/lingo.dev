"use client";

import { Globe } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "./language-selector";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  isTranslating: boolean;
}

export function Header({
  selectedLanguage,
  onLanguageChange,
  isTranslating,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Lingo Daily</h1>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            isTranslating={isTranslating}
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
