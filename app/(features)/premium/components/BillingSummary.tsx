"use client";

import { Invoice } from "@/store/api";
import { useGetInvoicesQuery } from "@/store/api";
import { Receipt, CreditCard, Calendar, TrendingUp, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function BillingSummary() {
  const { data: invoices, isLoading, error } = useGetInvoicesQuery();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div className="h-8 animate-pulse rounded-lg bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-muted-foreground">Failed to load billing summary.</p>
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

  // Calculate totals
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyInvoices = invoices.filter(inv => {
    const date = new Date(inv.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyTotal = monthlyInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const yearlyTotal = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

  // Get most recent invoice
  const recentInvoice = invoices[0];
  const nextPaymentDate = recentInvoice?.status === "PAID" 
    ? new Date(new Date(recentInvoice.createdAt).setMonth(new Date(recentInvoice.createdAt).getMonth() + 1))
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Receipt className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-lg">Billing Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">This Month</span>
          </div>
          <p className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</p>
        </div>

        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">This Year</span>
          </div>
          <p className="text-2xl font-bold">${yearlyTotal.toFixed(2)}</p>
        </div>
      </div>

      {recentInvoice && (
        <div className="p-4 rounded-xl border border-border mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Most Recent Payment</span>
            <StatusBadge status={recentInvoice.status} size="sm" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">${recentInvoice.amount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(recentInvoice.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            {nextPaymentDate && recentInvoice.status === "PAID" && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Next Payment</p>
                <p className="text-sm font-medium">{nextPaymentDate.toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Payment Method</p>
            <p className="text-xs text-muted-foreground">Stripe •••• 4242</p>
          </div>
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground transition">
          Update
        </button>
      </div>
    </div>
  );
}
