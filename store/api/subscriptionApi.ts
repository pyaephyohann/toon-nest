/**
 * Subscription API
 * Subscription/Premium endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDetails {
  id: string;
  plan: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: any[];
  isPopular: boolean;
  stripePriceId?: string | null;
  stripeProductId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<PlanDetails[], void>({
      query: () => ({
        url: "/premium/plans",
        method: "GET",
      }),
      providesTags: [tagTypes.SUBSCRIPTION_LIST],
    }),
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => ({
        url: "/premium/subscriptions",
        method: "GET",
      }),
      providesTags: [tagTypes.SUBSCRIPTION_LIST],
    }),
    createSubscription: builder.mutation<Subscription, { plan: string; duration: number }>({
      query: (data) => ({
        url: "/premium/subscribe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.SUBSCRIPTION_LIST, tagTypes.SUBSCRIPTION],
    }),
    cancelSubscription: builder.mutation<void, string>({
      query: (id) => ({
        url: `/premium/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.SUBSCRIPTION_LIST, tagTypes.SUBSCRIPTION],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
