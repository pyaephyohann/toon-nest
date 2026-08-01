/**
 * Auth Service
 * Handles authentication business logic
 * Refactored for Auth.js integration
 */

import { authRepository } from "@/repositories";
import { hashPassword, comparePassword } from "@/lib/auth";
import { UserRole } from "@/app/generated/prisma/client";
import { loginSchema, registerSchema } from "@/validations";
import type { LoginInput, RegisterInput } from "@/validations";

export class AuthService {
  /**
   * Validate credentials for login
   * Called by Auth.js Credentials provider
   */
  async validateCredentials(email: string, password: string): Promise<{
    id: string;
    email: string;
    username: string;
    role: UserRole;
  } | null> {
    // Validate input
    const validatedData = loginSchema.parse({ email, password });

    // Find user by email
    const user = await authRepository.findByEmailForAuth(validatedData.email);
    if (!user) {
      return null;
    }

    // Verify password
    const isValid = await comparePassword(validatedData.password, user.password);
    if (!isValid) {
      return null;
    }

    // Return user data without password
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<{
    id: string;
    email: string;
    username: string;
    role: UserRole;
  }> {
    // Validate input
    const validatedData = registerSchema.parse(data);

    // Check if user already exists
    const emailExists = await authRepository.emailExists(validatedData.email);
    if (emailExists) {
      throw new Error("Email already exists");
    }

    const usernameExists = await authRepository.usernameExists(validatedData.username);
    if (usernameExists) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await authRepository.createWithHashedPassword({
      username: validatedData.username,
      email: validatedData.email,
      hashedPassword,
      role: UserRole.USER,
    });

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  /**
   * Get user by ID (without password)
   */
  async getUserById(id: string): Promise<{
    id: string;
    email: string;
    username: string;
    role: UserRole;
    avatar?: string | null;
  } | null> {
    const user = await authRepository.findByIdWithoutPassword(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
    };
  }
}

export const authService = new AuthService();
