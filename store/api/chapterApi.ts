/**
 * Chapter API
 * Chapter endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Chapter {
  id: string;
  seriesId: string;
  chapterNumber: number;
  title?: string;
  slug: string;
  unlockType?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  series?: any;
  pages?: any[];
  _count?: {
    pages: number;
  };
  access?: {
    canAccess: boolean;
    reason?: string;
  };
}

export interface ChapterListResponse {
  items: Chapter[];
  total: number;
  page: number;
  limit: number;
}

export interface GetChaptersParams {
  page?: number;
  limit?: number;
  search?: string;
  seriesId?: string;
  unlockType?: "FREE" | "AD" | "PREMIUM";
  sortBy?: "chapterNumber" | "views" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateChapterRequest {
  seriesId: string;
  chapterNumber: number;
  title?: string;
  slug?: string;
  unlockType?: string;
}

export const chapterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query<ChapterListResponse, GetChaptersParams>({
      query: (params) => ({
        url: "/chapters",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.CHAPTER_LIST],
    }),
    getChapterById: builder.query<Chapter, string>({
      query: (id) => ({
        url: `/chapters/${id}`,
        method: "GET",
      }),
      providesTags: (result) => result ? [{ type: tagTypes.CHAPTER, id: result.id }] : [],
    }),
    getChaptersBySeriesId: builder.query<ChapterListResponse, { id: string; page?: number; limit?: number; orderBy?: "asc" | "desc" }>({
      query: ({ id, ...params }) => ({
        url: `/manga/${id}/chapters`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: tagTypes.CHAPTER_LIST, id }],
    }),
    createChapter: builder.mutation<Chapter, CreateChapterRequest>({
      query: (data) => ({
        url: "/chapters",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { seriesId }) => [
        tagTypes.CHAPTER_LIST,
        { type: tagTypes.MANGA, id: seriesId },
      ],
    }),
    updateChapter: builder.mutation<Chapter, { id: string; data: Partial<CreateChapterRequest> }>({
      query: ({ id, data }) => ({
        url: `/chapters/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        tagTypes.CHAPTER_LIST,
        { type: tagTypes.CHAPTER, id },
      ],
    }),
    deleteChapter: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chapters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        tagTypes.CHAPTER_LIST,
        { type: tagTypes.CHAPTER, id },
      ],
    }),
    duplicateChapter: builder.mutation<Chapter, { id: string; newChapterNumber: number }>({
      query: ({ id, newChapterNumber }) => ({
        url: `/chapters/${id}?action=duplicate`,
        method: "POST",
        body: { newChapterNumber },
      }),
      invalidatesTags: (result, error) => [tagTypes.CHAPTER_LIST],
    }),
    uploadChapterPages: builder.mutation<Chapter, { id: string; pages: { imageUrl: string }[] }>({
      query: ({ id, pages }) => ({
        url: `/chapters/${id}?action=upload-pages`,
        method: "POST",
        body: { pages },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.CHAPTER, id },
      ],
    }),
    reorderChapterPages: builder.mutation<void, { pageOrders: { id: string; pageNumber: number }[] }>({
      query: ({ pageOrders }) => ({
        url: `/chapters/${pageOrders[0].id}?action=reorder-pages`,
        method: "POST",
        body: { pageOrders },
      }),
      invalidatesTags: (result, error, { pageOrders }) => [
        { type: tagTypes.CHAPTER, id: pageOrders[0].id },
      ],
    }),
    getChapterComments: builder.query<any, { id: string; page?: number; limit?: number }>({
      query: ({ id, ...params }) => ({
        url: `/chapters/${id}/comments`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: tagTypes.COMMENT, id }],
    }),
    unlockChapter: builder.mutation<any, { id: string; method: string }>({
      query: ({ id, method }) => ({
        url: `/chapters/${id}/unlock`,
        method: "POST",
        body: { method },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.CHAPTER, id },
        tagTypes.UNLOCK,
      ],
    }),
  }),
});

export const {
  useGetChaptersQuery,
  useGetChapterByIdQuery,
  useGetChaptersBySeriesIdQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
  useDuplicateChapterMutation,
  useUploadChapterPagesMutation,
  useReorderChapterPagesMutation,
  useGetChapterCommentsQuery,
  useUnlockChapterMutation,
} = chapterApi;
