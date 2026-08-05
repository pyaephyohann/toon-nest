"use client";

import { Invoice } from "@/store/api";
import { useGetInvoicesQuery } from "@/store/api";
import { Receipt, Download, ExternalLink, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function BillingHistory() {
  const { data: invoices, isLoading, error } = useGetInvoicesQuery();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold">Failed to Load Billing History</h3>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Receipt className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">No Billing History</h3>
            <p className="text-sm text-muted-foreground">Your invoices will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "MONTHLY":
        return "Premium Monthly";
      case "YEARLY":
        return "Premium Yearly";
      case "FREE":
        return "Free";
      case "LIFETIME":
        return "Lifetime";
      default:
        return plan;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Receipt className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-lg">Billing History</h3>
      </div>

      <div className="space-y-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent transition"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border">
                <Receipt className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{getPlanName(invoice.subscription?.plan || "Unknown")}</p>
                  <StatusBadge status={invoice.status} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">
                  ${invoice.amount.toFixed(2)} {invoice.currency}
                </p>
                <p className="text-xs text-muted-foreground">
                  Invoice #{invoice.providerInvoiceId?.slice(-8) || invoice.id.slice(-8)}
                </p>
              </div>

              {invoice.invoiceUrl && (
                <a
                  href={invoice.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
                  title="View Invoice"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
