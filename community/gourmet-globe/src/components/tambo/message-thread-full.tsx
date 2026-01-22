"use client";

import type { messageVariants } from "@/components/tambo/message";
import {
  MessageInput,
  MessageInputError,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContainer,
  useThreadContainerContext,
} from "@/components/tambo/thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryList,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
} from "@/components/tambo/thread-history";
import { useMergedRef } from "@/lib/tambo/thread-hooks";
import type { Suggestion } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

/**
 * Props for the MessageThreadFull component
 */
export interface MessageThreadFullProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional context key for the thread */
  contextKey?: string;
  /**
   * Controls the visual styling of messages in the thread.
   * Possible values include: "default", "compact", etc.
   * These values are defined in messageVariants from "@/components/ui/message".
   * @example variant="compact"
   */
  variant?: VariantProps<typeof messageVariants>["variant"];
}

/**
 * A full-screen chat thread component with message history, input, and suggestions
 */
export const MessageThreadFull = forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(({ className, contextKey, variant, ...props }, ref) => {
  const { containerRef, historyPosition } = useThreadContainerContext();
  const mergedRef = useMergedRef<HTMLDivElement | null>(ref, containerRef);

  const threadHistorySidebar = (
    <ThreadHistory contextKey={contextKey} position={historyPosition}>
      <ThreadHistoryHeader />
      <ThreadHistoryNewButton />
      <ThreadHistorySearch />
      <ThreadHistoryList />
    </ThreadHistory>
  );

  const defaultSuggestions: Suggestion[] = [
    {
      id: "suggestion-1",
      title: "Get started",
      detailedSuggestion: "What can you help me with?",
      messageId: "welcome-query",
    },
    {
      id: "suggestion-2",
      title: "Learn more",
      detailedSuggestion: "Tell me about your capabilities.",
      messageId: "capabilities-query",
    },
    {
      id: "suggestion-3",
      title: "Examples",
      detailedSuggestion: "Show me some example queries I can try.",
      messageId: "examples-query",
    },
  ];

  return (
    <div className="flex w-full h-full">
      {/* Thread History Sidebar - rendered first if history is on the left */}
      {historyPosition === "left" && threadHistorySidebar}

      <ThreadContainer ref={mergedRef} className={className} {...props}>
        {/* Scrollable content area - takes remaining space */}
        <ScrollableMessageContainer className="flex-1 p-4">
          <ThreadContent variant={variant}>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        {/* Fixed-height sections at bottom */}
        <div className="flex-shrink-0">
          {/* Message suggestions status */}
          <MessageSuggestions>
            <MessageSuggestionsStatus />
          </MessageSuggestions>

          {/* Message input */}
          <div className="p-4">
            <MessageInput contextKey={contextKey}>
              <MessageInputTextarea placeholder="Ask to scrape a website or send an email" />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
              <MessageInputError />
            </MessageInput>
          </div>

          {/* Message suggestions */}
          <MessageSuggestions initialSuggestions={defaultSuggestions}>
            <MessageSuggestionsList />
          </MessageSuggestions>
        </div>
      </ThreadContainer>

      {/* Thread History Sidebar - rendered last if history is on the right */}
      {historyPosition === "right" && threadHistorySidebar}
    </div>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
