/**
 * Manga API
 * Manga/Series endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Manga {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage?: string;
  author?: string;
  artist?: string;
  status?: string;
  views: number;
  averageRating: number;
  totalRatings: number;
  totalChapters: number;
  verified?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  genres?: any[];
  tags?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface MangaSuggestion {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
}

export interface MangaListResponse {
  items: Manga[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateMangaRequest {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage?: string;
  author?: string;
  artist?: string;
  status?: string;
  genreIds?: string[];
  tagIds?: string[];
}

export const mangaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMangaList: builder.query<MangaListResponse, { page?: number; limit?: number; status?: string; genreId?: string; search?: string; year?: number; timePeriod?: "daily" | "weekly" | "monthly" | "all"; orderByField?: string; orderByDirection?: string }>({
      query: (params) => ({
        url: "/manga",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.MANGA_LIST],
    }),
    getMangaById: builder.query<Manga, string>({
      query: (id) => ({
        url: `/manga/${id}`,
        method: "GET",
      }),
      providesTags: (result) => result ? [{ type: tagTypes.MANGA, id: result.id }] : [],
    }),
    createManga: builder.mutation<Manga, CreateMangaRequest>({
      query: (data) => ({
        url: "/manga",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.MANGA_LIST],
    }),
    updateManga: builder.mutation<Manga, { id: string; data: Partial<CreateMangaRequest> }>({
      query: ({ id, data }) => ({
        url: `/manga/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        tagTypes.MANGA_LIST,
        { type: tagTypes.MANGA, id },
      ],
    }),
    deleteManga: builder.mutation<void, string>({
      query: (id) => ({
        url: `/manga/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        tagTypes.MANGA_LIST,
        { type: tagTypes.MANGA, id },
      ],
    }),
    getMangaChapters: builder.query<any, { id: string; page?: number; limit?: number; orderBy?: string }>({
      query: ({ id, ...params }) => ({
        url: `/manga/${id}/chapters`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: tagTypes.CHAPTER_LIST, id }],
    }),
    getMangaRatings: builder.query<any, { id: string; page?: number; limit?: number }>({
      query: ({ id, ...params }) => ({
        url: `/manga/${id}/ratings`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: tagTypes.RATING, id }],
    }),
    getMangaSuggestions: builder.query<MangaSuggestion[], { search: string; limit?: number }>({
      query: ({ search, limit = 5 }) => ({
        url: "/manga",
        method: "GET",
        params: { search, limit },
      }),
      providesTags: [tagTypes.MANGA_LIST],
    }),
  }),
});

export const {
  useGetMangaListQuery,
  useGetMangaByIdQuery,
  useCreateMangaMutation,
  useUpdateMangaMutation,
  useDeleteMangaMutation,
  useGetMangaChaptersQuery,
  useGetMangaRatingsQuery,
  useGetMangaSuggestionsQuery,
} = mangaApi;
