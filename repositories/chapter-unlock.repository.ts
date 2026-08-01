/**
 * Chapter Unlock Repository
 * Handles chapter unlock records for premium/AD chapters
 */

import prisma from "@/lib/prisma";
import { ChapterUnlock } from "@/app/generated/prisma/client";

export class ChapterUnlockRepository {
  /**
   * Find all chapter unlocks for a user
   */
  async findByUserId(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ unlocks: ChapterUnlock[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [unlocks, total] = await Promise.all([
      prisma.chapterUnlock.findMany({
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
          createdAt: "desc",
        },
      }),
      prisma.chapterUnlock.count({
        where: { userId },
      }),
    ]);

    return { unlocks, total };
  }

  /**
   * Find unlock record by user and chapter
   */
  async findByUserAndChapter(
    userId: string,
    chapterId: string
  ): Promise<ChapterUnlock | null> {
    return prisma.chapterUnlock.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
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
   * Create an unlock record
   */
  async create(
    userId: string,
    chapterId: string,
    expiresAt?: Date
  ): Promise<ChapterUnlock> {
    return prisma.chapterUnlock.create({
      data: {
        userId,
        chapterId,
        expiresAt,
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
   * Delete an unlock record
   */
  async delete(id: string): Promise<ChapterUnlock> {
    return prisma.chapterUnlock.delete({
      where: { id },
    });
  }

  /**
   * Remove unlock by user and chapter
   */
  async deleteByUserAndChapter(
    userId: string,
    chapterId: string
  ): Promise<ChapterUnlock> {
    return prisma.chapterUnlock.delete({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
  }

  /**
   * Delete expired unlock records
   */
  async deleteExpired(): Promise<{ count: number }> {
    const now = new Date();
    const result = await prisma.chapterUnlock.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    return { count: result.count };
  }

  /**
   * Check if user has unlocked a chapter
   */
  async isChapterUnlocked(
    userId: string,
    chapterId: string
  ): Promise<boolean> {
    const unlock = await prisma.chapterUnlock.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    if (!unlock) {
      return false;
    }

    // Check if unlock has expired
    if (unlock.expiresAt && unlock.expiresAt < new Date()) {
      return false;
    }

    return true;
  }
}

export const chapterUnlockRepository = new ChapterUnlockRepository();
