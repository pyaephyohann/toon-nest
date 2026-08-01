/**
 * Comment API
 * Comment endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Comment {
  id: string;
  userId: string;
  chapterId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: any;
}

export interface CommentListResponse {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
}

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentById: builder.query<Comment, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "GET",
      }),
      providesTags: (result) => result ? [{ type: tagTypes.COMMENT, id: result.id }] : [],
    }),
    addComment: builder.mutation<Comment, { chapterId: string; content: string }>({
      query: (data) => ({
        url: "/comments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { chapterId }) => [
        { type: tagTypes.COMMENT, id: chapterId },
      ],
    }),
    updateComment: builder.mutation<Comment, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.COMMENT, id },
      ],
    }),
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: tagTypes.COMMENT, id },
      ],
    }),
  }),
});

export const {
  useGetCommentByIdQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
