/**
 * Chapter Service
 * Handles chapter business logic
 */

import { chapterRepository, seriesRepository } from "@/repositories";
import { UnlockType } from "@/app/generated/prisma/client";
import { subscriptionService } from "./subscription.service";
import { chapterUnlockService } from "./chapter-unlock.service";
import { canAccessChapter, getChapterAccessStatus } from "@/lib/access-control";
import { createChapterSchema, updateChapterSchema } from "@/lib/validations/chapter.validation";

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
   * Get all chapters globally (admin)
   */
  async getAllChapters(options?: {
    skip?: number;
    take?: number;
    search?: string;
    seriesId?: string;
    unlockType?: "FREE" | "AD" | "PREMIUM";
    sortBy?: "chapterNumber" | "views" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
  }) {
    return chapterRepository.findAll(options);
  }

  /**
   * Create a new chapter
   */
  async createChapter(data: {
    seriesId: string;
    chapterNumber: number;
    title?: string;
    slug?: string;
    unlockType?: UnlockType;
  }) {
    // Validate input using Zod
    const validatedData = createChapterSchema.parse(data);

    // Auto-generate slug if not provided
    const slug = validatedData.slug || `${validatedData.chapterNumber}`;

    // Check if series exists
    const series = await seriesRepository.findById(validatedData.seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Check if chapter number already exists
    const existing = await chapterRepository.findBySeriesAndNumber(
      validatedData.seriesId,
      validatedData.chapterNumber
    );
    if (existing) {
      throw new Error("Chapter number already exists");
    }

    const chapter = await chapterRepository.create({
      ...validatedData,
      slug,
    });

    // Update series stats
    await seriesRepository.updateStats(validatedData.seriesId);

    return chapter;
  }

  /**
   * Update chapter
   */
  async updateChapter(
    id: string,
    data: {
      chapterNumber?: number;
      title?: string;
      slug?: string;
      unlockType?: UnlockType;
    }
  ) {
    // Validate input using Zod
    const validatedData = updateChapterSchema.parse(data);

    const existing = await chapterRepository.findById(id);
    if (!existing) {
      throw new Error("Chapter not found");
    }

    // Check if chapter number conflicts if changing
    if (validatedData.chapterNumber && Number(validatedData.chapterNumber) !== Number(existing.chapterNumber)) {
      const conflict = await chapterRepository.findBySeriesAndNumber(
        existing.seriesId,
        validatedData.chapterNumber
      );
      if (conflict) {
        throw new Error("Chapter number already exists");
      }
    }

    return chapterRepository.update(id, validatedData);
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

    const canAccess = await canAccessChapter(userId, chapter);

    if (!canAccess) {
      if (!userId) {
        return { canAccess: false, reason: "Authentication required" };
      }
      return { canAccess: false, reason: "Premium subscription required" };
    }

    return { canAccess: true };
  }

  /**
   * Get chapter with access information
   */
  async getChapterWithAccessInfo(chapterId: string, userId: string | null) {
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const accessStatus = await getChapterAccessStatus(userId, chapter);
    const accessInfo = await this.canUserAccessChapter(chapterId, userId);

    return {
      ...chapter,
      access: accessInfo,
      accessStatus,
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

  /**
   * Duplicate chapter
   */
  async duplicateChapter(chapterId: string, newChapterNumber: number) {
    const existing = await chapterRepository.findById(chapterId);
    if (!existing) {
      throw new Error("Chapter not found");
    }

    // Check if new chapter number already exists
    const conflict = await chapterRepository.findBySeriesAndNumber(
      existing.seriesId,
      newChapterNumber
    );
    if (conflict) {
      throw new Error("Chapter number already exists");
    }

    // Create new chapter
    const newChapter = await chapterRepository.create({
      seriesId: existing.seriesId,
      chapterNumber: newChapterNumber,
      title: existing.title ? `${existing.title} (Copy)` : undefined,
      slug: `${newChapterNumber}`,
      unlockType: existing.unlockType,
    });

    // Copy all pages
    const existingWithPages = await chapterRepository.findById(chapterId);
    if (existingWithPages && (existingWithPages as any).pages && (existingWithPages as any).pages.length > 0) {
      await chapterRepository.createPages(
        newChapter.id,
        (existingWithPages as any).pages.map((page: any) => page.imageUrl)
      );
    }

    // Update series stats
    await seriesRepository.updateStats(existing.seriesId);

    return newChapter;
  }

  /**
   * Bulk upload chapter pages
   */
  async bulkUploadPages(chapterId: string, imageUrls: string[]) {
    // Delete existing pages
    await chapterRepository.deletePages(chapterId);

    // Create new pages
    await chapterRepository.createPages(chapterId, imageUrls);

    return chapterRepository.findById(chapterId);
  }

  /**
   * Reorder chapter pages
   */
  async reorderPages(pageOrders: { id: string; pageNumber: number }[]) {
    return chapterRepository.reorderPages(pageOrders);
  }
}

export const chapterService = new ChapterService();
