import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the current locale from cookies (client-side)
 * @returns The current locale (defaults to 'en' if not found)
 */
export function getCurrentLocale(): string {
  if (typeof document === "undefined") {
    // Server-side fallback
    return "en";
  }

  const cookies = document.cookie.split(";");
  const localeCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("lingo-locale=")
  );

  if (localeCookie) {
    try {
      const rawValue = localeCookie.split("=")[1]?.trim();
      return rawValue ? decodeURIComponent(rawValue) : "en";
    } catch (e) {
      console.error("Failed to decode locale cookie:", e);
      return "en";
    }
  }

  return "en";
}

/**
 * Helper function to normalize message content to a string
 * @param content The message content that might be string, array, or other types
 * @returns Normalized string content
 */
function normalizeContentToString(
  content: string | { type: string; text?: string }[] | undefined
): string {
  if (!content) return "";

  // Handle array content (for complex message types)
  if (Array.isArray(content)) {
    return content.map((item) => item.text || "").join("");
  }

  // Handle string content
  if (typeof content === "string") {
    return content;
  }

  return String(content);
}
