/**
 * Auth Provider
 * Authentication context provider
 * Prepared for Milestone 5: Authentication
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Placeholder for login logic
    throw new Error("Login not yet implemented");
  };

  const register = async (username: string, email: string, password: string) => {
    // Placeholder for register logic
    throw new Error("Register not yet implemented");
  };

  const logout = async () => {
    // Placeholder for logout logic
    throw new Error("Logout not yet implemented");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
