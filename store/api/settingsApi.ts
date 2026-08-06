/**
 * Settings API
 * System settings endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/general",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateGeneralSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/general",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getHomepageSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/homepage",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateHomepageSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/homepage",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getPremiumSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/premium",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updatePremiumSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/premium",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getCommunitySettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/community",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateCommunitySettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/community",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getStorageSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/storage",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateStorageSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/storage",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getSEOSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/seo",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateSEOSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/seo",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getEmailSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/email",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateEmailSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/email",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getFeatureFlags: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/feature-flags",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateFeatureFlags: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/feature-flags",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
    getMaintenanceSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/maintenance",
        method: "GET",
      }),
      providesTags: [tagTypes.SETTINGS],
    }),
    updateMaintenanceSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/settings/maintenance",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.SETTINGS],
    }),
  }),
});

export const {
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useGetHomepageSettingsQuery,
  useUpdateHomepageSettingsMutation,
  useGetPremiumSettingsQuery,
  useUpdatePremiumSettingsMutation,
  useGetCommunitySettingsQuery,
  useUpdateCommunitySettingsMutation,
  useGetStorageSettingsQuery,
  useUpdateStorageSettingsMutation,
  useGetSEOSettingsQuery,
  useUpdateSEOSettingsMutation,
  useGetEmailSettingsQuery,
  useUpdateEmailSettingsMutation,
  useGetFeatureFlagsQuery,
  useUpdateFeatureFlagsMutation,
  useGetMaintenanceSettingsQuery,
  useUpdateMaintenanceSettingsMutation,
} = settingsApi;
