/**
 * Rating API
 * Rating endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Rating {
  id: string;
  userId: string;
  seriesId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: any;
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const ratingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRatingsBySeriesId: builder.query<Rating[], { seriesId: string }>({
      query: ({ seriesId }) => ({
        url: "/ratings",
        method: "GET",
        params: { seriesId },
      }),
      providesTags: (result, error, { seriesId }) => [
        { type: tagTypes.MANGA, id: seriesId },
        tagTypes.RATING,
      ],
    }),
    getRatingSummary: builder.query<RatingSummary, { seriesId: string }>({
      query: ({ seriesId }) => ({
        url: `/ratings/summary/${seriesId}`,
        method: "GET",
      }),
      providesTags: (result, error, { seriesId }) => [
        { type: tagTypes.MANGA, id: seriesId },
        tagTypes.RATING,
      ],
    }),
    addRating: builder.mutation<Rating, { seriesId: string; rating: number }>({
      query: (data) => ({
        url: "/ratings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { seriesId }) => [
        { type: tagTypes.MANGA, id: seriesId },
        tagTypes.RATING,
      ],
    }),
    updateRating: builder.mutation<Rating, { id: string; rating: number }>({
      query: ({ id, rating }) => ({
        url: `/ratings/${id}`,
        method: "PATCH",
        body: { rating },
      }),
      invalidatesTags: (result, error, { id }) => [
        tagTypes.RATING,
      ],
    }),
    deleteRating: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ratings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.RATING],
    }),
  }),
});

export const {
  useGetRatingsBySeriesIdQuery,
  useGetRatingSummaryQuery,
  useAddRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} = ratingApi;
