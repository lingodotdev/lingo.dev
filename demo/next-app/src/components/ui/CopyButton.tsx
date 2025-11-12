"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Reusable copy-to-clipboard button with animated "Copied!" feedback.
 * - No external CSS or Tailwind config required.
 * - Respects prefers-reduced-motion.
 * - Safe clipboard fallback if navigator.clipboard is unavailable.
 */
export default function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  successDurationMs = 1500,
  className,
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  successDurationMs?: number;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), successDurationMs);
    } catch {
      // Non-fatal: we silently ignore copy failures for now.
    }
  }

  // Minimal inline styles to avoid editing Tailwind config
  const baseBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    lineHeight: "16px",
    cursor: "pointer",
    userSelect: "none",
    background: "rgba(0,0,0,0.04)",
    backdropFilter: "saturate(180%) blur(4px)",
    transition: prefersReducedMotion ? "none" : "transform 120ms ease, opacity 120ms ease",
  };

  const iconStyle: React.CSSProperties = { width: 14, height: 14 };

  const idleStyle: React.CSSProperties = {
    transition: prefersReducedMotion ? "none" : "opacity 120ms ease, transform 120ms ease",
    opacity: copied ? 0 : 1,
    transform: copied ? "translateY(-2px)" : "translateY(0)",
  };

  const copiedStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    transition: prefersReducedMotion ? "none" : "opacity 120ms ease, transform 120ms ease",
    opacity: copied ? 1 : 0,
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      aria-label={copied ? copiedLabel : label}
      className={className}
      style={baseBtn}
    >
      {/* Icon */}
      <span aria-hidden="true" style={iconStyle}>
        {copied ? (
          // Check icon
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          // Copy icon
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>

      {/* Animated label swap */}
      <span style={{ position: "relative", minWidth: 60, display: "inline-block" }}>
        <span style={idleStyle}>{label}</span>
        <span style={copiedStyle}>{copiedLabel}</span>
      </span>
    </button>
  );
}
