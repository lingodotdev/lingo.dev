import { NextRequest, NextResponse } from "next/server";
import { sourceLocale, supportedLocales } from "@/supported-locales";

const SUPPORTED_LOCALES = supportedLocales;
const DEFAULT_LOCALE = sourceLocale;


/**
 * Get the preferred locale from Accept-Language header
 */
function getLocaleFromHeader(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return null;

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      const quality = qValue ? parseFloat(qValue) : 1.0;
      // Extract base language code (e.g., "en" from "en-US")
      const baseCode = code.split("-")[0].toLowerCase();
      return { code: baseCode, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const { code } of languages) {
    if (SUPPORTED_LOCALES.includes(code)) {
      return code;
    }
  }

  return null;
}

/**
 * Extract locale from pathname
 * Returns the locale code if found in the path, otherwise null
 */
function getLocaleFromPath(pathname: string): string | null {
  // Extract first segment
  const segments = pathname.split("/").filter(Boolean);
  const potentialLocale = segments[0];

  if (
    potentialLocale &&
    SUPPORTED_LOCALES.includes(potentialLocale)
  ) {
    return potentialLocale;
  }

  return null;
}

/**
 * Middleware to handle locale-based routing following Next.js 16 patterns
 *
 * Similar to next-intl's approach:
 * - Detects locale from URL path first
 * - Falls back to Accept-Language header for locale detection
 * - Redirects to appropriate locale if missing
 * - Sets x-lingo-locale header for Server Components (like next-intl does)
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Try to extract locale from path
  const localeFromPath = getLocaleFromPath(pathname);

  if (localeFromPath) {
    // Already has locale in path, continue with request
    // BUT add x-lingo-locale header so Server Components can read it
    // This is the key pattern from next-intl!
    const response = NextResponse.next();
    response.headers.set("x-lingo-locale", localeFromPath);
    return response;
  }

  // No locale in pathname - determine which locale to use
  const preferredLocale = getLocaleFromHeader(request) || DEFAULT_LOCALE;

  // Redirect to locale-prefixed path
  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Match all pathnames except for:
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /favicon.ico, /robots.txt (static files in public)
  // - Files with extensions (e.g., .js, .css, .png, .svg, etc.)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - _vercel (Vercel internals)
     * - Files with extensions (static files)
     */
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
