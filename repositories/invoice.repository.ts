/**
 * Invoice Repository
 * Handles all invoice database operations
 */

import prisma from "@/lib/prisma";
import { Invoice, InvoiceStatus } from "@/app/generated/prisma/client";

export class InvoiceRepository {
  /**
   * Find invoice by ID
   */
  async findById(id: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        user: true,
        subscription: true,
      },
    });
  }

  /**
   * Find invoices by user ID
   */
  async findByUserId(userId: string): Promise<Invoice[]> {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subscription: true,
      },
    });
  }

  /**
   * Create an invoice
   */
  async create(
    userId: string,
    subscriptionId: string,
    data: {
      amount: number;
      currency?: string;
      invoiceUrl?: string;
      providerInvoiceId?: string;
    }
  ): Promise<Invoice> {
    return prisma.invoice.create({
      data: {
        userId,
        subscriptionId,
        ...data,
      },
      include: {
        user: true,
        subscription: true,
      },
    });
  }

  /**
   * Update an invoice
   */
  async update(
    id: string,
    data: {
      status?: InvoiceStatus;
      invoiceUrl?: string;
      providerInvoiceId?: string;
    }
  ): Promise<Invoice> {
    return prisma.invoice.update({
      where: { id },
      data,
      include: {
        user: true,
        subscription: true,
      },
    });
  }

  /**
   * Delete an invoice
   */
  async delete(id: string): Promise<Invoice> {
    return prisma.invoice.delete({
      where: { id },
    });
  }

  /**
   * Get total revenue (admin)
   */
  async getTotalRevenue(): Promise<number> {
    const result = await prisma.invoice.aggregate({
      where: {
        status: "PAID",
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  /**
   * Get recent payments (admin)
   */
  async getRecentPayments(limit: number = 10) {
    return prisma.invoice.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: "PAID",
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        invoiceUrl: true,
        providerInvoiceId: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        subscription: {
          select: {
            id: true,
            plan: true,
          },
        },
      },
    });
  }
}

export const invoiceRepository = new InvoiceRepository();
