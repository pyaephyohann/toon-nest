/**
 * Auth.js Configuration
 * Edge-compatible configuration for session management and route protection
 * This file runs on the edge and cannot access the database
 */

import type { NextAuthConfig } from "next-auth";
import { ROUTES } from "@/constants";

export const authConfig: NextAuthConfig = {
  // Pages configuration
  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.LOGIN,
  },

  // Session strategy
  session: {
    strategy: "jwt",
  },

  // Callbacks
  callbacks: {
    /**
     * Authorized callback for middleware protection
     * Returns true if user is authorized to access the route
     */
    authorized({ auth }) {
      return !!auth?.user;
    },
  },

  // Providers will be configured in auth.ts (with database access)
  providers: [],
};
