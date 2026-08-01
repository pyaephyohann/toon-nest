/**
 * User Series Status Service
 * Manages user reading status for series
 */

import { userSeriesStatusRepository, seriesRepository } from "@/repositories";
import { ReadingStatus } from "@/app/generated/prisma/client";

export class UserSeriesStatusService {
  /**
   * Get all user's series statuses
   */
  async getUserStatuses(userId: string) {
    return userSeriesStatusRepository.findByUserId(userId);
  }

  /**
   * Get user's status for a series
   */
  async getUserStatus(userId: string, seriesId: string) {
    return userSeriesStatusRepository.findByUserAndSeries(userId, seriesId);
  }

  /**
   * Set reading status (upsert pattern)
   */
  async setStatus(
    userId: string,
    seriesId: string,
    status: ReadingStatus
  ) {
    // Check if series exists
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Validate status enum
    if (!Object.values(ReadingStatus).includes(status)) {
      throw new Error("Invalid status");
    }

    // Check if status exists
    const existing = await userSeriesStatusRepository.findByUserAndSeries(
      userId,
      seriesId
    );

    if (existing) {
      // Update existing status
      return userSeriesStatusRepository.update(userId, seriesId, status);
    } else {
      // Create new status
      return userSeriesStatusRepository.create(userId, seriesId, status);
    }
  }

  /**
   * Remove reading status
   */
  async removeStatus(userId: string, seriesId: string) {
    const existing = await userSeriesStatusRepository.findByUserAndSeries(
      userId,
      seriesId
    );
    if (!existing) {
      throw new Error("Status not found");
    }

    return userSeriesStatusRepository.delete(userId, seriesId);
  }

  /**
   * Get series with specific status for user
   */
  async getStatusByStatus(userId: string, status: ReadingStatus) {
    return userSeriesStatusRepository.findByUserIdAndStatus(userId, status);
  }
}

export const userSeriesStatusService = new UserSeriesStatusService();
