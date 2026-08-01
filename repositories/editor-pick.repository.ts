/**
 * Editor Pick Repository
 * Handles editor-featured series
 */

import prisma from "@/lib/prisma";
import { EditorPick } from "@/app/generated/prisma/client";

export class EditorPickRepository {
  /**
   * Find all editor picks with pagination
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ picks: EditorPick[]; total: number }> {
    const { skip = 0, take = 20 } = options || {};

    const [picks, total] = await Promise.all([
      prisma.editorPick.findMany({
        skip,
        take,
        include: {
          series: true,
        },
        orderBy: {
          featuredAt: "desc",
        },
      }),
      prisma.editorPick.count(),
    ]);

    return { picks, total };
  }

  /**
   * Find an editor pick by ID
   */
  async findById(id: string): Promise<EditorPick | null> {
    return prisma.editorPick.findUnique({
      where: { id },
      include: {
        series: true,
      },
    });
  }

  /**
   * Create an editor pick
   */
  async create(seriesId: string): Promise<EditorPick> {
    return prisma.editorPick.create({
      data: {
        seriesId,
      },
      include: {
        series: true,
      },
    });
  }

  /**
   * Delete an editor pick
   */
  async delete(id: string): Promise<EditorPick> {
    return prisma.editorPick.delete({
      where: { id },
    });
  }

  /**
   * Remove editor pick by series
   */
  async deleteBySeriesId(seriesId: string): Promise<EditorPick> {
    return prisma.editorPick.delete({
      where: { seriesId },
    });
  }

  /**
   * Find picks by date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<EditorPick[]> {
    return prisma.editorPick.findMany({
      where: {
        featuredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        series: true,
      },
      orderBy: {
        featuredAt: "desc",
      },
    });
  }
}

export const editorPickRepository = new EditorPickRepository();
