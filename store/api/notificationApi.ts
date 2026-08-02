/**
 * Notification API
 * Notification endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  chapterId?: string | null;
  seriesId?: string | null;
  commentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationListResponse, { page?: number; limit?: number; unreadOnly?: boolean }>({
      query: ({ page = 1, limit = 20, unreadOnly = false }) => ({
        url: "/notifications",
        method: "GET",
        params: { page, limit, unreadOnly },
      }),
      providesTags: [tagTypes.NOTIFICATION],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: [tagTypes.NOTIFICATION],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.NOTIFICATION],
    }),
    markAllAsRead: builder.mutation<{ count: number }, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.NOTIFICATION],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.NOTIFICATION],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
