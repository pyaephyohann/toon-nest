/**
 * Chapter Unlock Service
 * Manages chapter access permissions with premium integration
 */

import { chapterUnlockRepository, subscriptionRepository, chapterRepository } from "@/repositories";
import { UnlockType } from "@/app/generated/prisma/client";

export class ChapterUnlockService {
  /**
   * Get user's chapter unlocks
   */
  async getUserUnlocks(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return chapterUnlockRepository.findByUserId(userId, options);
  }

  /**
   * Unlock chapter (with premium check)
   */
  async unlockChapter(userId: string, chapterId: string) {
    // Check if chapter exists
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Free chapters don't need unlock
    if (chapter.unlockType === UnlockType.FREE) {
      throw new Error("Free chapters don't require unlock");
    }

    // Check if user has premium subscription
    const isPremium = await subscriptionRepository.isUserPremium(userId);
    if (!isPremium) {
      throw new Error("Premium subscription required");
    }

    // Check if already unlocked
    const existing = await chapterUnlockRepository.findByUserAndChapter(
      userId,
      chapterId
    );
    if (existing) {
      throw new Error("Chapter already unlocked");
    }

    // Premium chapters don't expire
    return chapterUnlockRepository.create(userId, chapterId);
  }

  /**
   * Unlock chapter via AD (24 hour expiry)
   */
  async unlockChapterWithAd(userId: string, chapterId: string) {
    // Check if chapter exists
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Only AD chapters can be unlocked via AD
    if (chapter.unlockType !== UnlockType.AD) {
      throw new Error("Only AD chapters can be unlocked via AD");
    }

    // Check if already unlocked
    const existing = await chapterUnlockRepository.findByUserAndChapter(
      userId,
      chapterId
    );
    if (existing) {
      throw new Error("Chapter already unlocked");
    }

    // AD unlocks expire in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return chapterUnlockRepository.create(userId, chapterId, expiresAt);
  }

  /**
   * Check if chapter is unlocked
   */
  async checkUnlock(userId: string, chapterId: string): Promise<boolean> {
    return chapterUnlockRepository.isChapterUnlocked(userId, chapterId);
  }

  /**
   * Clean up expired unlocks
   */
  async expireUnlocks() {
    return chapterUnlockRepository.deleteExpired();
  }

  /**
   * Remove unlock
   */
  async removeUnlock(userId: string, chapterId: string) {
    const existing = await chapterUnlockRepository.findByUserAndChapter(
      userId,
      chapterId
    );
    if (!existing) {
      throw new Error("Unlock not found");
    }

    return chapterUnlockRepository.deleteByUserAndChapter(userId, chapterId);
  }
}

export const chapterUnlockService = new ChapterUnlockService();
