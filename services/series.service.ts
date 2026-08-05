/**
 * Series Service
 * Handles series business logic
 */

import { seriesRepository } from "@/repositories";
import { SeriesStatus } from "@/app/generated/prisma/client";
import { createMangaSchema, updateMangaSchema } from "@/lib/validations/manga.validation";

export class SeriesService {
  /**
   * Get series with full details
   */
  async getSeriesById(id: string) {
    const series = await seriesRepository.findById(id);
    if (!series) {
      throw new Error("Series not found");
    }
    return series;
  }

  /**
   * Get series by slug
   */
  async getSeriesBySlug(slug: string) {
    const series = await seriesRepository.findBySlug(slug);
    if (!series) {
      throw new Error("Series not found");
    }
    return series;
  }

  /**
   * Get all series with filters
   */
  async getAllSeries(options: {
    skip?: number;
    take?: number;
    status?: SeriesStatus;
    genreId?: string;
    search?: string;
    year?: number;
    timePeriod?: "daily" | "weekly" | "monthly" | "all";
    orderBy?: {
      field: "views" | "averageRating" | "readersCount" | "createdAt" | "updatedAt" | "bookmarksCount";
      direction: "asc" | "desc";
    };
  }) {
    return seriesRepository.findAll(options);
  }

  /**
   * Create a new series
   */
  async createSeries(data: {
    title: string;
    slug?: string;
    description: string;
    coverImage: string;
    bannerImage?: string;
    author?: string;
    artist?: string;
    status?: SeriesStatus;
    genreIds?: string[];
    tagIds?: string[];
  }) {
    // Validate input using Zod
    const validatedData = createMangaSchema.parse(data);

    // Auto-generate slug if not provided
    const slug = validatedData.slug || validatedData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

    // Validate slug uniqueness
    const existing = await seriesRepository.findBySlug(slug);
    if (existing) {
      throw new Error("Slug already exists");
    }

    return seriesRepository.create({
      ...validatedData,
      slug,
      status: validatedData.status as SeriesStatus,
    });
  }

  /**
   * Update series
   */
  async updateSeries(
    id: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      coverImage?: string;
      bannerImage?: string;
      author?: string;
      artist?: string;
      status?: SeriesStatus;
      verified?: boolean;
      isFeatured?: boolean;
      isNew?: boolean;
      genreIds?: string[];
      tagIds?: string[];
    }
  ) {
    // Validate input using Zod
    const validatedData = updateMangaSchema.parse(data);

    // Check if series exists
    const existing = await seriesRepository.findById(id);
    if (!existing) {
      throw new Error("Series not found");
    }

    // Validate slug uniqueness if changing
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugExists = await seriesRepository.findBySlug(validatedData.slug);
      if (slugExists) {
        throw new Error("Slug already exists");
      }
    }

    return seriesRepository.update(id, {
      ...validatedData,
      status: validatedData.status as SeriesStatus,
    });
  }

  /**
   * Delete series
   */
  async deleteSeries(id: string) {
    const existing = await seriesRepository.findById(id);
    if (!existing) {
      throw new Error("Series not found");
    }

    return seriesRepository.delete(id);
  }

  /**
   * Increment series views
   */
  async incrementSeriesViews(id: string) {
    return seriesRepository.incrementViews(id);
  }

  /**
   * Update series stats (after rating/chapter changes)
   */
  async updateSeriesStats(id: string) {
    return seriesRepository.updateStats(id);
  }

  /**
   * Get top series by views
   */
  async getTopSeriesByViews(limit: number = 10) {
    return seriesRepository.getTopByViews(limit);
  }

  /**
   * Get top series by rating
   */
  async getTopSeriesByRating(limit: number = 10) {
    return seriesRepository.getTopByRating(limit);
  }

  /**
   * Get featured series
   */
  async getFeaturedSeries(limit: number = 5) {
    return seriesRepository.getFeatured(limit);
  }

  /**
   * Get new series
   */
  async getNewSeries(limit: number = 10) {
    return seriesRepository.getNew(limit);
  }
}

export const seriesService = new SeriesService();
