/**
 * Next.js Middleware
 * Protects routes and handles authentication redirects
 * Runs before requests reach pages
 * Edge-compatible - no database access
 */

import { NextResponse } from "next/server";
import { ROUTES } from "@/constants";

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  ROUTES.BOOKMARKS,
  ROUTES.HISTORY,
  ROUTES.COMPLETED,
  ROUTES.ADMIN,
  ROUTES.ADMIN_SERIES,
  ROUTES.ADMIN_CHAPTERS,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_GENRES,
];

/**
 * Public routes that should redirect authenticated users
 */
const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Get session token from cookies
  const sessionToken = req.headers.get("cookie")?.match(/next-auth\.session-token=([^;]+)/)?.[1];

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route is an auth route (login, register, etc.)
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes to login
  if (!sessionToken && isProtectedRoute) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
  }

  // Redirect authenticated users from auth routes to home
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  // Match all paths except for static files and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
