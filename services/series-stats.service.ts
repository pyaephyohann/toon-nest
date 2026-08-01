/**
 * Series Stats Service
 * Manages series analytics with aggregation logic
 */

import { seriesStatsRepository, seriesRepository, bookmarkRepository, ratingRepository } from "@/repositories";
import { TimePeriod } from "@/app/generated/prisma/client";

export class SeriesStatsService {
  /**
   * Get stats for a series
   */
  async getSeriesStats(
    seriesId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return seriesStatsRepository.findBySeriesId(seriesId, options);
  }

  /**
   * Get stats for a series by time period
   */
  async getSeriesStatsByPeriod(
    seriesId: string,
    period: TimePeriod,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return seriesStatsRepository.findBySeriesIdAndPeriod(seriesId, period, options);
  }

  /**
   * Record daily/weekly/monthly stats
   */
  async recordStats(
    seriesId: string,
    period: TimePeriod,
    data: {
      views?: number;
      readers?: number;
      bookmarks?: number;
      ratings?: number;
    }
  ) {
    // Validate period
    if (!Object.values(TimePeriod).includes(period)) {
      throw new Error("Invalid period");
    }

    const date = this.getPeriodDate(period);
    
    return seriesStatsRepository.upsert(seriesId, date, period, data);
  }

  /**
   * Aggregate stats over date range
   */
  async aggregateSeriesStats(
    seriesId: string,
    period: TimePeriod,
    startDate: Date,
    endDate: Date
  ) {
    return seriesStatsRepository.aggregateBySeriesId(
      seriesId,
      period,
      startDate,
      endDate
    );
  }

  /**
   * Update series performance fields from raw data
   */
  async updateSeriesPerformance(seriesId: string) {
    // Get current stats from series
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Calculate actual stats from repositories
    const [bookmarkCount, ratingData] = await Promise.all([
      bookmarkRepository.countBySeriesId(seriesId),
      ratingRepository.averageBySeriesId(seriesId),
    ]);

    // Update series with calculated stats
    await seriesRepository.updateStats(seriesId);

    return {
      bookmarkCount,
      averageRating: ratingData,
    };
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

export const seriesStatsService = new SeriesStatsService();
