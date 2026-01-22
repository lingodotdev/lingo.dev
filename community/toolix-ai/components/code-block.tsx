"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const language = className?.replace("language-", "") || "text";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-muted/30 border-b border-border/50 px-4 py-2 rounded-t-lg">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 lg:opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="size-3 mr-1" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3 mr-1" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.5rem 0.5rem",
          border: "1px solid hsl(var(--border) / 0.5)",
          borderTop: "none",
          fontSize: "0.75rem",
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-geist-mono), monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
