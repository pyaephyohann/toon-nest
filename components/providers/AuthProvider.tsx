/**
 * AuthProvider Component
 * Wraps the application with SessionProvider for Auth.js
 * Must be a client component
 */

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
