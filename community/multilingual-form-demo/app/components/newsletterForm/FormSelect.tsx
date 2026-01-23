"use client";

import type { SelectFieldProps } from "../../types/form.types";

export function FormSelect({
  options,
  value,
  onChange,
  className = "",
}: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`text-sm bg-transparent border-0 focus:ring-0 text-blue-600 dark:text-blue-400 font-medium ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
