"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n-config";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Get current locale
  const currentLocale = pathname.split("/")[1] as Locale || i18n.defaultLocale;

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);
    
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    
    router.push(newPath);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#888] hover:text-[#EDEDED] hover:bg-[rgba(255,255,255,0.05)] transition-all border border-transparent hover:border-[#1E1E1E]"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-lg border border-[#1E1E1E] bg-[#0A0A0A] shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          {i18n.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={cn(
                "flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors",
                currentLocale === locale
                  ? "bg-[rgba(62,207,142,0.1)] text-[#3ECF8E]"
                  : "text-[#888] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#EDEDED]"
              )}
            >
              {locale === "en" && "English"}
              {locale === "hi" && "Hindi"}
              {locale === "es" && "Spanish"}
              {locale === "fr" && "French"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
