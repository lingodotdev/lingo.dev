"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLingoContext } from "@lingo.dev/compiler/react";
import { useRouter, usePathname } from "next/navigation";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export function LanguageSwitcher() {
  const { locale: currentLocale } = useLingoContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (localeCode: string) => {
    const segments = pathname.split("/");
    segments[1] = localeCode;
    router.push(segments.join("/"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-6 right-6 z-50"
    >
      <div className="glass rounded-2xl p-2 glow-purple">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 border-b border-white/10 mb-2">
          <Globe className="w-4 h-4" />
          <span>Select Language</span>
        </div>
        <div className="grid grid-cols-3 gap-1 max-h-64 overflow-y-auto p-1">
          {languages.map((lang) => {
            const isActive = currentLocale === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg transition-all text-center cursor-pointer
                  ${isActive
                    ? "bg-gradient-to-r from-purple-600/50 to-cyan-600/50 text-white"
                    : "hover:bg-white/10 text-gray-400 hover:text-white"
                  }
                `}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-xs truncate w-full">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
