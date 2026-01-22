"use client";

import { useState, useEffect } from "react";
import {
  useSocket,
  useSocketEvent,
  emitSocketEvent,
} from "../../../lib/socket-client";
import ChatWindow from "../../../components/chat-window";
import LanguageSelector from "../../../components/language-selector";
import { MessageSquare, Users as UsersIcon } from "lucide-react";

export default function RealTimeChatPage() {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
  const [room, setRoom] = useState("global");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  const { socket, isConnected, error } = useSocket();

  // Handle incoming messages
  useSocketEvent("chat:message", (message) => {
    setMessages((prev) => [...prev, message]);
  });

  // Handle user joined
  useSocketEvent(
    "user:joined",
    ({ username: joinedUser, language: userLang }) => {
      console.log(`${joinedUser} joined (${userLang})`);
    },
  );

  // Handle user left
  useSocketEvent("user:left", ({ username: leftUser }) => {
    console.log(`${leftUser} left`);
  });

  // Handle room users update
  useSocketEvent("room:users", ({ users: roomUsers }) => {
    setUsers(roomUsers);
  });

  const handleJoin = () => {
    if (!tempUsername.trim()) return;

    setUsername(tempUsername);
    setIsJoined(true);

    // Join room with language preference
    emitSocketEvent("user:join", {
      username: tempUsername,
      language,
      room,
    });

    // Track language in analytics
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track/language`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: tempUsername, language }),
    }).catch(console.error);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    emitSocketEvent("chat:message", {
      text,
      room,
    });

    // Track translation
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track/translation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLang: language }),
      },
    ).catch(console.error);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);

    if (isJoined) {
      // Track language change
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track/language`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, language: newLang }),
      }).catch(console.error);
    }
  };

  // Join screen
  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-block p-4 gradient-bg rounded-2xl mb-4">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                LinguaVerse
              </h1>
              <p className="text-muted-foreground">
                Real-time multilingual collaboration
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Language
                </label>
                <LanguageSelector
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!tempUsername.trim() || !isConnected}
                className="w-full py-3 gradient-bg rounded-xl font-medium hover:opacity-90 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected ? "Join Chat" : "Connecting..."}
              </button>

              {error && (
                <p className="text-sm text-destructive text-center">
                  Connection error: {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between glass-effect">
        <div className="flex items-center gap-4">
          <div className="p-2 gradient-bg rounded-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Real-Time Chat</h1>
            <p className="text-sm text-muted-foreground">Room: {room}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Active users */}
          <div className="flex items-center gap-2 px-3 py-2 glass-effect rounded-lg">
            <UsersIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{users.length} online</span>
          </div>

          {/* Language selector */}
          <LanguageSelector value={language} onChange={handleLanguageChange} />

          {/* User info */}
          <div className="px-4 py-2 glass-effect rounded-lg">
            <span className="text-sm font-medium">{username}</span>
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUser={username}
        />
      </div>
    </div>
  );
}
