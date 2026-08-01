/**
 * Auth.js Main Instance
 * Full Auth.js configuration with database access
 * Handles session management, user synchronization, and provider configuration
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { authService } from "@/services";
import { UserRole } from "@/app/generated/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  
  // Prisma adapter for session storage
  adapter: PrismaAdapter(prisma),
  
  // Session configuration
  session: {
    strategy: "jwt",
  },
  
  // Providers
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      /**
       * Authorize callback
       * Validates credentials and returns user object
       * Calls auth.service for business logic (validation, password check)
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call auth.service for validation and authentication
          const user = await authService.validateCredentials(
            credentials.email as string,
            credentials.password as string
          );

          if (!user) {
            return null;
          }

          // Return user object for Auth.js
          return {
            id: user.id,
            email: user.email,
            name: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    
    // Future OAuth providers can be added here
    // Google, GitHub, etc.
  ],
  
  // Callbacks
  callbacks: {
    /**
     * JWT callback
     * Adds user data to JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    
    /**
     * Session callback
     * Adds user data to session object
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  
  // Events
  events: {
    /**
     * Sign in event
     * Can be used for logging, analytics, etc.
     */
    async signIn({ user }) {
      console.log("User signed in:", user.email);
    },
  },
});
