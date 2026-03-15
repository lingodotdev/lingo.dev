/**
 * Custom path-based locale resolver for Next.js server-side
 *
 * This resolver uses the next-intl pattern:
 * - Middleware extracts locale from URL path
 * - Middleware sets x-lingo-locale header
 * - Server components read this header
 *
 * This allows all Server Components to reliably access the locale
 * without needing to parse URLs or receive it via props.
 *
 * Falls back to the default locale if header is not set.
 */

import { headers } from "next/headers";

/**
 * Get locale from middleware-set header
 *
 * The middleware extracts the locale from the URL path (e.g., /es/about)
 * and sets it in the x-lingo-locale header. This function reads that header.
 *
 * @returns Locale code from x-lingo-locale header or default locale
 */
export async function getServerLocale(): Promise<string> {
  const headersList = await headers();
  const locale = headersList.get("x-lingo-locale");
  return locale || "en";
}
