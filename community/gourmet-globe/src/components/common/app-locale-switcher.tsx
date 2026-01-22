"use client";

import { LocaleSwitcher } from "lingo.dev/react/client";
import { usePathname } from "next/navigation";

export default function AppLocaleSwitcher() {
  const pathname = usePathname();
  const isRootPage = pathname === "/";

  return (
    <div className="absolute top-2 right-3 z-50 flex flex-col items-center">
      <LocaleSwitcher
        locales={["en", "hi", "ja", "fr", "es", "ar"]}
        className="border border-gray-800 rounded-md p-2 text-white bg-primary cursor-pointer hover:bg-primary/80 transition-colors"
      />
      {isRootPage && (
        <>
          <Arrow />
          <span className="text-xs text-primary" data-lingo-skip>
            Lingo.dev Compiler
          </span>
        </>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg
      className="mt-2 mb-1"
      width="30"
      height="40"
      viewBox="0 0 30 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 35 Q25 25 15 5"
        stroke="#69e300"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="#69e300" />
        </marker>
      </defs>
    </svg>
  );
}
