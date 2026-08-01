/**
 * Auth Service
 * Handles authentication business logic
 * Prepared for Milestone 5: Authentication
 */

import { userRepository } from "@/repositories";
import { hashPassword, comparePassword, generateToken } from "@/lib/auth";
import { UserRole } from "@/app/generated/prisma/client";

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: any; token: string }> {
    // Check if user already exists
    const emailExists = await userRepository.emailExists(data.email);
    if (emailExists) {
      throw new Error("Email already exists");
    }

    const usernameExists = await userRepository.usernameExists(data.username);
    if (usernameExists) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  /**
   * Login user
   */
  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: any; token: string }> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<any> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
