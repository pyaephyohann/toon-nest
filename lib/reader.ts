/**
 * Reader Optimization Utilities
 * Reading progress persistence and chapter preloading with caching
 */

import { cache } from "./cache/provider";

const READING_PROGRESS_KEY = "reading_progress";

export interface ReadingProgress {
  seriesId: string;
  chapterId: string;
  pageNumber: number;
  timestamp: number;
}

/**
 * Chapter page cache with LRU eviction
 */
class ChapterPageCache {
  private cache = new Map<string, string[]>();
  private maxSize = 50; // Max 50 chapters cached
  private accessOrder = new Map<string, number>();
  private counter = 0;

  get(chapterId: string): string[] | null {
    const pages = this.cache.get(chapterId);
    if (pages !== undefined) {
      this.accessOrder.set(chapterId, this.counter++);
      return pages;
    }
    return null;
  }

  set(chapterId: string, pages: string[]): void {
    // Evict if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(chapterId)) {
      let lruKey: string | null = null;
      let lruTime = Infinity;
      
      for (const [key, time] of this.accessOrder.entries()) {
        if (time < lruTime) {
          lruTime = time;
          lruKey = key;
        }
      }
      
      if (lruKey) {
        this.cache.delete(lruKey);
        this.accessOrder.delete(lruKey);
      }
    }
    
    this.cache.set(chapterId, pages);
    this.accessOrder.set(chapterId, this.counter++);
  }

  has(chapterId: string): boolean {
    return this.cache.has(chapterId);
  }

  delete(chapterId: string): void {
    this.cache.delete(chapterId);
    this.accessOrder.delete(chapterId);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.counter = 0;
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Global chapter page cache
 */
export const chapterPageCache = new ChapterPageCache();

/**
 * Save reading progress to localStorage
 */
export function saveReadingProgress(progress: ReadingProgress): void {
  try {
    const allProgress = getAllReadingProgress();
    const key = `${progress.seriesId}_${progress.chapterId}`;
    allProgress[key] = progress;
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Failed to save reading progress:", error);
  }
}

/**
 * Get reading progress for a specific chapter
 */
export function getReadingProgress(seriesId: string, chapterId: string): ReadingProgress | null {
  try {
    const allProgress = getAllReadingProgress();
    const key = `${seriesId}_${chapterId}`;
    return allProgress[key] || null;
  } catch (error) {
    console.error("Failed to get reading progress:", error);
    return null;
  }
}

/**
 * Get all reading progress
 */
export function getAllReadingProgress(): Record<string, ReadingProgress> {
  try {
    const data = localStorage.getItem(READING_PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to get all reading progress:", error);
    return {};
  }
}

/**
 * Clear reading progress for a specific chapter
 */
export function clearReadingProgress(seriesId: string, chapterId: string): void {
  try {
    const allProgress = getAllReadingProgress();
    const key = `${seriesId}_${chapterId}`;
    delete allProgress[key];
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Failed to clear reading progress:", error);
  }
}

/**
 * Clear all reading progress
 */
export function clearAllReadingProgress(): void {
  try {
    localStorage.removeItem(READING_PROGRESS_KEY);
  } catch (error) {
    console.error("Failed to clear all reading progress:", error);
  }
}

/**
 * Preload an image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(src => preloadImage(src)));
}

/**
 * Get visible page numbers based on scroll position
 */
export function getVisiblePages(
  scrollTop: number,
  viewportHeight: number,
  pageHeight: number,
  totalPages: number,
  buffer: number = 2
): number[] {
  const startPage = Math.max(0, Math.floor(scrollTop / pageHeight) - buffer);
  const endPage = Math.min(
    totalPages - 1,
    Math.ceil((scrollTop + viewportHeight) / pageHeight) + buffer
  );
  
  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
}

/**
 * Cache chapter pages
 */
export function cacheChapterPages(chapterId: string, pages: string[]): void {
  chapterPageCache.set(chapterId, pages);
}

/**
 * Get cached chapter pages
 */
export function getCachedChapterPages(chapterId: string): string[] | null {
  return chapterPageCache.get(chapterId);
}

/**
 * Prefetch next and previous chapters
 */
export async function prefetchAdjacentChapters(
  currentChapterId: string,
  nextChapterId: string | null,
  previousChapterId: string | null,
  fetchFn: (chapterId: string) => Promise<string[]>
): Promise<void> {
  const prefetches: Promise<void>[] = [];
  
  if (nextChapterId && !chapterPageCache.has(nextChapterId)) {
    prefetches.push(
      fetchFn(nextChapterId).then(pages => {
        chapterPageCache.set(nextChapterId, pages);
        // Preload first few images
        const firstImages = pages.slice(0, 3);
        preloadImages(firstImages);
      })
    );
  }
  
  if (previousChapterId && !chapterPageCache.has(previousChapterId)) {
    prefetches.push(
      fetchFn(previousChapterId).then(pages => {
        chapterPageCache.set(previousChapterId, pages);
        // Preload first few images
        const firstImages = pages.slice(0, 3);
        preloadImages(firstImages);
      })
    );
  }
  
  await Promise.all(prefetches);
}

/**
 * Clear chapter cache
 */
export function clearChapterCache(chapterId?: string): void {
  if (chapterId) {
    chapterPageCache.delete(chapterId);
  } else {
    chapterPageCache.clear();
  }
}

/**
 * Get cache statistics
 */
export function getChapterCacheStats() {
  return {
    size: chapterPageCache.size(),
    maxSize: 50,
  };
}
