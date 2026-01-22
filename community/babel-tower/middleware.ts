import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "es", "fr", "de", "ja", "zh", "ko", "ar", "hi", "pt", "ru"];
const COOKIE_NAME = "locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    const currentCookie = request.cookies.get(COOKIE_NAME)?.value;

    if (currentCookie !== pathnameLocale) {
      const response = NextResponse.next();
      response.cookies.set(COOKIE_NAME, pathnameLocale, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    }
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  const locale = locales.includes(cookieLocale || "") ? cookieLocale : "en";

  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(COOKIE_NAME, locale!, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
