/**
 * Reading History Repository
 * Handles all reading history database operations
 */

import prisma from "@/lib/prisma";
import { ReadingHistory } from "@/app/generated/prisma/client";

export class ReadingHistoryRepository {
  /**
   * Find reading history for a user with pagination
   */
  async findByUserId(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ histories: ReadingHistory[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [histories, total] = await Promise.all([
      prisma.readingHistory.findMany({
        where: { userId },
        skip,
        take,
        include: {
          chapter: {
            include: {
              series: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.readingHistory.count({
        where: { userId },
      }),
    ]);

    return { histories, total };
  }

  /**
   * Find reading history by user and chapter
   */
  async findByUserAndChapter(
    userId: string,
    chapterId: string
  ): Promise<ReadingHistory | null> {
    return prisma.readingHistory.findFirst({
      where: {
        userId,
        chapterId,
      },
      include: {
        chapter: {
          include: {
            series: true,
          },
        },
      },
    });
  }

  /**
   * Create a reading history entry
   */
  async create(userId: string, chapterId: string): Promise<ReadingHistory> {
    return prisma.readingHistory.create({
      data: {
        userId,
        chapterId,
      },
      include: {
        chapter: {
          include: {
            series: true,
          },
        },
      },
    });
  }

  /**
   * Update reading history timestamp
   */
  async update(id: string): Promise<ReadingHistory> {
    return prisma.readingHistory.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
      include: {
        chapter: {
          include: {
            series: true,
          },
        },
      },
    });
  }

  /**
   * Delete a reading history entry
   */
  async delete(id: string): Promise<ReadingHistory> {
    return prisma.readingHistory.delete({
      where: { id },
    });
  }

  /**
   * Delete all reading history for a user
   */
  async deleteByUserId(userId: string): Promise<{ count: number }> {
    const result = await prisma.readingHistory.deleteMany({
      where: { userId },
    });
    return { count: result.count };
  }

  /**
   * Find recent reading history for a user
   */
  async findRecentByUserId(
    userId: string,
    limit: number = 10
  ): Promise<ReadingHistory[]> {
    return prisma.readingHistory.findMany({
      where: { userId },
      take: limit,
      include: {
        chapter: {
          include: {
            series: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
}

export const readingHistoryRepository = new ReadingHistoryRepository();
