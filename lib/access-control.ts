/**
 * Access Control Utilities
 * Centralized premium access control logic
 */

import { subscriptionRepository, chapterUnlockRepository } from "@/repositories";
import { Chapter, UnlockType } from "@/app/generated/prisma/client";

export type AccessStatus = "FREE" | "LOCKED" | "UNLOCKED";

/**
 * Check if user has active premium subscription
 */
export async function isUserPremium(userId: string): Promise<boolean> {
  return subscriptionRepository.isUserPremium(userId);
}

/**
 * Check if user can access a specific chapter
 */
export async function canAccessChapter(
  userId: string | null,
  chapter: Chapter
): Promise<boolean> {
  // Free chapters are accessible to everyone
  if (chapter.unlockType === UnlockType.FREE) {
    return true;
  }

  // AD chapters are accessible to everyone
  if (chapter.unlockType === UnlockType.AD) {
    return true;
  }

  // PREMIUM chapters require premium or individual unlock
  if (chapter.unlockType === UnlockType.PREMIUM) {
    // If no user, cannot access
    if (!userId) {
      return false;
    }

    // Check if user has premium subscription
    const isPremium = await subscriptionRepository.isUserPremium(userId);
    if (isPremium) {
      return true;
    }

    // Check if user has individual chapter unlock
    const hasUnlock = await chapterUnlockRepository.findByUserAndChapter(userId, chapter.id);
    if (hasUnlock) {
      return true;
    }

    return false;
  }

  return false;
}

/**
 * Get chapter access status for a user
 */
export async function getChapterAccessStatus(
  userId: string | null,
  chapter: Chapter
): Promise<AccessStatus> {
  // Free chapters
  if (chapter.unlockType === UnlockType.FREE) {
    return "FREE";
  }

  // AD chapters
  if (chapter.unlockType === UnlockType.AD) {
    return "FREE";
  }

  // PREMIUM chapters
  if (chapter.unlockType === UnlockType.PREMIUM) {
    if (!userId) {
      return "LOCKED";
    }

    const isPremium = await subscriptionRepository.isUserPremium(userId);
    if (isPremium) {
      return "UNLOCKED";
    }

    const hasUnlock = await chapterUnlockRepository.findByUserAndChapter(userId, chapter.id);
    if (hasUnlock) {
      return "UNLOCKED";
    }

    return "LOCKED";
  }

  return "FREE";
}

/**
 * Middleware helper to check premium access
 * Returns error response if access is denied
 */
export async function checkPremiumAccess(
  userId: string | null,
  chapter: Chapter
): Promise<{ allowed: boolean; error?: { message: string; code: string } }> {
  const canAccess = await canAccessChapter(userId, chapter);

  if (!canAccess) {
    return {
      allowed: false,
      error: {
        message: "This chapter requires a premium subscription",
        code: "PREMIUM_REQUIRED",
      },
    };
  }

  return { allowed: true };
}

/**
 * Check if user has active premium (optimized for frequent checks)
 */
export async function hasActivePremium(userId: string): Promise<boolean> {
  return subscriptionRepository.isUserPremium(userId);
}
