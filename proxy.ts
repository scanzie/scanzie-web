import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Route categories
  const publicOnlyRoutes = ["/", "/login", "/register", "/forgot-password"];
  const publicRoutes = [
    "/api/",
    "/api/",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.png",
    "/og-twitter.png",
    "/favicon.ico",
  ];
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/logout",
    "/settings",
    "/api/user",
  ];

  // Check if current path matches any route pattern
  const isPublicOnlyRoute = publicOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get session cookie
  const sessionToken =
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value;

  const isAuthenticated = !!sessionToken;

  // Authenticated users hitting public-only routes → redirect to dashboard
  if (isAuthenticated && isPublicOnlyRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users hitting protected routes → redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);

    if (!pathname.startsWith("/api/")) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }

    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("better-auth.session_token");
    response.cookies.delete("__Secure-better-auth.session_token");

    return response;
  }

  // Public routes → proceed
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes with valid cookie → proceed
  if (isAuthenticated && isProtectedRoute) {
    return NextResponse.next();
  }

  // Public-only routes with no cookie → proceed
  if (!isAuthenticated && isPublicOnlyRoute) {
    return NextResponse.next();
  }

  // Fallbacks
  if (isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Match all paths except API routes, Next.js static files, images, and favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
