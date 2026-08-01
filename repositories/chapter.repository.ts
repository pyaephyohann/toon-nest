/**
 * Chapter Repository
 * Handles all chapter-related database operations
 */

import prisma from "@/lib/prisma";
import { Chapter, UnlockType } from "@/app/generated/prisma/client";

export class ChapterRepository {
  /**
   * Find chapter by ID
   */
  async findById(id: string): Promise<Chapter | null> {
    return prisma.chapter.findUnique({
      where: { id },
      include: {
        series: true,
        pages: {
          orderBy: {
            pageNumber: "asc",
          },
        },
      },
    });
  }

  /**
   * Find chapter by series ID and chapter number
   */
  async findBySeriesAndNumber(
    seriesId: string,
    chapterNumber: number
  ): Promise<Chapter | null> {
    return prisma.chapter.findUnique({
      where: {
        seriesId_chapterNumber: {
          seriesId,
          chapterNumber,
        },
      },
      include: {
        series: true,
        pages: {
          orderBy: {
            pageNumber: "asc",
          },
        },
      },
    });
  }

  /**
   * Find all chapters for a series
   */
  async findBySeriesId(
    seriesId: string,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: "asc" | "desc";
    }
  ): Promise<{ chapters: Chapter[]; total: number }> {
    const { skip = 0, take = 20, orderBy = "asc" } = options || {};

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where: { seriesId },
        skip,
        take,
        orderBy: {
          chapterNumber: orderBy,
        },
        include: {
          series: true,
        },
      }),
      prisma.chapter.count({
        where: { seriesId },
      }),
    ]);

    return { chapters, total };
  }

  /**
   * Create a new chapter
   */
  async create(data: {
    seriesId: string;
    chapterNumber: number;
    title?: string;
    slug: string;
    unlockType?: UnlockType;
  }): Promise<Chapter> {
    return prisma.chapter.create({
      data,
      include: {
        series: true,
      },
    });
  }

  /**
   * Update chapter
   */
  async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      unlockType?: UnlockType;
    }
  ): Promise<Chapter> {
    return prisma.chapter.update({
      where: { id },
      data,
      include: {
        series: true,
      },
    });
  }

  /**
   * Delete chapter
   */
  async delete(id: string): Promise<Chapter> {
    return prisma.chapter.delete({
      where: { id },
    });
  }

  /**
   * Increment view count
   */
  async incrementViews(id: string): Promise<Chapter> {
    return prisma.chapter.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get latest chapters across all series
   */
  async getLatest(limit: number = 20): Promise<Chapter[]> {
    return prisma.chapter.findMany({
      take: limit,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        series: true,
      },
    });
  }

  /**
   * Get latest chapters for a specific series
   */
  async getLatestBySeriesId(
    seriesId: string,
    limit: number = 5
  ): Promise<Chapter[]> {
    return prisma.chapter.findMany({
      where: { seriesId },
      take: limit,
      orderBy: {
        chapterNumber: "desc",
      },
      include: {
        series: true,
      },
    });
  }
}

export const chapterRepository = new ChapterRepository();
