/**
 * Genre Stats Repository
 * Handles genre analytics data operations
 */

import prisma from "@/lib/prisma";
import { GenreStats, TimePeriod } from "@/app/generated/prisma/client";

export class GenreStatsRepository {
  /**
   * Find stats for a genre
   */
  async findByGenreId(
    genreId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ stats: GenreStats[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [stats, total] = await Promise.all([
      prisma.genreStats.findMany({
        where: { genreId },
        skip,
        take,
        orderBy: {
          date: "desc",
        },
      }),
      prisma.genreStats.count({
        where: { genreId },
      }),
    ]);

    return { stats, total };
  }

  /**
   * Find stats for a genre by time period
   */
  async findByGenreIdAndPeriod(
    genreId: string,
    period: TimePeriod,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ stats: GenreStats[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [stats, total] = await Promise.all([
      prisma.genreStats.findMany({
        where: {
          genreId,
          period,
        },
        skip,
        take,
        orderBy: {
          date: "desc",
        },
      }),
      prisma.genreStats.count({
        where: {
          genreId,
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
    genreId: string,
    date: Date,
    period: TimePeriod,
    data: {
      readers?: number;
      seriesCount?: number;
    }
  ): Promise<GenreStats> {
    return prisma.genreStats.create({
      data: {
        genreId,
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
      readers?: number;
      seriesCount?: number;
    }
  ): Promise<GenreStats> {
    return prisma.genreStats.update({
      where: { id },
      data,
    });
  }

  /**
   * Create or update a stats entry
   */
  async upsert(
    genreId: string,
    date: Date,
    period: TimePeriod,
    data: {
      readers?: number;
      seriesCount?: number;
    }
  ): Promise<GenreStats> {
    return prisma.genreStats.upsert({
      where: {
        genreId_date_period: {
          genreId,
          date,
          period,
        },
      },
      create: {
        genreId,
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
  async aggregateByGenreId(
    genreId: string,
    period: TimePeriod,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalReaders: number;
    totalSeriesCount: number;
  }> {
    const result = await prisma.genreStats.aggregate({
      where: {
        genreId,
        period,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        readers: true,
        seriesCount: true,
      },
    });

    return {
      totalReaders: result._sum.readers || 0,
      totalSeriesCount: result._sum.seriesCount || 0,
    };
  }
}

export const genreStatsRepository = new GenreStatsRepository();
