/**
 * Analytics Repository
 * Handles analytics and time-series data queries
 */

import prisma from "@/lib/prisma";
import { TimePeriod } from "@/app/generated/prisma/client";

export class AnalyticsRepository {
  /**
   * Get reading statistics time-series data
   */
  async getReadingStats(options?: {
    startDate?: Date;
    endDate?: Date;
    period?: TimePeriod;
    seriesId?: string;
  }) {
    const { startDate, endDate, period = "DAILY", seriesId } = options || {};

    const where: any = {
      period,
    };

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (seriesId) {
      where.seriesId = seriesId;
    }

    return prisma.seriesStats.findMany({
      where,
      orderBy: {
        date: "asc",
      },
      include: {
        series: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * Get revenue statistics time-series data
   */
  async getRevenueStats(options?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    const { startDate, endDate, status } = options || {};

    const where: any = {
      status: "PAID",
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (status) {
      where.status = status;
    }

    return prisma.invoice.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        subscription: {
          select: {
            id: true,
            plan: true,
          },
        },
      },
    });
  }

  /**
   * Get user growth statistics time-series data
   */
  async getUserGrowthStats(options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = options || {};

    const where: any = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    return prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get genre distribution statistics
   */
  async getGenreDistribution(options?: {
    startDate?: Date;
    endDate?: Date;
    period?: TimePeriod;
  }) {
    const { startDate, endDate, period = "DAILY" } = options || {};

    const where: any = {
      period,
    };

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    return prisma.genreStats.findMany({
      where,
      orderBy: {
        date: "asc",
      },
      include: {
        genre: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * Get top performing series
   */
  async getTopSeries(options?: {
    limit?: number;
    sortBy?: "views" | "readers" | "ratings" | "bookmarks";
    startDate?: Date;
    endDate?: Date;
  }) {
    const { limit = 10, sortBy = "views", startDate, endDate } = options || {};

    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    return prisma.seriesStats.findMany({
      where,
      orderBy: {
        [sortBy]: "desc",
      },
      take: limit,
      include: {
        series: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
          },
        },
      },
    });
  }

  /**
   * Get user engagement metrics
   */
  async getUserEngagementMetrics(options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = options || {};

    const where: any = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [bookmarks, comments, ratings] = await Promise.all([
      prisma.bookmark.count({ where: { createdAt: where.createdAt } }),
      prisma.comment.count({ where: { createdAt: where.createdAt } }),
      prisma.rating.count({ where: { createdAt: where.createdAt } }),
    ]);

    return {
      bookmarks,
      comments,
      ratings,
    };
  }

  /**
   * Get daily revenue aggregated by date
   */
  async getDailyRevenue(options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = options || {};

    const where: any = {
      status: "PAID",
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        amount: true,
        currency: true,
        createdAt: true,
      },
    });

    // Aggregate by date
    const revenueByDate = new Map<string, number>();

    invoices.forEach((invoice) => {
      const date = invoice.createdAt.toISOString().split("T")[0];
      const amount = Number(invoice.amount);
      revenueByDate.set(date, (revenueByDate.get(date) || 0) + amount);
    });

    return Array.from(revenueByDate.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));
  }

  /**
   * Get daily user registrations
   */
  async getDailyRegistrations(options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = options || {};

    const where: any = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
      },
    });

    // Aggregate by date
    const usersByDate = new Map<string, number>();

    users.forEach((user) => {
      const date = user.createdAt.toISOString().split("T")[0];
      usersByDate.set(date, (usersByDate.get(date) || 0) + 1);
    });

    return Array.from(usersByDate.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }
}

export const analyticsRepository = new AnalyticsRepository();
