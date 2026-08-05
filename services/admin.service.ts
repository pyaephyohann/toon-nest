/**
 * Admin Service
 * Handles admin business logic and dashboard aggregation
 */

import {
  userRepository,
  seriesRepository,
  chapterRepository,
  commentRepository,
  ratingRepository,
  subscriptionRepository,
  invoiceRepository,
} from "@/repositories";

export interface DashboardStatistics {
  totalUsers: number;
  totalManga: number;
  totalChapters: number;
  premiumUsers: number;
  activeSubscriptions: number;
  totalComments: number;
  totalReviews: number;
  totalRevenue: number;
}

export interface RecentActivity {
  recentManga: Array<{
    id: string;
    title: string;
    slug: string;
    coverImage: string;
    status: string;
    createdAt: string;
  }>;
  recentChapters: Array<{
    id: string;
    chapterNumber: number;
    title: string | null;
    createdAt: string;
    series: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
  newUsers: Array<{
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    role: string;
    createdAt: string;
  }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    invoiceUrl: string | null;
    providerInvoiceId: string | null;
    createdAt: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
    subscription: {
      id: string;
      plan: string;
    };
  }>;
  recentComments: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      avatar: string | null;
    };
    chapter: {
      id: string;
      chapterNumber: number;
      series: {
        id: string;
        title: string;
        slug: string;
      };
    };
  }>;
}

export class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStatistics(): Promise<DashboardStatistics> {
    const [
      totalUsers,
      totalManga,
      totalChapters,
      premiumUsers,
      activeSubscriptions,
      totalComments,
      totalReviews,
      totalRevenue,
    ] = await Promise.all([
      userRepository.getTotalUsers(),
      seriesRepository.getTotalSeries(),
      chapterRepository.getTotalChapters(),
      userRepository.getPremiumUsersCount(),
      subscriptionRepository.getActiveSubscriptionsCount(),
      commentRepository.getTotalComments(),
      ratingRepository.getTotalRatings(),
      invoiceRepository.getTotalRevenue(),
    ]);

    return {
      totalUsers,
      totalManga,
      totalChapters,
      premiumUsers,
      activeSubscriptions,
      totalComments,
      totalReviews,
      totalRevenue,
    };
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<RecentActivity> {
    const [recentManga, recentChapters, newUsers, recentPayments, recentComments] =
      await Promise.all([
        seriesRepository.getRecentSeries(limit),
        chapterRepository.getRecentChapters(limit),
        userRepository.getRecentUsers(limit),
        invoiceRepository.getRecentPayments(limit),
        commentRepository.getRecentComments(limit),
      ]);

    // Transform data to match interface types
    const transformedManga = recentManga.map((m) => ({
      ...m,
      status: m.status as string,
      createdAt: m.createdAt.toISOString(),
    }));

    const transformedChapters = recentChapters.map((c) => ({
      ...c,
      chapterNumber: Number(c.chapterNumber),
      createdAt: c.createdAt.toISOString(),
    }));

    const transformedUsers = newUsers.map((u) => ({
      ...u,
      role: u.role as string,
      createdAt: u.createdAt.toISOString(),
    }));

    const transformedPayments = recentPayments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      status: p.status as string,
      createdAt: p.createdAt.toISOString(),
    }));

    const transformedComments = recentComments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      chapter: {
        ...c.chapter,
        chapterNumber: Number(c.chapter.chapterNumber),
      },
    }));

    return {
      recentManga: transformedManga,
      recentChapters: transformedChapters,
      newUsers: transformedUsers,
      recentPayments: transformedPayments,
      recentComments: transformedComments,
    };
  }

  /**
   * Get admin overview (combined dashboard data)
   */
  async getAdminOverview() {
    const [statistics, recentActivity] = await Promise.all([
      this.getDashboardStatistics(),
      this.getRecentActivity(10),
    ]);

    return {
      statistics,
      recentActivity,
    };
  }
}

export const adminService = new AdminService();
