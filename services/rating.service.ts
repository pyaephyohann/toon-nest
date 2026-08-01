/**
 * Rating Service
 * Manages series ratings with validation and stats updates
 */

import { ratingRepository, seriesRepository } from "@/repositories";

export class RatingService {
  /**
   * Get ratings for a series with pagination
   */
  async getRatingsBySeries(
    seriesId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return ratingRepository.findBySeriesId(seriesId, options);
  }

  /**
   * Get user's ratings with pagination
   */
  async getRatingsByUser(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return ratingRepository.findByUserId(userId, options);
  }

  /**
   * Get user's rating for a series
   */
  async getUserRating(userId: string, seriesId: string) {
    return ratingRepository.findByUserAndSeries(userId, seriesId);
  }

  /**
   * Add or update rating (upsert pattern)
   */
  async rateSeries(userId: string, seriesId: string, rating: number) {
    // Validate rating range
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Check if series exists
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Check if rating exists
    const existing = await ratingRepository.findByUserAndSeries(
      userId,
      seriesId
    );

    let result;
    if (existing) {
      // Update existing rating
      result = await ratingRepository.update(existing.id, rating);
    } else {
      // Create new rating
      result = await ratingRepository.create(userId, seriesId, rating);
    }

    // Update series stats
    await this.updateSeriesRatingStats(seriesId);

    return result;
  }

  /**
   * Remove rating
   */
  async deleteRating(userId: string, seriesId: string) {
    const rating = await ratingRepository.findByUserAndSeries(userId, seriesId);
    if (!rating) {
      throw new Error("Rating not found");
    }

    await ratingRepository.delete(rating.id);

    // Update series stats
    await this.updateSeriesRatingStats(seriesId);

    return { success: true };
  }

  /**
   * Get average rating for a series
   */
  async getAverageRating(seriesId: string) {
    const average = await ratingRepository.averageBySeriesId(seriesId);
    const count = await ratingRepository.countBySeriesId(seriesId);

    return {
      average,
      count,
    };
  }

  /**
   * Update series rating stats (called after rating changes)
   */
  private async updateSeriesRatingStats(seriesId: string) {
    await seriesRepository.updateStats(seriesId);
  }
}

export const ratingService = new RatingService();
