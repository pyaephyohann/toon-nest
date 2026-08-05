/**
 * Payment API
 * Payment/Checkout/Invoice endpoints
 */

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: string;
  invoiceUrl: string | null;
  providerInvoiceId: string | null;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    plan: string;
  };
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<CheckoutSession, { plan: string }>({
      query: (data) => ({
        url: "/payments/checkout",
        method: "POST",
        body: data,
      }),
    }),
    getInvoices: builder.query<Invoice[], void>({
      query: () => ({
        url: "/payments/invoices",
        method: "GET",
      }),
      providesTags: [tagTypes.INVOICE_LIST],
    }),
    getInvoiceById: builder.query<Invoice, string>({
      query: (id) => ({
        url: `/payments/invoices/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.INVOICE, id }],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
} = paymentApi;
