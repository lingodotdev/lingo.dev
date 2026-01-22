"use client";

import { useState, useEffect } from "react";
import { SUPPORTED_LANGUAGES } from "../../../config/lingo-config/index.js";
import { Globe } from "lucide-react";

export default function LanguageSelector({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === value) ||
    SUPPORTED_LANGUAGES[0];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".language-selector")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={`relative language-selector ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect hover:bg-white/10 smooth-transition"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedLang.flag} {selectedLang.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 glass-effect rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          <div className="p-3 border-b border-white/10">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`w-full px-4 py-3 text-left hover:bg-white/10 smooth-transition flex items-center gap-3 ${
                  lang.code === value ? "bg-primary/20" : ""
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
