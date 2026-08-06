/**
 * Store test helpers
 */

import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/store/api";

export const setupApiStore = (apiSlice: any) => {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  return store;
};
