/**
 * Reading History Service
 * Tracks user reading progress with upsert logic
 */

import { readingHistoryRepository, chapterRepository, seriesRepository } from "@/repositories";

export class ReadingHistoryService {
  /**
   * Get user's reading history with pagination
   */
  async getHistory(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return readingHistoryRepository.findByUserId(userId, options);
  }

  /**
   * Get recent reading history
   */
  async getRecentHistory(userId: string, limit: number = 10) {
    return readingHistoryRepository.findRecentByUserId(userId, limit);
  }

  /**
   * Save or update reading progress (upsert pattern)
   */
  async saveReadingProgress(userId: string, chapterId: string) {
    // Check if chapter exists
    const chapter = await chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Check if history entry exists
    const existing = await readingHistoryRepository.findByUserAndChapter(
      userId,
      chapterId
    );

    if (existing) {
      // Update timestamp
      return readingHistoryRepository.update(existing.id);
    } else {
      // Create new entry
      const history = await readingHistoryRepository.create(userId, chapterId);
      
      // Increment chapter views
      await chapterRepository.incrementViews(chapterId);
      
      return history;
    }
  }

  /**
   * Clear all reading history for user
   */
  async clearHistory(userId: string) {
    return readingHistoryRepository.deleteByUserId(userId);
  }

  /**
   * Remove specific history entry
   */
  async removeHistoryEntry(userId: string, chapterId: string) {
    const history = await readingHistoryRepository.findByUserAndChapter(
      userId,
      chapterId
    );
    if (!history) {
      throw new Error("History entry not found");
    }

    return readingHistoryRepository.delete(history.id);
  }
}

export const readingHistoryService = new ReadingHistoryService();
