"use client";

import { useState, useRef, useEffect } from "react";
import {
  SUPPORTED_LANGUAGES,
  REGIONS,
  getLanguageByCode,
  type Language,
} from "@/lib/languages";

interface LanguageSelectorProps {
  sourceLanguage?: string;
  selectedLanguage?: string | null;
  onLanguageChange: (language: string | null) => void;
  disabled?: boolean;
}

export default function LanguageSelector({
  sourceLanguage,
  selectedLanguage: selectedLanguageProp,
  onLanguageChange,
  disabled = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    selectedLanguageProp || null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<string | null | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredLanguages = searchQuery
    ? SUPPORTED_LANGUAGES.filter(
        (lang) =>
          lang.code !== sourceLanguage &&
          (lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lang.code.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : [];

  const languagesByRegion = REGIONS.reduce(
    (acc, region) => {
      const languages = SUPPORTED_LANGUAGES.filter(
        (lang) => lang.region === region && lang.code !== sourceLanguage,
      );
      if (languages.length > 0) {
        acc[region] = languages;
      }
      return acc;
    },
    {} as Record<string, Language[]>,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && Object.keys(languagesByRegion).length > 0 && activeRegion === undefined) {
      setActiveRegion(Object.keys(languagesByRegion)[0]);
    }
  }, [isOpen, languagesByRegion, activeRegion]);

  const handleSelect = (languageCode: string | null) => {
    setSelectedLanguage(languageCode);
    setIsOpen(false);
    setSearchQuery("");
    onLanguageChange(languageCode);
  };

  useEffect(() => {
    setSelectedLanguage(selectedLanguageProp || null);
  }, [selectedLanguageProp]);

  const getSelectedDisplayText = () => {
    if (!selectedLanguage) return "Translate";
    const lang = getLanguageByCode(selectedLanguage);
    return lang ? lang.name : "Translate";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>{getSelectedDisplayText()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex">
          <div className="w-28 border-r flex flex-col">
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveRegion(null);
              }}
              className={`px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${
                !activeRegion && !searchQuery ? "bg-muted font-medium" : ""
              }`}
            >
              All
            </button>
            {Object.keys(languagesByRegion).map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSearchQuery("");
                  setActiveRegion(region);
                }}
                className={`px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${
                  activeRegion === region ? "bg-muted font-medium" : ""
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveRegion(null);
                }}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto flex-1">
              {searchQuery ? (
                filteredLanguages.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No languages found
                  </div>
                ) : (
                  filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-muted-foreground ml-2">
                        ({lang.name})
                      </span>
                    </button>
                  ))
                )
              ) : activeRegion ? (
                <>
                  <button
                    onClick={() => handleSelect(null)}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors border-b font-medium"
                  >
                    Original
                  </button>
                  {languagesByRegion[activeRegion]?.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-muted-foreground ml-2">
                        ({lang.name})
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSelect(null)}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors border-b font-medium"
                  >
                    Original
                  </button>
                  {SUPPORTED_LANGUAGES.filter(
                    (lang) => lang.code !== sourceLanguage,
                  ).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-muted-foreground ml-2">
                        ({lang.name})
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
