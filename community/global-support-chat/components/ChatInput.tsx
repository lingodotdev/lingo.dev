import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  targetLocale: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  targetLocale,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900"
    >
      <div className="flex gap-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={`Type in English (will translate to ${targetLocale})...`}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl px-4 py-2 transition-colors flex items-center justify-center aspect-square"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
