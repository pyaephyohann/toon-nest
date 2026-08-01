/**
 * Base Repository
 * Provides common CRUD operations for all repositories
 * Follows Repository Pattern for data access abstraction
 */

import prisma from "@/lib/prisma";

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  /**
   * Find a single record by ID
   */
  async findById(id: string): Promise<T | null> {
    throw new Error("findById must be implemented");
  }

  /**
   * Find all records with optional pagination
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
  }): Promise<T[]> {
    throw new Error("findAll must be implemented");
  }

  /**
   * Create a new record
   */
  async create(data: CreateInput): Promise<T> {
    throw new Error("create must be implemented");
  }

  /**
   * Update an existing record
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    throw new Error("update must be implemented");
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<T> {
    throw new Error("delete must be implemented");
  }

  /**
   * Count total records
   */
  async count(): Promise<number> {
    throw new Error("count must be implemented");
  }

  /**
   * Check if record exists
   */
  async exists(id: string): Promise<boolean> {
    const record = await this.findById(id);
    return record !== null;
  }
}
