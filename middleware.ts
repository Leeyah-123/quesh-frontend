import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value || request.headers.get("authorization")?.split(" ")[1]
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isDashboardPage =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/document") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/sessions")

  // For client-side auth, we'll let the client handle redirects
  // This prevents redirect loops when localStorage has a token but cookies don't
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/document/:path*", "/profile/:path*", "/sessions/:path*"],
}
