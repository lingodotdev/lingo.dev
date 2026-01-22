import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "es", "fr", "de", "zh", "ja"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path starts with a locale
  const locale = locales.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

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
  // Optional: Force 'en' cookie if at root? 
  // If we don't, visiting / after /es might still show Spanish if cookie persists.
  // Our LanguageSwitcher assumes / is English.
  if (pathname === '/' || !locales.some(l => pathname.startsWith(`/${l}`))) {
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
