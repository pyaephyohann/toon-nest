/**
 * Chapter Service
 * Handles chapter business logic
 */

import { chapterRepository, seriesRepository } from "@/repositories";
import { UnlockType } from "@/app/generated/prisma/client";

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
    userId: string
  ): Promise<boolean> {
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Free chapters are accessible to all
    if (chapter.unlockType === UnlockType.FREE) {
      return true;
    }

    // AD and PREMIUM chapters require user authentication
    // This will be implemented with user subscription checks
    // For now, return false for non-free chapters
    return false;
  }
}

export const chapterService = new ChapterService();
