/**
 * useAuth Hook
 * Authentication state and actions using Auth.js
 * Client-side hook for accessing Auth.js session
 */

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { UserRole } from "@/app/generated/prisma/client";

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return result;
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      }
    : null;

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    login,
    logout,
  };
}
