/**
 * Tag Repository
 * Handles all tag database operations
 */

import prisma from "@/lib/prisma";
import { Tag } from "@/app/generated/prisma/client";

export class TagRepository {
  /**
   * Find all tags with pagination
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ tags: Tag[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        skip,
        take,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.tag.count(),
    ]);

    return { tags, total };
  }

  /**
   * Find a tag by ID
   */
  async findById(id: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
      include: {
        series: {
          include: {
            series: true,
          },
        },
      },
    });
  }

  /**
   * Find a tag by slug
   */
  async findBySlug(slug: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { slug },
      include: {
        series: {
          include: {
            series: true,
          },
        },
      },
    });
  }

  /**
   * Create a new tag
   */
  async create(name: string, slug: string): Promise<Tag> {
    return prisma.tag.create({
      data: {
        name,
        slug,
      },
    });
  }

  /**
   * Update a tag
   */
  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
    }
  ): Promise<Tag> {
    return prisma.tag.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a tag
   */
  async delete(id: string): Promise<Tag> {
    return prisma.tag.delete({
      where: { id },
    });
  }

  /**
   * Search tags by name
   */
  async searchByName(search: string): Promise<Tag[]> {
    return prisma.tag.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: 10,
    });
  }
}

export const tagRepository = new TagRepository();
