"use client";

import type { CheckboxFieldProps } from "../../types/form.types";

export function FormCheckbox({
  id,
  label,
  description,
  register,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="relative cursor-pointer">
        <input type="checkbox" id={id} {...register} className="peer sr-only" />
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
          htmlFor={id}
          className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer select-none"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
