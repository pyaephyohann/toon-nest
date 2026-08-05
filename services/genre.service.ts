/**
 * Genre Service
 * Manages genre business logic
 */

import { genreRepository } from "@/repositories";
import { createGenreSchema, updateGenreSchema } from "@/lib/validations/genre.validation";

export class GenreService {
  /**
   * Get all genres with pagination, sorting, and filtering
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    search?: string;
    sortBy?: "name" | "createdAt" | "seriesCount";
    sortOrder?: "asc" | "desc";
    hasIcon?: boolean;
    hasColor?: boolean;
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
   * Check if genre name already exists
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const existing = await genreRepository.findAll({ take: 1, search: name });
    if (excludeId) {
      return existing.genres.some((g) => g.id !== excludeId && g.name.toLowerCase() === name.toLowerCase());
    }
    return existing.genres.some((g) => g.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Check if genre slug already exists
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await genreRepository.findBySlug(slug);
    if (!existing) return false;
    if (excludeId) return existing.id !== excludeId;
    return true;
  }

  /**
   * Create a genre
   */
  async create(name: string, slug?: string, icon?: string, color?: string) {
    // Validate input
    const validatedData = createGenreSchema.parse({ name, slug, icon, color });

    // Check for duplicate name
    if (await this.nameExists(validatedData.name)) {
      throw new Error("Genre with this name already exists");
    }

    // Check for duplicate slug
    const genreSlug = validatedData.slug || validatedData.name.toLowerCase().replace(/\s+/g, "-");
    if (await this.slugExists(genreSlug)) {
      throw new Error("Genre with this slug already exists");
    }

    return genreRepository.create({
      name: validatedData.name,
      slug: genreSlug,
      icon: validatedData.icon,
      color: validatedData.color,
    });
  }

  /**
   * Update a genre
   */
  async update(id: string, data: { name?: string; slug?: string; icon?: string; color?: string }) {
    // Validate input
    const validatedData = updateGenreSchema.parse(data);

    // Check for duplicate name if name is being updated
    if (validatedData.name && await this.nameExists(validatedData.name, id)) {
      throw new Error("Genre with this name already exists");
    }

    // Check for duplicate slug if slug is being updated
    if (validatedData.slug && await this.slugExists(validatedData.slug, id)) {
      throw new Error("Genre with this slug already exists");
    }

    return genreRepository.update(id, validatedData);
  }

  /**
   * Delete a genre
   */
  async delete(id: string) {
    return genreRepository.delete(id);
  }
}

export const genreService = new GenreService();
