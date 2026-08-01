/**
 * Bookmark API
 * Bookmark endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Bookmark {
  id: string;
  userId: string;
  seriesId: string;
  createdAt: string;
  series?: any;
}

export interface BookmarkListResponse {
  items: Bookmark[];
  total: number;
  page: number;
  limit: number;
}

export const bookmarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query<BookmarkListResponse, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/bookmarks",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.BOOKMARK_LIST],
    }),
    addBookmark: builder.mutation<Bookmark, { seriesId: string }>({
      query: (data) => ({
        url: "/bookmarks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.BOOKMARK_LIST],
    }),
    toggleBookmark: builder.mutation<{ bookmarked: boolean; series: any }, { seriesId: string }>({
      query: (data) => ({
        url: "/bookmarks/toggle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.BOOKMARK_LIST],
    }),
    deleteBookmark: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bookmarks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.BOOKMARK_LIST],
    }),
  }),
});

export const {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useToggleBookmarkMutation,
  useDeleteBookmarkMutation,
} = bookmarkApi;
