/**
 * RTK Query Base API
 * Single base API with Axios base query and global configuration
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../lib/axios";
import { tagTypes } from "./tagTypes";

// Custom base query using our axios instance
const axiosBaseQuery = () => async ({
  url,
  method,
  data,
  params,
  headers,
}: {
  url: string;
  method: string;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
}) => {
  try {
    const result = await axiosInstance({
      url,
      method,
      data,
      params,
      headers,
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
  tagTypes: Object.values(tagTypes),
  endpoints: () => ({}),
});
