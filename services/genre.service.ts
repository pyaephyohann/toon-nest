/**
 * Genre Service
 * Manages genre business logic
 */

import { genreRepository } from "@/repositories";

export class GenreService {
  /**
   * Get all genres with pagination
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
  }) {
    return genreRepository.findAll(options);
  }

  /**
   * Get genre by ID
   */
  async findById(id: string) {
    return genreRepository.findById(id);
  }

  /**
   * Get genre by slug
   */
  async findBySlug(slug: string) {
    return genreRepository.findBySlug(slug);
  }

  /**
   * Create a genre
   */
  async create(name: string, slug?: string) {
    const genreSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    return genreRepository.create({ name, slug: genreSlug });
  }

  /**
   * Update a genre
   */
  async update(id: string, data: { name?: string; slug?: string }) {
    return genreRepository.update(id, data);
  }

  /**
   * Delete a genre
   */
  async delete(id: string) {
    return genreRepository.delete(id);
  }
}

export const genreService = new GenreService();
