/**
 * Analytics Service
 * Handles analytics business logic and aggregation
 */

import { analyticsRepository } from "@/repositories/analytics.repository";
import { TimePeriod } from "@/app/generated/prisma/client";

export interface ReadingAnalytics {
  totalViews: number;
  totalReaders: number;
  totalBookmarks: number;
  totalRatings: number;
  averageRating: number;
  topSeries: Array<{
    id: string;
    title: string;
    slug: string;
    coverImage: string;
    views: number;
    readers: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    views: number;
    readers: number;
  }>;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  totalPayments: number;
  averageOrderValue: number;
  revenueByPlan: Record<string, number>;
  timeSeriesData: Array<{
    date: string;
    revenue: number;
    payments: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  userGrowthRate: number;
  timeSeriesData: Array<{
    date: string;
    registrations: number;
  }>;
  engagementMetrics: {
    bookmarks: number;
    comments: number;
    ratings: number;
  };
}

export interface PlatformAnalytics {
  totalSeries: number;
  totalChapters: number;
  totalComments: number;
  totalRatings: number;
  genreDistribution: Array<{
    name: string;
    readers: number;
    seriesCount: number;
  }>;
}

export class AnalyticsService {
  /**
   * Get reading analytics
   */
  async getReadingAnalytics(options?: {
    startDate?: Date;
    endDate?: Date;
    period?: TimePeriod;
  }) {
    const { startDate, endDate, period = "DAILY" } = options || {};

    const [readingStats, topSeries] = await Promise.all([
      analyticsRepository.getReadingStats({ startDate, endDate, period }),
      analyticsRepository.getTopSeries({ sortBy: "views", startDate, endDate }),
    ]);

    // Calculate totals
    const totalViews = readingStats.reduce((sum, stat) => sum + stat.views, 0);
    const totalReaders = readingStats.reduce((sum, stat) => sum + stat.readers, 0);
    const totalBookmarks = readingStats.reduce((sum, stat) => sum + stat.bookmarks, 0);
    const totalRatings = readingStats.reduce((sum, stat) => sum + stat.ratings, 0);
    const averageRating = totalRatings > 0 ? totalViews / totalRatings : 0;

    // Aggregate time-series data
    const timeSeriesMap = new Map<string, { views: number; readers: number }>();
    readingStats.forEach((stat) => {
      const date = stat.date.toISOString().split("T")[0];
      const existing = timeSeriesMap.get(date) || { views: 0, readers: 0 };
      timeSeriesMap.set(date, {
        views: existing.views + stat.views,
        readers: existing.readers + stat.readers,
      });
    });

    const timeSeriesData = Array.from(timeSeriesMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalViews,
      totalReaders,
      totalBookmarks,
      totalRatings,
      averageRating,
      topSeries: topSeries.map((s) => ({
        id: s.series.id,
        title: s.series.title,
        slug: s.series.slug,
        coverImage: s.series.coverImage,
        views: s.views,
        readers: s.readers,
      })),
      timeSeriesData,
    };
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = options || {};

    const [revenueStats, dailyRevenue] = await Promise.all([
      analyticsRepository.getRevenueStats({ startDate, endDate }),
      analyticsRepository.getDailyRevenue({ startDate, endDate }),
    ]);

    // Calculate totals
    const totalRevenue = revenueStats.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const totalPayments = revenueStats.length;
    const averageOrderValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    // Revenue by plan
    const revenueByPlan: Record<string, number> = {};
    revenueStats.forEach((invoice) => {
      const plan = invoice.subscription?.plan || "UNKNOWN";
      revenueByPlan[plan] = (revenueByPlan[plan] || 0) + Number(invoice.amount);
    });

    // Time-series data
    const timeSeriesData = dailyRevenue.map((d) => ({
      date: d.date,
      revenue: d.amount,
      payments: revenueStats.filter(
        (r) => r.createdAt.toISOString().split("T")[0] === d.date
      ).length,
    }));

    return {
      totalRevenue,
      totalPayments,
      averageOrderValue,
      revenueByPlan,
      timeSeriesData,
    };
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = options || {};

    const [userGrowth, dailyRegistrations, engagementMetrics] = await Promise.all([
      analyticsRepository.getUserGrowthStats({ startDate, endDate }),
      analyticsRepository.getDailyRegistrations({ startDate, endDate }),
      analyticsRepository.getUserEngagementMetrics({ startDate, endDate }),
    ]);

    const totalUsers = userGrowth.length;
    const newUsers = userGrowth.length;
    const activeUsers = userGrowth.length; // Simplified - could be based on activity

    // Calculate growth rate
    const userGrowthRate = totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0;

    return {
      totalUsers,
      newUsers,
      activeUsers,
      userGrowthRate,
      timeSeriesData: dailyRegistrations,
      engagementMetrics,
    };
  }

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics(options?: {
    startDate?: Date;
    endDate?: Date;
    period?: TimePeriod;
  }) {
    const { startDate, endDate, period = "DAILY" } = options || {};

    const { seriesRepository, chapterRepository, commentRepository, ratingRepository } =
      await import("@/repositories");

    const [totalSeries, totalChapters, totalComments, totalRatings, genreStats] =
      await Promise.all([
        seriesRepository.getTotalSeries(),
        chapterRepository.getTotalChapters(),
        commentRepository.getTotalComments(),
        ratingRepository.getTotalRatings(),
        analyticsRepository.getGenreDistribution({ startDate, endDate, period }),
      ]);

    // Aggregate genre distribution
    const genreMap = new Map<string, { readers: number; seriesCount: number }>();
    genreStats.forEach((stat) => {
      const name = stat.genre.name;
      const existing = genreMap.get(name) || { readers: 0, seriesCount: 0 };
      genreMap.set(name, {
        readers: existing.readers + stat.readers,
        seriesCount: existing.seriesCount + stat.seriesCount,
      });
    });

    const genreDistribution = Array.from(genreMap.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));

    return {
      totalSeries,
      totalChapters,
      totalComments,
      totalRatings,
      genreDistribution,
    };
  }

  /**
   * Export report data as CSV
   */
  async exportReport(type: "reading" | "revenue" | "users", options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    let data: any[] = [];
    let headers: string[] = [];

    switch (type) {
      case "reading":
        const readingAnalytics = await this.getReadingAnalytics(options);
        data = readingAnalytics.timeSeriesData;
        headers = ["Date", "Views", "Readers"];
        break;
      case "revenue":
        const revenueAnalytics = await this.getRevenueAnalytics(options);
        data = revenueAnalytics.timeSeriesData;
        headers = ["Date", "Revenue", "Payments"];
        break;
      case "users":
        const userAnalytics = await this.getUserAnalytics(options);
        data = userAnalytics.timeSeriesData;
        headers = ["Date", "Registrations"];
        break;
    }

    // Generate CSV
    const csvContent = [
      headers.join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    return csvContent;
  }
}

export const analyticsService = new AnalyticsService();
