/**
 * Chapter Types
 * Chapter-related TypeScript types
 */

export interface Chapter {
  id: string;
  seriesId: string;
  chapterNumber: number;
  title?: string;
  slug: string;
  views: number;
  unlockType: "FREE" | "AD" | "PREMIUM";
  createdAt: Date;
  updatedAt: Date;
  series?: ChapterSeries;
  pages?: ChapterPage[];
}

export interface ChapterPage {
  id: string;
  chapterId: string;
  pageNumber: number;
  imageUrl: string;
}

export interface ChapterSeries {
  id: string;
  title: string;
  slug: string;
}

export interface ChapterFilters {
  seriesId?: string;
  orderBy?: "chapterNumber" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

export interface ChapterListResponse {
  chapters: Chapter[];
  total: number;
  page: number;
  limit: number;
}
