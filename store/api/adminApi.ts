/**
 * Admin API
 * Admin dashboard endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

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

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatistics: builder.query<DashboardStatistics, void>({
      query: () => ({
        url: "/admin/dashboard/statistics",
        method: "GET",
      }),
      providesTags: [tagTypes.ADMIN_DASHBOARD],
    }),
    getRecentActivity: builder.query<RecentActivity, { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: "/admin/dashboard/recent-activity",
        method: "GET",
        params: { limit },
      }),
      providesTags: [tagTypes.ADMIN_DASHBOARD],
    }),
  }),
});

export const {
  useGetDashboardStatisticsQuery,
  useGetRecentActivityQuery,
} = adminApi;
