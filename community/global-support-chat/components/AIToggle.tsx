import React from 'react';
import { Bot, Quote } from 'lucide-react';

interface AIToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const AIToggle: React.FC<AIToggleProps> = ({ enabled, onToggle }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
       <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          !enabled
            ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }`}
      >
        <Quote className="w-4 h-4" />
        Hardcoded
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          enabled
            ? 'bg-blue-600 shadow-sm text-white'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }`}
      >
        <Bot className="w-4 h-4" />
        AI Responses (Ollama)
      </button>
    </div>
  );
};
