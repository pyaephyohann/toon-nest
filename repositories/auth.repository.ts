/**
 * Auth Repository
 * Auth-specific database operations
 * Delegates to user.repository for actual database operations
 */

import { userRepository } from "./user.repository";
import { User, UserRole } from "@/app/generated/prisma/client";

export class AuthRepository {
  /**
   * Find user by email with password for authentication
   */
  async findByEmailForAuth(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }

  /**
   * Create user with already-hashed password
   */
  async createWithHashedPassword(data: {
    username: string;
    email: string;
    hashedPassword: string;
    displayName?: string;
    avatar?: string;
    role?: UserRole;
  }): Promise<User> {
    return userRepository.create({
      username: data.username,
      email: data.email,
      password: data.hashedPassword,
      displayName: data.displayName,
      avatar: data.avatar,
      role: data.role || UserRole.USER,
    });
  }

  /**
   * Find user by ID without password
   */
  async findByIdWithoutPassword(id: string): Promise<Omit<User, "password"> | null> {
    const user = await userRepository.findById(id);
    if (!user) {
      return null;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    return userRepository.emailExists(email);
  }

  /**
   * Check if username exists
   */
  async usernameExists(username: string): Promise<boolean> {
    return userRepository.usernameExists(username);
  }
}

export const authRepository = new AuthRepository();
