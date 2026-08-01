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
  access?: {
    canAccess: boolean;
    reason?: string;
  };
}

export interface CreateChapterRequest {
  seriesId: string;
  chapterNumber: number;
  title?: string;
  slug: string;
  unlockType?: string;
}

export const chapterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChapterById: builder.query<Chapter, string>({
      query: (id) => ({
        url: `/chapters/${id}`,
        method: "GET",
      }),
      providesTags: (result) => result ? [{ type: tagTypes.CHAPTER, id: result.id }] : [],
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
  useGetChapterByIdQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
  useGetChapterCommentsQuery,
  useUnlockChapterMutation,
} = chapterApi;
