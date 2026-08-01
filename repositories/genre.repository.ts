/**
 * Genre Repository
 * Handles all genre-related database operations
 */

import prisma from "@/lib/prisma";
import { Genre } from "@/app/generated/prisma/client";

export class GenreRepository {
  /**
   * Find genre by ID
   */
  async findById(id: string): Promise<Genre | null> {
    return prisma.genre.findUnique({
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
   * Find genre by slug
   */
  async findBySlug(slug: string): Promise<Genre | null> {
    return prisma.genre.findUnique({
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
   * Find all genres
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<{ genres: Genre[]; total: number }> {
    const { skip = 0, take = 50, search } = options || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const [genres, total] = await Promise.all([
      prisma.genre.findMany({
        where,
        skip,
        take,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.genre.count({ where }),
    ]);

    return { genres, total };
  }

  /**
   * Create a new genre
   */
  async create(data: {
    name: string;
    slug: string;
    icon?: string;
    color?: string;
  }): Promise<Genre> {
    return prisma.genre.create({
      data,
    });
  }

  /**
   * Update genre
   */
  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      icon?: string;
      color?: string;
    }
  ): Promise<Genre> {
    return prisma.genre.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete genre
   */
  async delete(id: string): Promise<Genre> {
    return prisma.genre.delete({
      where: { id },
    });
  }

  /**
   * Get popular genres by series count
   */
  async getPopular(limit: number = 10): Promise<Genre[]> {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: {
            series: true,
          },
        },
      },
      orderBy: {
        series: {
          _count: "desc",
        },
      },
      take: limit,
    });

    return genres.sort((a, b) => 
      (b as any)._count.series - (a as any)._count.series
    );
  }
}

export const genreRepository = new GenreRepository();
