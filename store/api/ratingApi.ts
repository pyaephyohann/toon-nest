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

export const ratingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  useAddRatingMutation,
  useDeleteRatingMutation,
} = ratingApi;
