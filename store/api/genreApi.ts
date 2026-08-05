/**
 * Genre API
 * Genre endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    series: number;
  };
}

export interface GenreListResponse {
  items: Genre[];
  total: number;
  page: number;
  limit: number;
}

export interface GetGenresParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "createdAt" | "seriesCount";
  sortOrder?: "asc" | "desc";
  hasIcon?: boolean;
  hasColor?: boolean;
}

export const genreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query<GenreListResponse, GetGenresParams>({
      query: (params) => ({
        url: "/genres",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.GENRE_LIST],
    }),
    getGenreById: builder.query<Genre, string>({
      query: (id) => ({
        url: `/genres/${id}`,
        method: "GET",
      }),
      providesTags: (result) => result ? [{ type: tagTypes.GENRE, id: result.id }] : [],
    }),
    createGenre: builder.mutation<Genre, { name: string; slug?: string }>({
      query: (data) => ({
        url: "/genres",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.GENRE_LIST],
    }),
    updateGenre: builder.mutation<Genre, { id: string; data: Partial<Genre> }>({
      query: ({ id, data }) => ({
        url: `/genres/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        tagTypes.GENRE_LIST,
        { type: tagTypes.GENRE, id },
      ],
    }),
    deleteGenre: builder.mutation<void, string>({
      query: (id) => ({
        url: `/genres/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        tagTypes.GENRE_LIST,
        { type: tagTypes.GENRE, id },
      ],
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetGenreByIdQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genreApi;
