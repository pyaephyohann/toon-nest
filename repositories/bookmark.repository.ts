/**
 * Bookmark Repository
 * Handles all bookmark-related database operations
 */

import prisma from "@/lib/prisma";
import { Bookmark } from "@/app/generated/prisma/client";

export class BookmarkRepository {
  /**
   * Find all bookmarks for a user with series data
   */
  async findByUserId(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ bookmarks: Bookmark[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        skip,
        take,
        include: {
          series: {
            include: {
              genres: {
                include: {
                  genre: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.bookmark.count({
        where: { userId },
      }),
    ]);

    return { bookmarks, total };
  }

  /**
   * Find bookmark by user and series
   */
  async findByUserAndSeries(
    userId: string,
    seriesId: string
  ): Promise<Bookmark | null> {
    return prisma.bookmark.findUnique({
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
   * Create a bookmark
   */
  async create(userId: string, seriesId: string): Promise<Bookmark> {
    return prisma.bookmark.create({
      data: {
        userId,
        seriesId,
      },
      include: {
        series: true,
      },
    });
  }

  /**
   * Delete a bookmark by ID
   */
  async delete(id: string): Promise<Bookmark> {
    return prisma.bookmark.delete({
      where: { id },
    });
  }

  /**
   * Delete bookmark by user and series
   */
  async deleteByUserAndSeries(
    userId: string,
    seriesId: string
  ): Promise<Bookmark> {
    return prisma.bookmark.delete({
      where: {
        userId_seriesId: {
          userId,
          seriesId,
        },
      },
    });
  }

  /**
   * Count bookmarks for a series
   */
  async countBySeriesId(seriesId: string): Promise<number> {
    return prisma.bookmark.count({
      where: { seriesId },
    });
  }
}

export const bookmarkRepository = new BookmarkRepository();
