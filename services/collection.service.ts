/**
 * Collection Service
 * Manages admin-curated collections with authorization
 */

import { collectionRepository, seriesRepository } from "@/repositories";

export class CollectionService {
  /**
   * Get all collections with pagination
   */
  async getAllCollections(options?: {
    skip?: number;
    take?: number;
  }) {
    return collectionRepository.findAll(options);
  }

  /**
   * Get specific collection by ID
   */
  async getCollectionById(id: string) {
    return collectionRepository.findById(id);
  }

  /**
   * Get collection by slug
   */
  async getCollectionBySlug(slug: string) {
    return collectionRepository.findBySlug(slug);
  }

  /**
   * Create collection (admin only - authorization handled by caller)
   */
  async createCollection(data: {
    title: string;
    slug: string;
    image: string;
    description?: string;
  }) {
    // Validate slug uniqueness
    const existing = await collectionRepository.findBySlug(data.slug);
    if (existing) {
      throw new Error("Slug already exists");
    }

    return collectionRepository.create(
      data.title,
      data.slug,
      data.image,
      data.description
    );
  }

  /**
   * Update collection (admin only - authorization handled by caller)
   */
  async updateCollection(
    id: string,
    data: {
      title?: string;
      slug?: string;
      image?: string;
      description?: string;
      seriesCount?: number;
    }
  ) {
    const existing = await collectionRepository.findById(id);
    if (!existing) {
      throw new Error("Collection not found");
    }

    // Validate slug uniqueness if changing
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await collectionRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new Error("Slug already exists");
      }
    }

    return collectionRepository.update(id, data);
  }

  /**
   * Delete collection (admin only - authorization handled by caller)
   */
  async deleteCollection(id: string) {
    const existing = await collectionRepository.findById(id);
    if (!existing) {
      throw new Error("Collection not found");
    }

    return collectionRepository.delete(id);
  }

  /**
   * Add series to collection (admin only - authorization handled by caller)
   */
  async addSeriesToCollection(collectionId: string, seriesId: string) {
    // Check if collection exists
    const collection = await collectionRepository.findById(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    // Check if series exists
    const series = await seriesRepository.findById(seriesId);
    if (!series) {
      throw new Error("Series not found");
    }

    await collectionRepository.addSeries(collectionId, seriesId);

    // Update series count (increment)
    await collectionRepository.update(collectionId, {
      seriesCount: collection.seriesCount + 1,
    });

    return { success: true };
  }

  /**
   * Remove series from collection (admin only - authorization handled by caller)
   */
  async removeSeriesFromCollection(collectionId: string, seriesId: string) {
    // Check if collection exists
    const collection = await collectionRepository.findById(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    await collectionRepository.removeSeries(collectionId, seriesId);

    // Update series count (decrement, minimum 0)
    await collectionRepository.update(collectionId, {
      seriesCount: Math.max(0, collection.seriesCount - 1),
    });

    return { success: true };
  }
}

export const collectionService = new CollectionService();
