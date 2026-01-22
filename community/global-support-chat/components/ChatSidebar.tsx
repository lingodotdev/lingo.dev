import React from 'react';
import { ChatSession } from '../types';
import { User, MessageSquare } from 'lucide-react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
}) => {
  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col bg-gray-50 dark:bg-zinc-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chats
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left ${
              activeSessionId === session.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500'
                : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
              {session.avatar ? (
                <img
                  src={session.avatar}
                  alt={session.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold truncate">{session.userName}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono">
                  {session.userLocale}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {session.lastMessagePreview || 'No messages'}
              </p>
            </div>
            {session.unreadCount > 0 && (
              <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                {session.unreadCount}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
