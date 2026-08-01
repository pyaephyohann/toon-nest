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
  role: string;
  avatar?: string | null;
}

export interface UpdateUserRequest {
  username?: string;
  avatar?: string;
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
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
} = userApi;
