/**
 * Reader Optimization Utilities
 * Reading progress persistence and chapter preloading
 */

const READING_PROGRESS_KEY = "reading_progress";

export interface ReadingProgress {
  seriesId: string;
  chapterId: string;
  pageNumber: number;
  timestamp: number;
}

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
