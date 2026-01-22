"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language: language, // Send selected language
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action buttons
  const quickActions = [
    { id: "1", label: <>Find Schemes</>, icon: "🔍" },
    { id: "2", label: <>Farmer Schemes</>, icon: "🌾" },
    { id: "3", label: <>Student Schemes</>, icon: "🎓" },
    { id: "4", label: <>Women Schemes</>, icon: "👩" },
  ];

  const handleQuickAction = (actionId: string) => {
    if (isLoading) return;

    // Create a descriptive user message instead of just the number
    const actionLabels: Record<string, string> = {
      "1": "Find Schemes",
      "2": "Show Farmer Schemes",
      "3": "Show Student Schemes",
      "4": "Show Women Schemes",
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: actionLabels[actionId] || `Action ${actionId}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Send the API request with the action ID
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...messages,
          {
            role: "user",
            content: actionId, // Send the number to API
          },
        ].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        language: language, // Send selected language
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to get response");
        }
        const data = await response.text();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      })
      .catch((error) => {
        console.error("Chat error:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-lg mx-auto border rounded-xl shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white font-semibold flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>SchemeSaathi Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-500 px-2 py-1 rounded">Beta</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="font-medium">
                👋 Hi! I can help you find government schemes.
              </p>
              <p className="text-sm mt-2">
                Use the quick action buttons below or type your question.
              </p>
            </div>
          </div>
        )}

        {messages.map((m: Message) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white dark:bg-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700"
              }`}
            >
              {m.role === "assistant" ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\n/g, "<br>")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-3 text-sm text-slate-500 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>SchemeSaathi is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Always Visible Quick Action Buttons */}
        <div className="p-3 border-b dark:border-slate-700">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.id)}
                disabled={isLoading}
                className="text-xs h-auto py-2 px-2 flex flex-col items-center gap-1 hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <span className="text-base">{action.icon}</span>
                <span className="text-[10px] leading-tight text-center">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="flex-1 px-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isLoading ? "Please wait..." : "Ask about schemes..."
              }
              disabled={isLoading}
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Character count */}
          <div className="text-xs text-slate-400 mt-2 text-right">
            {input.length.toString()} of 500
          </div>
        </form>
      </div>
    </div>
  );
}
