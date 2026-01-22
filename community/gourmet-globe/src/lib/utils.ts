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
    return localeCookie.split("=")[1]?.trim() || "en";
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

/**
 * Strip Tambo language context from message content
 * @param content The message content that might contain language context
 * @returns The clean message content without language context
 */
export function stripTamboLanguageContext(
  content: string | { type: string; text?: string }[] | undefined
): string {
  const textContent = normalizeContentToString(content);
  return textContent.replace(/<<<TAMBO_LANG:[^>]+>>>\|\|\|/g, "");
}

/**
 * Extract language from Tambo message content
 * @param content The message content that might contain language context
 * @returns The language code (e.g., 'en', 'es', 'fr') or null if not found
 */
export function extractTamboLanguage(
  content: string | { type: string; text?: string }[] | undefined
): string | null {
  const textContent = normalizeContentToString(content);

  // Extract language from <<<TAMBO_LANG:en>>>||| format
  const match = textContent.match(/<<<TAMBO_LANG:([^>]+)>>>/);
  return match ? match[1] : null;
}

/**
 * Get all available languages from thread messages
 * @param threads Array of threads to analyze
 * @returns Array of unique language codes found in threads
 */
export function getAvailableLanguages(
  threads: Array<{ messages?: Array<{ content: any }> }>
): string[] {
  const languages = new Set<string>();

  threads.forEach((thread) => {
    // Safety check: ensure thread.messages exists and is an array
    if (thread.messages && Array.isArray(thread.messages)) {
      thread.messages.forEach((message) => {
        const lang = extractTamboLanguage(message.content);
        if (lang) {
          languages.add(lang);
        }
      });
    }
  });

  return Array.from(languages).sort();
}
