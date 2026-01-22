import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple redirection logic for demo purposes
  // In a real app, you'd check headers, cookies, etc.
  const { pathname } = request.nextUrl;

  // If no locale in path, and not an internal next request, we might want to redirect (optional)
  // For this simple demo, we just rely on explicit navigation to /hi or /en
  // But let's log to see requests
  // console.log("Middleware request:", pathname);

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|favicon.ico).*)",
  ],
};
