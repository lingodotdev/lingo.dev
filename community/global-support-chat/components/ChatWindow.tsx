import React, { useEffect, useRef } from 'react';
import { ChatSession } from '../types';

interface ChatWindowProps {
  session: ChatSession | undefined;
  isTyping: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ session, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isTyping]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-900/50 text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {session.messages.map((msg) => {
        const isAgent = msg.sender === 'agent';
        return (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[70%] ${
              isAgent ? 'self-end items-end ml-auto' : 'self-start items-start'
            }`}
          >
            <div
              className={`rounded-2xl p-4 shadow-sm ${
                isAgent
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-bl-none'
              }`}
            >
              {isAgent ? (
                // Agent: English Main, Target translated small
                <>
                  <div className="text-base font-semibold text-white mb-1">
                    {msg.text}
                  </div>
                  {msg.originalText && (
                    <div className="text-sm text-blue-100 italic">
                      {msg.originalText}
                    </div>
                  )}
                </>
              ) : (
                // User: Foreign Main (Small/Italic in spec?? Spec says:
                // "Shows originalText (Foreign) in small italics top, text (English Translation) in bold/large bottom.")
                <>
                  {msg.originalText && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-1">
                      {msg.originalText}
                    </div>
                  )}
                  <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {msg.text}
                  </div>
                </>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-1 px-1">
               {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      })}

      {isTyping && (
        <div className="self-start bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl rounded-bl-none p-4 shadow-sm">
           <div className="flex space-x-1 h-5 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
           </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
