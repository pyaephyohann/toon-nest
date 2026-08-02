/**
 * User API
 * User endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string | null;
  bio?: string | null;
  role: string;
  avatar?: string | null;
  readingStreak?: number;
}

export interface UpdateUserRequest {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface UserStatistics {
  bookmarksCount: number;
  historyCount: number;
  ratingsCount: number;
  commentsCount: number;
  uniqueMangaRead: number;
  readingStreak: number;
}

export interface FavoriteGenre {
  name: string;
  count: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result) => result ? [{ type: tagTypes.USER, id: result.id }] : [],
    }),
    getUserStatistics: builder.query<UserStatistics, string>({
      query: (id) => ({
        url: `/users/${id}/statistics`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.USER, id }],
    }),
    getFavoriteGenres: builder.query<FavoriteGenre[], { id: string; limit?: number }>({
      query: ({ id, limit = 5 }) => ({
        url: `/users/${id}/favorite-genres`,
        method: "GET",
        params: { limit },
      }),
      providesTags: (result, error, { id }) => [{ type: tagTypes.USER, id }],
    }),
    updateUser: builder.mutation<User, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.USER, id },
      ],
    }),
    uploadAvatar: builder.mutation<User, { id: string; avatar: string }>({
      query: ({ id, avatar }) => ({
        url: `/users/${id}/avatar`,
        method: "POST",
        body: { avatar },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.USER, id },
      ],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: tagTypes.USER, id },
      ],
    }),
    changePassword: builder.mutation<void, { id: string; data: ChangePasswordRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/password`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.AUTH],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserStatisticsQuery,
  useGetFavoriteGenresQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
} = userApi;
