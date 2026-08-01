/**
 * useCurrentUser Hook
 * Provides access to current user session from Auth.js
 * Works in both server and client components
 */

import { auth } from "@/auth";
import { UserRole } from "@/app/generated/prisma/client";

/**
 * Server component function to get current user
 * Call this in server components to get the current user session
 */
export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  name: string;
  role: UserRole;
} | null> {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

/**
 * Check if user is authenticated (server component)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}

/**
 * Check if user has specific role (server component)
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user is admin (server component)
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(UserRole.ADMIN);
}

/**
 * Client component hook to get current user
 * Use this in client components with "use client"
 */
export function useCurrentUser() {
  // This will be implemented with useSession from next-auth/react
  // For now, return a placeholder
  // Will be updated when we add the SessionProvider
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
}
