/**
 * User Service
 * Handles user business logic
 */

import { userRepository } from "@/repositories";
import { hashPassword } from "@/lib/auth";
import { UserRole } from "@/app/generated/prisma/client";

export class UserService {
  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    id: string,
    data: {
      username?: string;
      avatar?: string;
    }
  ) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    // Check username uniqueness if changing
    if (data.username && data.username !== existing.username) {
      const usernameExists = await userRepository.usernameExists(data.username);
      if (usernameExists) {
        throw new Error("Username already exists");
      }
    }

    return userRepository.update(id, data);
  }

  /**
   * Change user password
   */
  async changePassword(
    id: string,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const { comparePassword } = await import("@/lib/auth");
    const isValid = await comparePassword(data.currentPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await hashPassword(data.newPassword);

    return userRepository.update(id, { password: hashedPassword });
  }

  /**
   * Delete user account
   */
  async deleteUser(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    return userRepository.delete(id);
  }
}

export const userService = new UserService();
