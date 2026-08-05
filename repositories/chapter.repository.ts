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

  /**
   * Get total chapters count (admin)
   */
  async getTotalChapters(): Promise<number> {
    return prisma.chapter.count();
  }

  /**
   * Get recent chapters (admin)
   */
  async getRecentChapters(limit: number = 10) {
    return prisma.chapter.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        createdAt: true,
        series: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * Find all chapters globally (admin)
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    search?: string;
    seriesId?: string;
    unlockType?: "FREE" | "AD" | "PREMIUM";
    sortBy?: "chapterNumber" | "views" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
  }): Promise<{ chapters: Chapter[]; total: number }> {
    const { skip = 0, take = 20, search, seriesId, unlockType, sortBy = "createdAt", sortOrder = "desc" } = options || {};

    const where: any = {};

    if (seriesId) {
      where.seriesId = seriesId;
    }

    if (unlockType) {
      where.unlockType = unlockType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { series: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          _count: {
            select: {
              pages: true,
            },
          },
        },
      }),
      prisma.chapter.count({ where }),
    ]);

    return { chapters, total };
  }

  /**
   * Create a chapter page
   */
  async createPage(data: {
    chapterId: string;
    pageNumber: number;
    imageUrl: string;
  }) {
    return prisma.chapterPage.create({
      data,
    });
  }

  /**
   * Bulk create chapter pages
   */
  async createPages(chapterId: string, imageUrls: string[]) {
    const pages = imageUrls.map((imageUrl, index) => ({
      chapterId,
      pageNumber: index + 1,
      imageUrl,
    }));

    return prisma.chapterPage.createMany({
      data: pages,
    });
  }

  /**
   * Update a chapter page
   */
  async updatePage(pageId: string, data: { imageUrl?: string; pageNumber?: number }) {
    return prisma.chapterPage.update({
      where: { id: pageId },
      data,
    });
  }

  /**
   * Update chapter number
   */
  async updateChapterNumber(id: string, chapterNumber: number) {
    return prisma.chapter.update({
      where: { id },
      data: { chapterNumber },
      include: {
        series: true,
      },
    });
  }

  /**
   * Delete a chapter page
   */
  async deletePage(pageId: string) {
    return prisma.chapterPage.delete({
      where: { id: pageId },
    });
  }

  /**
   * Delete all pages for a chapter
   */
  async deletePages(chapterId: string) {
    return prisma.chapterPage.deleteMany({
      where: { chapterId },
    });
  }

  /**
   * Reorder chapter pages
   */
  async reorderPages(pageOrders: { id: string; pageNumber: number }[]) {
    return prisma.$transaction(
      pageOrders.map(({ id, pageNumber }) =>
        prisma.chapterPage.update({
          where: { id },
          data: { pageNumber },
        })
      )
    );
  }
}

export const chapterRepository = new ChapterRepository();
