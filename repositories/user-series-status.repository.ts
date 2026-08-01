/**
 * User Series Status Repository
 * Handles user reading status for series
 */

import prisma from "@/lib/prisma";
import { UserSeriesStatus, ReadingStatus } from "@/app/generated/prisma/client";

export class UserSeriesStatusRepository {
  /**
   * Find all series statuses for a user
   */
  async findByUserId(userId: string): Promise<UserSeriesStatus[]> {
    return prisma.userSeriesStatus.findMany({
      where: { userId },
      include: {
        series: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Find user's status for a series
   */
  async findByUserAndSeries(
    userId: string,
    seriesId: string
  ): Promise<UserSeriesStatus | null> {
    return prisma.userSeriesStatus.findUnique({
      where: {
        userId_seriesId: {
          userId,
          seriesId,
        },
      },
      include: {
        series: true,
      },
    });
  }

  /**
   * Create a reading status
   */
  async create(
    userId: string,
    seriesId: string,
    status: ReadingStatus
  ): Promise<UserSeriesStatus> {
    return prisma.userSeriesStatus.create({
      data: {
        userId,
        seriesId,
        status,
      },
      include: {
        series: true,
      },
    });
  }

  /**
   * Update a reading status
   */
  async update(
    userId: string,
    seriesId: string,
    status: ReadingStatus
  ): Promise<UserSeriesStatus> {
    return prisma.userSeriesStatus.update({
      where: {
        userId_seriesId: {
          userId,
          seriesId,
        },
      },
      data: { status },
      include: {
        series: true,
      },
    });
  }

  /**
   * Delete a reading status
   */
  async delete(userId: string, seriesId: string): Promise<UserSeriesStatus> {
    return prisma.userSeriesStatus.delete({
      where: {
        userId_seriesId: {
          userId,
          seriesId,
        },
      },
    });
  }

  /**
   * Find series with specific status for a user
   */
  async findByUserIdAndStatus(
    userId: string,
    status: ReadingStatus
  ): Promise<UserSeriesStatus[]> {
    return prisma.userSeriesStatus.findMany({
      where: {
        userId,
        status,
      },
      include: {
        series: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
}

export const userSeriesStatusRepository = new UserSeriesStatusRepository();
