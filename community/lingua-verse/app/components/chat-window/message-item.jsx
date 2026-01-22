"use client";

import { Languages } from "lucide-react";

export default function MessageItem({ message, isOwn }) {
  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}
      >
        {/* Username and language indicator */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs font-medium text-muted-foreground">
            {message.username}
          </span>
          {message.isTranslated && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Languages className="w-3 h-3" />
              <span>Translated</span>
            </div>
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOwn ? "gradient-bg text-white" : "glass-effect"
          } smooth-transition hover:scale-[1.02]`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground px-2">
          {formattedTime}
        </span>

        {/* Original text tooltip (if translated) */}
        {message.isTranslated && message.originalText && (
          <div className="px-2 text-xs text-muted-foreground italic">
            Original: "{message.originalText}"
          </div>
        )}
      </div>
    </div>
  );
}
