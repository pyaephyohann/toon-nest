/**
 * Moderation API
 * Moderation and report endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Report {
  id: string;
  reporterId: string;
  targetType: "COMMENT" | "RATING" | "USER";
  targetId: string;
  reason: string;
  description: string | null;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  moderatorId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: {
    id: string;
    username: string;
    avatar: string | null;
  };
  moderator: {
    id: string;
    username: string;
  } | null;
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  actionType: "APPROVE" | "DELETE" | "HIDE" | "WARN" | "SUSPEND" | "BAN";
  targetType: "COMMENT" | "RATING" | "USER";
  targetId: string;
  reason: string | null;
  metadata: string | null;
  createdAt: string;
  moderator: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

export interface ReportListResponse {
  items: Report[];
  total: number;
  page: number;
  limit: number;
}

export interface ModerationHistoryResponse {
  items: ModerationAction[];
  total: number;
  page: number;
  limit: number;
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "RESOLVED" | "DISMISSED";
  targetType?: "COMMENT" | "RATING" | "USER";
  startDate?: string;
  endDate?: string;
}

export interface GetModerationHistoryParams {
  page?: number;
  limit?: number;
  actionType?: "APPROVE" | "DELETE" | "HIDE" | "WARN" | "SUSPEND" | "BAN";
  targetType?: "COMMENT" | "RATING" | "USER";
  targetId?: string;
  startDate?: string;
  endDate?: string;
}

export const moderationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<ReportListResponse, GetReportsParams>({
      query: (params) => ({
        url: "/admin/reports",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.MODERATION],
    }),
    getReportById: builder.query<Report, string>({
      query: (id) => ({
        url: `/admin/reports/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.MODERATION, id }],
    }),
    resolveReport: builder.mutation<Report, string>({
      query: (id) => ({
        url: `/admin/reports/${id}?action=resolve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        tagTypes.MODERATION,
        { type: tagTypes.MODERATION, id },
      ],
    }),
    dismissReport: builder.mutation<Report, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/reports/${id}?action=dismiss`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        tagTypes.MODERATION,
        { type: tagTypes.MODERATION, id },
      ],
    }),
    moderateComment: builder.mutation<any, { id: string; action: string; reason?: string }>({
      query: ({ id, action, reason }) => ({
        url: `/admin/moderation/comment/${id}`,
        method: "POST",
        body: { action, reason },
      }),
      invalidatesTags: [tagTypes.MODERATION, tagTypes.COMMENT],
    }),
    moderateRating: builder.mutation<any, { id: string; action: string; reason?: string }>({
      query: ({ id, action, reason }) => ({
        url: `/admin/moderation/rating/${id}`,
        method: "POST",
        body: { action, reason },
      }),
      invalidatesTags: [tagTypes.MODERATION, tagTypes.RATING],
    }),
    moderateUser: builder.mutation<any, { id: string; action: string; reason?: string }>({
      query: ({ id, action, reason }) => ({
        url: `/admin/moderation/user/${id}`,
        method: "POST",
        body: { action, reason },
      }),
      invalidatesTags: [tagTypes.MODERATION, tagTypes.USER],
    }),
    getModerationHistory: builder.query<ModerationHistoryResponse, GetModerationHistoryParams>({
      query: (params) => ({
        url: "/admin/moderation/history",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.MODERATION],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useResolveReportMutation,
  useDismissReportMutation,
  useModerateCommentMutation,
  useModerateRatingMutation,
  useModerateUserMutation,
  useGetModerationHistoryQuery,
} = moderationApi;
