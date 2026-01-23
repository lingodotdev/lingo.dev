"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UseFormRegisterReturn } from "react-hook-form";

interface PrivacyCheckboxProps {
  register: UseFormRegisterReturn;
  error?: string;
  privacyText: React.ReactNode;
}

export function PrivacyCheckbox({
  register,
  error,
  privacyText,
}: PrivacyCheckboxProps) {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <label htmlFor="privacy" className="relative mt-1 cursor-pointer">
          <input
            type="checkbox"
            id="privacy"
            {...register}
            className="peer sr-only"
          />
          <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded transition-all duration-200 peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:ring-4 peer-checked:ring-blue-500/20 peer-checked:dark:ring-blue-500/30 peer-focus:ring-2 peer-focus:ring-blue-500/50">
            <svg
              className="w-full h-full text-white hidden peer-checked:block"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </label>
        <div>
          <label
            htmlFor="privacy"
            className="text-gray-700 dark:text-gray-300 cursor-pointer select-none"
          >
            {privacyText}
          </label>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
