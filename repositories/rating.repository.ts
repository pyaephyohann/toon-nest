/**
 * Rating Repository
 * Handles all rating database operations
 */

import prisma from "@/lib/prisma";
import { Rating } from "@/app/generated/prisma/client";

export class RatingRepository {
  /**
   * Find all ratings by a user
   */
  async findByUserId(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ ratings: Rating[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { userId },
        skip,
        take,
        include: {
          series: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.rating.count({
        where: { userId },
      }),
    ]);

    return { ratings, total };
  }

  /**
   * Find all ratings for a series
   */
  async findBySeriesId(
    seriesId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ ratings: Rating[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { seriesId },
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.rating.count({
        where: { seriesId },
      }),
    ]);

    return { ratings, total };
  }

  /**
   * Find user's rating for a series
   */
  async findByUserAndSeries(
    userId: string,
    seriesId: string
  ): Promise<Rating | null> {
    return prisma.rating.findUnique({
      where: {
        userId_seriesId: {
          userId,
          seriesId,
        },
      },
      include: {
        series: true,
      },
    });
  }

  /**
   * Create a rating
   */
  async create(
    userId: string,
    seriesId: string,
    rating: number
  ): Promise<Rating> {
    return prisma.rating.create({
      data: {
        userId,
        seriesId,
        rating,
      },
      include: {
        series: true,
      },
    });
  }

  /**
   * Update a rating
   */
  async update(id: string, rating: number): Promise<Rating> {
    return prisma.rating.update({
      where: { id },
      data: { rating },
      include: {
        series: true,
      },
    });
  }

  /**
   * Delete a rating
   */
  async delete(id: string): Promise<Rating> {
    return prisma.rating.delete({
      where: { id },
    });
  }

  /**
   * Calculate average rating for a series
   */
  async averageBySeriesId(seriesId: string): Promise<number> {
    const result = await prisma.rating.aggregate({
      where: { seriesId },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating || 0;
  }

  /**
   * Count ratings for a series
   */
  async countBySeriesId(seriesId: string): Promise<number> {
    return prisma.rating.count({
      where: { seriesId },
    });
  }

  /**
   * Get total ratings count (admin)
   */
  async getTotalRatings(): Promise<number> {
    return prisma.rating.count();
  }
}

export const ratingRepository = new RatingRepository();
