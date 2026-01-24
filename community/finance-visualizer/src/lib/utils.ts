import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge.
 * Combines multiple class values and resolves Tailwind CSS conflicts.
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns Merged and deduplicated class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
