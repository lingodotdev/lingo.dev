"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

type Message = {
    id: string;
    text: string;
    name: string;
    language: string;
    originalText?: string;
};

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

/**
 * Main chat page component.
 * Displays the chat interface, handles message sending, and manages language switching.
 *
 * @returns {JSX.Element} The rendered chat page.
 */
export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const lang = (params?.lang as string) || "en";

    // State
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        setIsSending(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input, name: "You", language: lang })
            });

            if (!res.ok) {
                throw new Error(`Error sending message: ${res.status}`);
            }

            setInput("");
            await refreshMessages();
        } catch (error) {
            console.error("Failed to send", error);
        } finally {
            setIsSending(false);
        }
    };

    const refreshMessages = async () => {
        try {
            const res = await fetch(`/api/messages?lang=${lang}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
                // Scroll mostly on new messages, simple implementation here
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        refreshMessages().finally(() => setLoading(false));
    }, [lang]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Lingo Chat
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Select Language
                    </p>
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => router.push(`/${l.code}/chat`)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${lang === l.code
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                        >
                            <span className="mr-3 text-lg">{l.flag}</span>
                            {l.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white">
                            Y
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">You</p>
                            <p className="text-xs text-gray-400">Online</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                    <h1 className="font-bold text-indigo-400">Lingo Chat</h1>
                    <select
                        aria-label="Select language"
                        className="bg-gray-700 text-white text-sm rounded-lg p-2 border-none ring-1 ring-gray-600"
                        value={lang}
                        onChange={(e) => router.push(`/${e.target.value}/chat`)}
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                        ))}
                    </select>
                </header>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-gray-400 animate-pulse">
                            Loading conversation...
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.name === "You";
                            return (
                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`flex flex-col max-w-[80%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                                        <div className="flex items-baseline gap-2 mb-1 px-1">
                                            <span className="text-xs font-bold text-gray-400">{msg.name}</span>
                                            <span className="text-[10px] text-gray-500 uppercase">{msg.language}</span>
                                        </div>

                                        <div className={`
                                            p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group
                                            ${isMe
                                                ? "bg-indigo-600 text-white rounded-tr-sm"
                                                : "bg-gray-700 text-gray-100 rounded-tl-sm border border-gray-600"}
                                        `}>
                                            {msg.text}
                                            {msg.originalText && (
                                                <div className={`mt-2 pt-2 border-t text-xs opacity-70 ${isMe ? "border-indigo-500" : "border-gray-600"}`}>
                                                    <span className="uppercase text-[10px] font-bold tracking-wider opacity-50 block mb-0.5">Original</span>
                                                    {msg.originalText}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-800 border-t border-gray-700">
                    <div className="max-w-4xl mx-auto flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                aria-label="Message input"
                                className="w-full bg-gray-900 text-white placeholder-gray-500 border border-gray-600 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                                placeholder={`Message in ${LANGUAGES.find(l => l.code === lang)?.name || "English"}...`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !isSending && handleSend()}
                                disabled={isSending}
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={isSending || !input.trim()}
                            aria-label="Send message"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20 active:scale-95 flex items-center justify-center w-14"
                        >
                            {isSending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
