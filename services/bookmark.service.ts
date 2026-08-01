/**
 * Bookmark Service
 * Manages user bookmarks with authorization and validation
 */

import { bookmarkRepository, seriesRepository } from "@/repositories";

export class BookmarkService {
  /**
   * Get user's bookmarks with pagination
   */
  async getBookmarks(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ) {
    return bookmarkRepository.findByUserId(userId, options);
  }

  /**
   * Toggle bookmark (add if not exists, remove if exists)
   */
  async toggleBookmark(userId: string, seriesId: string) {
    // Check if series exists
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Check if bookmark exists
    const existing = await bookmarkRepository.findByUserAndSeries(
      userId,
      seriesId
    );

    if (existing) {
      // Remove bookmark
      await bookmarkRepository.deleteByUserAndSeries(userId, seriesId);
      return { bookmarked: false, series };
    } else {
      // Add bookmark
      await bookmarkRepository.create(userId, seriesId);
      return { bookmarked: true, series };
    }
  }

  /**
   * Check if user has bookmarked series
   */
  async isBookmarked(userId: string, seriesId: string): Promise<boolean> {
    const bookmark = await bookmarkRepository.findByUserAndSeries(
      userId,
      seriesId
    );
    return !!bookmark;
  }

  /**
   * Add bookmark with duplicate check
   */
  async addBookmark(userId: string, seriesId: string) {
    // Check if series exists
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    // Check if already bookmarked
    const existing = await bookmarkRepository.findByUserAndSeries(
      userId,
      seriesId
    );
    if (existing) {
      throw new Error("Already bookmarked");
    }

    return bookmarkRepository.create(userId, seriesId);
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(userId: string, seriesId: string) {
    const bookmark = await bookmarkRepository.findByUserAndSeries(
      userId,
      seriesId
    );
    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    return bookmarkRepository.deleteByUserAndSeries(userId, seriesId);
  }
}

export const bookmarkService = new BookmarkService();
