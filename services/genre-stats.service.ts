/**
 * Genre Stats Service
 * Manages genre analytics with aggregation logic
 */

import { genreStatsRepository, genreRepository } from "@/repositories";
import { TimePeriod } from "@/app/generated/prisma/client";

export class GenreStatsService {
  /**
   * Get stats for a genre
   */
  async getGenreStats(
    genreId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return genreStatsRepository.findByGenreId(genreId, options);
  }

  /**
   * Get stats for a genre by time period
   */
  async getGenreStatsByPeriod(
    genreId: string,
    period: TimePeriod,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return genreStatsRepository.findByGenreIdAndPeriod(genreId, period, options);
  }

  /**
   * Record daily/weekly/monthly stats
   */
  async recordStats(
    genreId: string,
    period: TimePeriod,
    data: {
      readers?: number;
      seriesCount?: number;
    }
  ) {
    // Validate period
    if (!Object.values(TimePeriod).includes(period)) {
      throw new Error("Invalid period");
    }

    // Check if genre exists
    const genre = await genreRepository.findById(genreId);
    if (!genre) {
      throw new Error("Genre not found");
    }

    const date = this.getPeriodDate(period);
    
    return genreStatsRepository.upsert(genreId, date, period, data);
  }

  /**
   * Aggregate stats over date range
   */
  async aggregateGenreStats(
    genreId: string,
    period: TimePeriod,
    startDate: Date,
    endDate: Date
  ) {
    return genreStatsRepository.aggregateByGenreId(
      genreId,
      period,
      startDate,
      endDate
    );
  }

  /**
   * Get date for current period
   */
  private getPeriodDate(period: TimePeriod): Date {
    const now = new Date();
    
    switch (period) {
      case TimePeriod.DAILY:
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case TimePeriod.WEEKLY:
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(now.setDate(diff));
      case TimePeriod.MONTHLY:
        return new Date(now.getFullYear(), now.getMonth(), 1);
      default:
        return now;
    }
  }
}

export const genreStatsService = new GenreStatsService();
