import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "es", "fr", "de", "zh", "ja"];

/**
 * Checks if a pathname matches a locale path.
 * A valid locale path is either exactly /{locale} or starts with /{locale}/.
 * This prevents false positives like "/enroll" matching "/en".
 * @param pathname - The URL pathname to check
 * @param locale - The locale to check against
 * @returns true if the pathname is a valid locale path
 */
function isLocalePath(pathname: string, locale: string): boolean {
  return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
}

/**
 * Next.js middleware for handling internationalization (i18n) routing.
 * Detects locale prefixes in URLs, rewrites paths, and sets locale cookies.
 * Defaults to 'en' for paths without explicit locale prefix.
 * @param request - The incoming Next.js request
 * @returns NextResponse with appropriate rewrites and cookies set
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path starts with a locale using the exact match helper
  const locale = locales.find((l) => isLocalePath(pathname, l));

  if (locale) {
    // Rewrite the path to remove the locale
    // e.g. /es/dashboard -> /dashboard
    // e.g. /es -> /
    const url = request.nextUrl.clone();
    
    // Handle root path /es
    if (pathname === `/${locale}`) {
      url.pathname = "/";
    } else {
      url.pathname = pathname.replace(`/${locale}`, "");
    }
    
    // Create response with rewrite
    const response = NextResponse.rewrite(url);
    
    // Set cookie for Lingo.dev to pick up
    response.cookies.set("locale", locale);
    
    return response;
  }
  
  // For default locale (root path), ensure locale is set to 'en' (or default)
  // to avoid stuck cookies from previous visits
  const response = NextResponse.next();
  // Use the same isLocalePath helper to check if the path is truly non-locale
  // This prevents false positives like "/enroll" triggering the cookie reset
  if (pathname === '/' || !locales.some((l) => isLocalePath(pathname, l))) {
     response.cookies.set("locale", "en");
  }
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
