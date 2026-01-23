"use client";

import { motion } from "framer-motion";

interface SuccessMessageProps {
  title: string;
  message: string;
  ctaText: string;
  homeText: string;
  onReset: () => void;
  onHome: () => void;
}

export function SuccessMessage({
  title,
  message,
  ctaText,
  homeText,
  onReset,
  onHome,
}: SuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="relative">
        <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        {title} 🎉
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        {message}
      </p>

      <div className="space-y-3 max-w-sm mx-auto">
        <button
          onClick={onReset}
          className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {ctaText}
        </button>
        <button
          onClick={onHome}
          className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {homeText}
        </button>
      </div>
    </motion.div>
  );
}
