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
      displayName?: string;
      bio?: string;
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
   * Get user statistics
   */
  async getUserStatistics(userId: string) {
    const stats = await userRepository.getUserStatistics(userId);
    
    // Calculate reading streak (consecutive days with reading activity)
    const streak = await this.calculateReadingStreak(userId);
    
    return {
      ...stats,
      readingStreak: streak,
    };
  }

  /**
   * Get user's favorite genres
   */
  async getFavoriteGenres(userId: string, limit: number = 5) {
    return userRepository.getFavoriteGenres(userId, limit);
  }

  /**
   * Calculate reading streak (consecutive days of reading activity)
   */
  private async calculateReadingStreak(userId: string): Promise<number> {
    const { readingHistoryRepository } = await import("@/repositories");
    
    // Get reading history entries sorted by date
    const history = await readingHistoryRepository.findByUserId(userId, { take: 365 });
    
    if (history.histories.length === 0) {
      return 0;
    }

    // Get unique dates from history
    const dates = new Set(
      history.histories.map((h) => {
        const date = new Date(h.updatedAt);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      })
    );

    const sortedDates = Array.from(dates).sort().reverse();
    
    // Calculate streak from today backwards
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = today;

    for (const date of sortedDates) {
      if (date === currentDate) {
        streak++;
        // Move to previous day
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDate = prevDate.toISOString().split('T')[0];
      } else if (date < currentDate) {
        // Gap found, check if it's just yesterday
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const yesterday = prevDate.toISOString().split('T')[0];
        
        if (date === yesterday) {
          streak++;
          currentDate = yesterday;
        } else {
          break;
        }
      }
    }

    return streak;
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
