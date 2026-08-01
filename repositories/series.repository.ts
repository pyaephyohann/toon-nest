/**
 * Series Repository
 * Handles all series-related database operations
 */

import prisma from "@/lib/prisma";
import { Series, SeriesStatus } from "@/app/generated/prisma/client";

export class SeriesRepository {
  /**
   * Find series by ID with relations
   */
  async findById(id: string): Promise<Series | null> {
    return prisma.series.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Find series by slug
   */
  async findBySlug(slug: string): Promise<Series | null> {
    return prisma.series.findUnique({
      where: { slug },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Find all series with pagination and filters
   */
  async findAll(options: {
    skip?: number;
    take?: number;
    status?: SeriesStatus;
    genreId?: string;
    search?: string;
    year?: number;
    orderBy?: {
      field: "views" | "averageRating" | "readersCount" | "createdAt" | "updatedAt";
      direction: "asc" | "desc";
    };
  }): Promise<{ series: Series[]; total: number }> {
    const { skip = 0, take = 20, status, genreId, search, year, orderBy } = options;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (genreId) {
      where.genres = {
        some: {
          genreId,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
      ];
    }

    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      where.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    const [series, total] = await Promise.all([
      prisma.series.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.series.count({ where }),
    ]);

    return { series, total };
  }

  /**
   * Create a new series
   */
  async create(data: {
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    bannerImage?: string;
    author?: string;
    artist?: string;
    status?: SeriesStatus;
    genreIds?: string[];
    tagIds?: string[];
  }): Promise<Series> {
    const { genreIds = [], tagIds = [], ...seriesData } = data;

    return prisma.series.create({
      data: {
        ...seriesData,
        genres: {
          create: genreIds.map((genreId) => ({
            genreId,
          })),
        },
        tags: {
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Update series
   */
  async update(
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
  ): Promise<Series> {
    const { genreIds, tagIds, ...seriesData } = data;

    return prisma.series.update({
      where: { id },
      data: {
        ...seriesData,
        ...(genreIds && {
          genres: {
            deleteMany: {},
            create: genreIds.map((genreId) => ({ genreId })),
          },
        }),
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          },
        }),
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Delete series
   */
  async delete(id: string): Promise<Series> {
    return prisma.series.delete({
      where: { id },
    });
  }

  /**
   * Increment view count
   */
  async incrementViews(id: string): Promise<Series> {
    return prisma.series.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Update series stats (called after rating/chapter changes)
   */
  async updateStats(id: string): Promise<Series> {
    const [totalChapters, ratings] = await Promise.all([
      prisma.chapter.count({
        where: { seriesId: id },
      }),
      prisma.rating.aggregate({
        where: { seriesId: id },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return prisma.series.update({
      where: { id },
      data: {
        totalChapters,
        averageRating: ratings._avg.rating || 0,
        totalRatings: ratings._count.rating,
      },
    });
  }

  /**
   * Get top series by views
   */
  async getTopByViews(limit: number = 10): Promise<Series[]> {
    return prisma.series.findMany({
      take: limit,
      orderBy: {
        views: "desc",
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  /**
   * Get top series by rating
   */
  async getTopByRating(limit: number = 10): Promise<Series[]> {
    return prisma.series.findMany({
      take: limit,
      orderBy: {
        averageRating: "desc",
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  /**
   * Get featured series
   */
  async getFeatured(limit: number = 5): Promise<Series[]> {
    return prisma.series.findMany({
      take: limit,
      where: {
        isFeatured: true,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  /**
   * Get new series
   */
  async getNew(limit: number = 10): Promise<Series[]> {
    return prisma.series.findMany({
      take: limit,
      where: {
        isNew: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
  }
}

export const seriesRepository = new SeriesRepository();
