import { createApi } from "@reduxjs/toolkit/query/react";

import axiosInstance from "@/lib/axios";

const axiosBaseQuery =
  () =>
  async ({
    url,
    method,
    data,
    params,
  }: {
    url: string;
    method: string;
    data?: unknown;
    params?: unknown;
  }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError: any) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Auth",
    "User",
    "Genre",
    "Manga",
    "Chapter",
    "Bookmark",
    "History",
    "Premium",
  ],
  endpoints: () => ({}),
});
