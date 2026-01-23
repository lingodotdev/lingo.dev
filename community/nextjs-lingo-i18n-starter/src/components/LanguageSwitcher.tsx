"use client";

import { usePathname, useRouter } from "next/navigation";
import { languages } from "@/lib/i18n";

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(newLang: string) {
    // pathname example: /en/about
    const segments = pathname.split("/").filter(Boolean); // ["en", "about"]
    segments[0] = newLang; // replace lang segment
    router.push("/" + segments.join("/"));
  }

  return (
    <select
      value={lang}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded-md border border-white/15 bg-black px-2 py-1 text-sm text-white outline-none"
    >
      {languages.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
