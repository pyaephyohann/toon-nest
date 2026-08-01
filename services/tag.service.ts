/**
 * Tag Service
 * Manages tags with slug generation and validation
 */

import { tagRepository } from "@/repositories";

export class TagService {
  /**
   * Get all tags with pagination
   */
  async getAllTags(options?: {
    skip?: number;
    take?: number;
  }) {
    return tagRepository.findAll(options);
  }

  /**
   * Get specific tag by ID
   */
  async getTagById(id: string) {
    return tagRepository.findById(id);
  }

  /**
   * Get tag by slug
   */
  async getTagBySlug(slug: string) {
    return tagRepository.findBySlug(slug);
  }

  /**
   * Create tag with slug validation
   */
  async createTag(name: string, slug?: string) {
    // Auto-generate slug from name if not provided
    const tagSlug = slug || this.generateSlug(name);

    // Validate slug uniqueness
    const existing = await tagRepository.findBySlug(tagSlug);
    if (existing) {
      throw new Error("Slug already exists");
    }

    return tagRepository.create(name, tagSlug);
  }

  /**
   * Update tag
   */
  async updateTag(
    id: string,
    data: {
      name?: string;
      slug?: string;
    }
  ) {
    const existing = await tagRepository.findById(id);
    if (!existing) {
      throw new Error("Tag not found");
    }

    // Validate slug uniqueness if changing
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await tagRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new Error("Slug already exists");
      }
    }

    return tagRepository.update(id, data);
  }

  /**
   * Delete tag
   */
  async deleteTag(id: string) {
    const existing = await tagRepository.findById(id);
    if (!existing) {
      throw new Error("Tag not found");
    }

    // Check if tag is used by series (repository includes series relation)
    const tagWithSeries = await tagRepository.findById(id);
    const seriesCount = tagWithSeries && "series" in tagWithSeries ? (tagWithSeries as any).series?.length || 0 : 0;
    
    if (seriesCount > 0) {
      throw new Error("Cannot delete tag that is used by series");
    }

    return tagRepository.delete(id);
  }

  /**
   * Search tags by name
   */
  async searchTags(search: string) {
    return tagRepository.searchByName(search);
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

export const tagService = new TagService();
