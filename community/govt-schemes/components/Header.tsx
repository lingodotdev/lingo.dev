"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Bot, MessageCircle, Database, Menu, X } from "lucide-react";

interface HeaderProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onOpenChat: () => void;
}

export function Header({
  isScrolled,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onOpenChat,
}: HeaderProps) {
  const navItems = [
    { href: "#features", label: <>Features</> },
    { href: "#languages", label: <>Languages</> },
    { href: "#schemes", label: <>Schemes</> },
  ];

  const handleOpenChat = () => {
    setIsMobileMenuOpen(false);
    onOpenChat();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800"
            : "bg-white/0 border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#4299eb" }}
            >
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-900 dark:text-white"
                    : "text-white drop-shadow-lg"
                }`}
              >
                SchemeSaathi
              </h1>
              <p
                className={`text-xs transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-white/90 drop-shadow-md"
                }`}
              >
                <>Government Schemes Simplified</>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-600 hover:text-[#4299eb] dark:text-gray-300 dark:hover:text-blue-400"
                  : "text-white/90 hover:text-white drop-shadow-md"
              }`}
            >
              <>Features</>
            </Link>
            <Link
              href="#languages"
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-600 hover:text-[#4299eb] dark:text-gray-300 dark:hover:text-blue-400"
                  : "text-white/90 hover:text-white drop-shadow-md"
              }`}
            >
              <>Languages</>
            </Link>
            <Link
              href="#schemes"
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-600 hover:text-[#4299eb] dark:text-gray-300 dark:hover:text-blue-400"
                  : "text-white/90 hover:text-white drop-shadow-md"
              }`}
            >
              <>Schemes</>
            </Link>
            <LanguageSelector isScrolled={isScrolled} />
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-all duration-300 ${
                isScrolled
                  ? "border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                  : "border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {/* <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#4299eb" }}
              >
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  SchemeSaathi
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Government Schemes Simplified
                </p>
              </div> */}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#4299eb] dark:hover:text-blue-400 transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}

              {/* Settings Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Settings
                </h3>
                <div className="space-y-4">
                  {/* Language Selector in Mobile Menu */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Language
                    </span>
                    <LanguageSelector isScrolled={true} />
                  </div>

                  {/* Theme Toggle in Mobile Menu */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              {/* Mobile WhatsApp Actions */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Quick Actions
                </h3>
                <Button
                  className="w-full justify-start text-left bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleOpenChat}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
