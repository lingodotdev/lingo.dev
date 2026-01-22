"use client";

import {
  Bot,
  User,
  BadgeCheck,
  AlertTriangle,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Shimmer } from "./ai-elements/shimmer";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
} from "./ai-elements/sources";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";
import { markdownComponents, markdownPlugins } from "./markdown-config";
import { safeJsonParse } from "@/lib/chat-utils";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useState } from "react";

interface ChatMessageProps {
  message: UIMessage;
  sendMessage: (message: { text: string }) => void;
  isStreaming?: boolean;
  isEditing?: boolean;
  onStartEdit?: (messageId: string, currentText: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (messageId: string, newText: string) => void;
}

export function ChatMessage({
  message,
  sendMessage,
  isStreaming = false,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: ChatMessageProps) {
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [localEditText, setLocalEditText] = useState("");
  const [originalText, setOriginalText] = useState("");

  const handleStartEdit = () => {
    const currentText = message.parts
      .filter((p) => p.type === "text")
      .map((part) => part.text)
      .join("");
    setLocalEditText(currentText);
    setOriginalText(currentText);
    onStartEdit?.(message.id, currentText);
  };

  const handleSaveEdit = () => {
    if (localEditText.trim() && localEditText !== originalText) {
      onSaveEdit?.(message.id, localEditText.trim());
    } else {
      onCancelEdit?.();
    }
  };

  const handleCancelEdit = () => {
    setLocalEditText("");
    setOriginalText("");
    onCancelEdit?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={`flex gap-3 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role !== "user" && (
        <Avatar className="size-8 border border-border/50 shadow-sm hidden md:block">
          <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5">
            <Bot className="size-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} group max-w-[90vw]`}
      >
        <div
          className={`space-y-2 overflow-hidden break-words ${
            isEditing && message.role === "user"
              ? "w-full max-w-4xl bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-md"
              : message.role === "user"
                ? "w-full max-w-sm sm:max-w-md md:max-w-2xl bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-md"
                : "w-full max-w-sm sm:max-w-md md:max-w-2xl bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3"
          }`}
        >
          {isEditing && message.role === "user" ? (
            <div className="space-y-2 w-full">
              <textarea
                value={localEditText}
                onChange={(e) => setLocalEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed min-h-[10rem] max-h-[25rem]"
                autoFocus
                rows={Math.max(6, localEditText.split("\n").length)}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="p-1 rounded-md hover:bg-primary-foreground/10 transition-colors"
                  title="Cancel edit"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="p-1 rounded-md hover:bg-primary-foreground/10 transition-colors"
                  title="Save edit"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            (() => {
              const textParts = message.parts.filter((p) => p.type === "text");
              const text = textParts.map((part) => part.text).join("");

              const progressParts = message.parts.filter(
                (p) => p.type === "data-progress",
              );
              const otherParts = message.parts.filter(
                (p) => p.type !== "data-progress",
              );
              const sortedParts = [...progressParts, ...otherParts];

              const toolParts: React.ReactNode[] = [];
              const mainParts: React.ReactNode[] = [];

              if (message.role === "assistant" && text) {
                mainParts.push(
                  <ThemeProvider key={`${message.id}-c1`} mode="dark">
                    <C1Component
                      isStreaming={isStreaming}
                      c1Response={text}
                      onAction={(e: any) => {
                        if (e.type === "open_url" && e.params?.url) {
                          if (
                            e.params.url.includes("cloudinary") ||
                            e.params.url.includes("res.cloudinary.com")
                          ) {
                            setCurrentImageUrl(e.params.url);
                            setPhotoViewerVisible(true);
                          } else {
                            window.open(e.params.url, "_blank");
                          }
                          return;
                        }

                        const { llmFriendlyMessage, humanFriendlyMessage } =
                          e.params || {};
                        if (llmFriendlyMessage && humanFriendlyMessage) {
                          sendMessage({ text: llmFriendlyMessage });
                        }
                      }}
                    />
                  </ThemeProvider>,
                );
              }

              sortedParts.forEach((part, i) => {
                switch (part.type) {
                  case "text": {
                    if (message.role === "assistant" && text) {
                      return;
                    }

                    mainParts.push(
                      <div
                        key={`${message.id}-${i}`}
                        className={`text-sm ${
                          part.text.includes("\\[") || part.text.includes("\\(")
                            ? "leading-[2.5]"
                            : "leading-relaxed"
                        } prose prose-sm dark:prose-invert max-w-none overflow-x-auto [&_table]:border [&_table]:border-border [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_pre]:overflow-x-auto [&_code]:break-words`}
                      >
                        <ReactMarkdown
                          {...markdownPlugins}
                          components={markdownComponents}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>,
                    );
                    return;
                  }

                  case "data-progress":
                    const data = part.data as { message: string };
                    const success = data.message.includes("success=true");
                    const error = data.message.includes("success=false");
                    const displayMessage = data.message
                      .replace(/success=(true|false)/, "")
                      .trim();

                    let bgClass, borderClass, textClass, iconElement;

                    if (success) {
                      bgClass = "bg-emerald-500/10";
                      borderClass = "border-emerald-500/20";
                      textClass = "text-emerald-700 dark:text-emerald-300";
                      iconElement = <BadgeCheck className="w-4 h-4" />;
                    } else if (error) {
                      bgClass = "bg-red-500/10";
                      borderClass = "border-red-500/20";
                      textClass = "text-red-700 dark:text-red-300";
                      iconElement = <AlertTriangle className="w-4 h-4" />;
                    } else {
                      bgClass = "bg-blue-500/10";
                      borderClass = "border-blue-500/20";
                      textClass = "text-blue-700 dark:text-blue-300";
                      iconElement = null;
                    }

                    toolParts.push(
                      <div
                        key={`${message.id}-${i}`}
                        className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg border shadow-sm ${bgClass} ${borderClass} ${textClass}`}
                      >
                        {success || error ? (
                          <span className="flex items-center gap-2 font-medium">
                            {iconElement}
                            {displayMessage}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 font-medium">
                            <Shimmer>{displayMessage}</Shimmer>
                          </span>
                        )}
                      </div>,
                    );

                    return;

                  case "tool-call":
                  case "tool-call-delta":
                    return;

                  case "tool-result":
                  case "tool-result-delta":
                  case "dynamic-tool":
                    if ((part as any).toolName === "web_search") {
                      const parsedOutput = safeJsonParse(part.output);
                      const results = Array.isArray(parsedOutput)
                        ? parsedOutput
                        : parsedOutput?.results || parsedOutput?.data || [];

                      if (Array.isArray(results) && results.length > 0) {
                        const sources = (
                          <Sources key={`${message.id}-sources-${i}`}>
                            <SourcesTrigger count={results.length} />
                            <SourcesContent>
                              {results.map(
                                (
                                  result: {
                                    url?: string;
                                    link?: string;
                                    title?: string;
                                  },
                                  idx: number,
                                ) => (
                                  <Source
                                    key={idx}
                                    href={result.url || result.link || ""}
                                    title={result.title || `Source ${idx + 1}`}
                                  />
                                ),
                              )}
                            </SourcesContent>
                          </Sources>
                        );

                        toolParts.push(sources);
                        return;
                      }
                    }

                    return;

                  default:
                    return;
                }
              });

              return [...toolParts, ...mainParts];
            })()
          )}
        </div>

        {message.role === "user" && !isEditing && (
          <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleStartEdit}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Edit message"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {message.role === "user" && (
        <Avatar className="size-8 border border-border/50 shadow-sm hidden md:block">
          <AvatarFallback className="bg-linear-to-br from-foreground/10 to-foreground/5">
            <User className="size-4 text-foreground/70" />
          </AvatarFallback>
        </Avatar>
      )}

      <PhotoSlider
        images={
          currentImageUrl
            ? [{ src: currentImageUrl, key: currentImageUrl }]
            : []
        }
        visible={photoViewerVisible}
        onClose={() => setPhotoViewerVisible(false)}
        index={0}
        onIndexChange={() => {}}
      />
    </div>
  );
}
