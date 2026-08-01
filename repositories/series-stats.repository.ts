/**
 * Series Stats Repository
 * Handles series analytics data operations
 */

import prisma from "@/lib/prisma";
import { SeriesStats, TimePeriod } from "@/app/generated/prisma/client";

export class SeriesStatsRepository {
  /**
   * Find stats for a series
   */
  async findBySeriesId(
    seriesId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ stats: SeriesStats[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [stats, total] = await Promise.all([
      prisma.seriesStats.findMany({
        where: { seriesId },
        skip,
        take,
        orderBy: {
          date: "desc",
        },
      }),
      prisma.seriesStats.count({
        where: { seriesId },
      }),
    ]);

    return { stats, total };
  }

  /**
   * Find stats for a series by time period
   */
  async findBySeriesIdAndPeriod(
    seriesId: string,
    period: TimePeriod,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ stats: SeriesStats[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [stats, total] = await Promise.all([
      prisma.seriesStats.findMany({
        where: {
          seriesId,
          period,
        },
        skip,
        take,
        orderBy: {
          date: "desc",
        },
      }),
      prisma.seriesStats.count({
        where: {
          seriesId,
          period,
        },
      }),
    ]);

    return { stats, total };
  }

  /**
   * Create a stats entry
   */
  async create(
    seriesId: string,
    date: Date,
    period: TimePeriod,
    data: {
      views?: number;
      readers?: number;
      bookmarks?: number;
      ratings?: number;
    }
  ): Promise<SeriesStats> {
    return prisma.seriesStats.create({
      data: {
        seriesId,
        date,
        period,
        ...data,
      },
    });
  }

  /**
   * Update a stats entry
   */
  async update(
    id: string,
    data: {
      views?: number;
      readers?: number;
      bookmarks?: number;
      ratings?: number;
    }
  ): Promise<SeriesStats> {
    return prisma.seriesStats.update({
      where: { id },
      data,
    });
  }

  /**
   * Create or update a stats entry
   */
  async upsert(
    seriesId: string,
    date: Date,
    period: TimePeriod,
    data: {
      views?: number;
      readers?: number;
      bookmarks?: number;
      ratings?: number;
    }
  ): Promise<SeriesStats> {
    return prisma.seriesStats.upsert({
      where: {
        seriesId_date_period: {
          seriesId,
          date,
          period,
        },
      },
      create: {
        seriesId,
        date,
        period,
        ...data,
      },
      update: data,
    });
  }

  /**
   * Aggregate stats over date range
   */
  async aggregateBySeriesId(
    seriesId: string,
    period: TimePeriod,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalViews: number;
    totalReaders: number;
    totalBookmarks: number;
    totalRatings: number;
  }> {
    const result = await prisma.seriesStats.aggregate({
      where: {
        seriesId,
        period,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        views: true,
        readers: true,
        bookmarks: true,
        ratings: true,
      },
    });

    return {
      totalViews: result._sum.views || 0,
      totalReaders: result._sum.readers || 0,
      totalBookmarks: result._sum.bookmarks || 0,
      totalRatings: result._sum.ratings || 0,
    };
  }
}

export const seriesStatsRepository = new SeriesStatsRepository();
