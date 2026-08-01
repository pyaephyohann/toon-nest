/**
 * Collection Repository
 * Handles admin-created collections
 */

import prisma from "@/lib/prisma";
import { Collection } from "@/app/generated/prisma/client";

export class CollectionRepository {
  /**
   * Find all collections with pagination
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ collections: Collection[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        skip,
        take,
        include: {
          series: {
            include: {
              series: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.collection.count(),
    ]);

    return { collections, total };
  }

  /**
   * Find a collection by ID
   */
  async findById(id: string): Promise<Collection | null> {
    return prisma.collection.findUnique({
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
   * Find a collection by slug
   */
  async findBySlug(slug: string): Promise<Collection | null> {
    return prisma.collection.findUnique({
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
   * Create a collection
   */
  async create(
    title: string,
    slug: string,
    image: string,
    description?: string
  ): Promise<Collection> {
    return prisma.collection.create({
      data: {
        title,
        slug,
        image,
        description,
      },
    });
  }

  /**
   * Update a collection
   */
  async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      image?: string;
      description?: string;
      seriesCount?: number;
    }
  ): Promise<Collection> {
    return prisma.collection.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a collection
   */
  async delete(id: string): Promise<Collection> {
    return prisma.collection.delete({
      where: { id },
    });
  }

  /**
   * Add series to collection
   */
  async addSeries(collectionId: string, seriesId: string): Promise<void> {
    await prisma.collectionSeries.create({
      data: {
        collectionId,
        seriesId,
      },
    });
  }

  /**
   * Remove series from collection
   */
  async removeSeries(collectionId: string, seriesId: string): Promise<void> {
    await prisma.collectionSeries.delete({
      where: {
        collectionId_seriesId: {
          collectionId,
          seriesId,
        },
      },
    });
  }
}

export const collectionRepository = new CollectionRepository();
