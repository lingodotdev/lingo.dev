import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./lib/i18n-config";

// Helper to determine preferred locale
function getLocale(request: NextRequest): string | undefined {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    return i18n.defaultLocale;
  }
  return undefined;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip internal paths and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Check if locale is present in path
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect to default locale if missing
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
