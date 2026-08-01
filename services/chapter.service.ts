/**
 * Chapter Service
 * Handles chapter business logic
 */

import { chapterRepository, seriesRepository } from "@/repositories";
import { UnlockType } from "@/app/generated/prisma/client";
import { subscriptionService } from "./subscription.service";
import { chapterUnlockService } from "./chapter-unlock.service";

export class ChapterService {
  /**
   * Get chapter by ID
   */
  async getChapterById(id: string) {
    const chapter = await chapterRepository.findById(id);
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    return chapter;
  }

  /**
   * Get chapter by series and number
   */
  async getChapterBySeriesAndNumber(seriesId: string, chapterNumber: number) {
    const chapter = await chapterRepository.findBySeriesAndNumber(
      seriesId,
      chapterNumber
    );
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    return chapter;
  }

  /**
   * Get all chapters for a series
   */
  async getChaptersBySeriesId(
    seriesId: string,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: "asc" | "desc";
    }
  ) {
    // Check if series exists
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    return chapterRepository.findBySeriesId(seriesId, options);
  }

  /**
   * Create a new chapter
   */
  async createChapter(data: {
    seriesId: string;
    chapterNumber: number;
    title?: string;
    slug: string;
    unlockType?: UnlockType;
  }) {
    // Check if series exists
    const series = await seriesRepository.findById(data.seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Check if chapter number already exists
    const existing = await chapterRepository.findBySeriesAndNumber(
      data.seriesId,
      data.chapterNumber
    );
    if (existing) {
      throw new Error("Chapter number already exists");
    }

    const chapter = await chapterRepository.create(data);

    // Update series stats
    await seriesRepository.updateStats(data.seriesId);

    return chapter;
  }

  /**
   * Update chapter
   */
  async updateChapter(
    id: string,
    data: {
      title?: string;
      slug?: string;
      unlockType?: UnlockType;
    }
  ) {
    const existing = await chapterRepository.findById(id);
    if (!existing) {
      throw new Error("Chapter not found");
    }

    return chapterRepository.update(id, data);
  }

  /**
   * Delete chapter
   */
  async deleteChapter(id: string) {
    const existing = await chapterRepository.findById(id);
    if (!existing) {
      throw new Error("Chapter not found");
    }

    const chapter = await chapterRepository.delete(id);

    // Update series stats
    await seriesRepository.updateStats(existing.seriesId);

    return chapter;
  }

  /**
   * Increment chapter views
   */
  async incrementChapterViews(id: string) {
    const chapter = await chapterRepository.incrementViews(id);

    // Also increment series views
    await seriesRepository.incrementViews(chapter.seriesId);

    return chapter;
  }

  /**
   * Get latest chapters
   */
  async getLatestChapters(limit: number = 20) {
    return chapterRepository.getLatest(limit);
  }

  /**
   * Get latest chapters for a series
   */
  async getLatestChaptersBySeriesId(seriesId: string, limit: number = 5) {
    return chapterRepository.getLatestBySeriesId(seriesId, limit);
  }

  /**
   * Check if user can access chapter
   */
  async canUserAccessChapter(
    chapterId: string,
    userId: string | null
  ): Promise<{ canAccess: boolean; reason?: string }> {
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Free chapters are accessible to all
    if (chapter.unlockType === UnlockType.FREE) {
      return { canAccess: true };
    }

    // Premium and AD chapters require authentication
    if (!userId) {
      return { canAccess: false, reason: "Authentication required" };
    }

    // Check premium subscription for premium chapters
    if (chapter.unlockType === UnlockType.PREMIUM) {
      const isPremium = await subscriptionService.isUserPremium(userId);
      if (!isPremium) {
        return { canAccess: false, reason: "Premium subscription required" };
      }
      return { canAccess: true };
    }

    // Check unlock record for AD chapters
    if (chapter.unlockType === UnlockType.AD) {
      const isUnlocked = await chapterUnlockService.checkUnlock(userId, chapterId);
      if (!isUnlocked) {
        return { canAccess: false, reason: "Chapter not unlocked" };
      }
      return { canAccess: true };
    }

    return { canAccess: false, reason: "Unknown unlock type" };
  }

  /**
   * Get chapter with access information
   */
  async getChapterWithAccessInfo(chapterId: string, userId: string | null) {
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const accessInfo = await this.canUserAccessChapter(chapterId, userId);

    return {
      ...chapter,
      access: accessInfo,
    };
  }

  /**
   * Unlock chapter for user
   */
  async unlockChapterForUser(userId: string, chapterId: string) {
    return chapterUnlockService.unlockChapter(userId, chapterId);
  }

  /**
   * Unlock chapter via AD for user
   */
  async unlockChapterWithAd(userId: string, chapterId: string) {
    return chapterUnlockService.unlockChapterWithAd(userId, chapterId);
  }
}

export const chapterService = new ChapterService();
