"use client";

import { Controller, Control } from "react-hook-form";
import { PhoneIcon } from "./FormIcons";
import { motion, AnimatePresence } from "framer-motion";
import type { NewsletterFormData } from "../../types/form.types";

interface PhoneInputProps {
  control: Control<NewsletterFormData>;
  error?: string;
  label: string;
  placeholder: string;
  optional: string;
  formatPhoneNumber: (value: string) => string;
}

export function PhoneInput({
  control,
  error,
  label,
  placeholder,
  optional,
  formatPhoneNumber,
}: PhoneInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {optional}
        </span>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <PhoneIcon />
        </div>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="tel"
              id="phone"
              onChange={(e) =>
                field.onChange(formatPhoneNumber(e.target.value))
              }
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
                  : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200`}
              placeholder={placeholder}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "phone-error" : undefined}
            />
          )}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            id="phone-error"
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
  );
}
