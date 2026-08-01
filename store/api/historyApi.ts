/**
 * History API
 * Reading history endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface History {
  id: string;
  userId: string;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
  chapter?: any;
}

export interface HistoryListResponse {
  items: History[];
  total: number;
  page: number;
  limit: number;
}

export const historyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query<HistoryListResponse, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/history",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.HISTORY_LIST],
    }),
    saveHistory: builder.mutation<History, { chapterId: string }>({
      query: (data) => ({
        url: "/history",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.HISTORY_LIST],
    }),
    clearHistory: builder.mutation<void, void>({
      query: () => ({
        url: "/history",
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.HISTORY_LIST],
    }),
    deleteHistoryEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/history/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.HISTORY_LIST],
    }),
  }),
});

export const {
  useGetHistoryQuery,
  useSaveHistoryMutation,
  useClearHistoryMutation,
  useDeleteHistoryEntryMutation,
} = historyApi;
