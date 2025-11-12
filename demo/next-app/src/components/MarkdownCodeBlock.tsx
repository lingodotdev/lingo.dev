"use client";

import React, { useMemo } from "react";
import CopyButton from "@/components/ui/CopyButton";

/**
 * Code block with top-right copy affordance.
 * Keep styling minimal so it works in both markdown and terminal-like blocks.
 */
export default function MarkdownCodeBlock({
  code,
  language = "bash",
}: {
  code: string;
  language?: string;
}) {
  const clean = useMemo(() => (code ?? "").replace(/\n+$/, ""), [code]);

  return (
    <div className="relative">
      {/* Copy button pinned to the corner */}
      <div className="absolute right-2 top-2 z-10">
        <CopyButton text={clean} />
      </div>

      {/* The actual code */}
      <pre
        aria-label={`code-block-${language}`}
        className="overflow-x-auto rounded-lg border border-black/10 bg-black/90 p-4 text-[13px] leading-5 text-white"
      >
        <code>{clean}</code>
      </pre>
    </div>
  );
}
