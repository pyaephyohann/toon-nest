/**
 * Route Constants
 * Centralized route definitions for the application
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  GENRES: "/genres",
  POPULAR: "/popular",
  RANKINGS: "/rankings",
  TRENDING: "/trending",
  UPDATES: "/updates",
  PREMIUM: "/premium",

  // Protected routes
  BOOKMARKS: "/bookmarks",
  HISTORY: "/history",
  COMPLETED: "/completed",

  // Dynamic routes
  SERIES: (slug: string) => `/series/${slug}`,
  CHAPTER: (slug: string, chapter: string) => `/series/${slug}/${chapter}`,
  GENRE: (slug: string) => `/genres/${slug}`,

  // Admin routes
  ADMIN: "/admin",
  ADMIN_SERIES: "/admin/series",
  ADMIN_CHAPTERS: "/admin/chapters",
  ADMIN_USERS: "/admin/users",
  ADMIN_GENRES: "/admin/genres",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export type RouteKey = keyof typeof ROUTES;
