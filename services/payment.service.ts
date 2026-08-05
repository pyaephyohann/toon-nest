/**
 * Payment Service
 * Handles payment operations using payment provider adapters
 */

import { subscriptionService } from './subscription.service';
import { subscriptionRepository } from '@/repositories';
import { PaymentProvider, SubscriptionPlan, SubscriptionStatus, InvoiceStatus } from '@/app/generated/prisma/client';
import { createPaymentAdapter } from '@/lib/payment/factory';
import type { IPaymentAdapter, WebhookEvent, SubscriptionData, InvoiceData } from '@/lib/payment/adapter';
import prisma from '@/lib/prisma';

export class PaymentService {
  private adapter: IPaymentAdapter | null = null;

  constructor(provider: PaymentProvider = PaymentProvider.STRIPE) {
    // Only instantiate adapter if environment variables are set
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        this.adapter = createPaymentAdapter(provider);
      } catch (error) {
        console.warn('Failed to initialize payment adapter:', error);
      }
    }
  }

  private ensureAdapter(): IPaymentAdapter {
    if (!this.adapter) {
      throw new Error('Payment adapter not initialized. Check environment variables.');
    }
    return this.adapter;
  }

  /**
   * Create checkout session for subscription purchase
   */
  async createCheckoutSession(params: {
    userId: string;
    plan: SubscriptionPlan;
    successUrl: string;
    cancelUrl: string;
  }) {
    return this.ensureAdapter().createCheckoutSession(params);
  }

  /**
   * Handle webhook event from payment provider
   */
  async handleWebhook(signature: string, payload: string) {
    const event = this.ensureAdapter().verifyWebhook(signature, payload);
    
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event);
        break;
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event);
        break;
      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Sync subscription data from payment provider
   */
  async syncSubscription(providerData: SubscriptionData, userId: string) {
    // Find existing subscription by provider subscription ID
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        providerSubscriptionId: providerData.providerSubscriptionId,
      },
    });

    if (existingSubscription) {
      // Update existing subscription
      return await subscriptionRepository.update(existingSubscription.id, {
        status: providerData.status as SubscriptionStatus,
        expiresAt: providerData.currentPeriodEnd,
        autoRenew: !providerData.cancelAtPeriodEnd,
      });
    } else {
      // Create new subscription
      const startsAt = new Date();
      const expiresAt = providerData.currentPeriodEnd;
      
      return await subscriptionRepository.create(
        userId,
        providerData.plan as SubscriptionPlan,
        startsAt,
        expiresAt
      );
    }
  }

  /**
   * Create invoice record
   */
  async createInvoice(invoiceData: InvoiceData, userId: string, subscriptionId: string) {
    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        providerInvoiceId: invoiceData.providerInvoiceId,
      },
    });

    if (existingInvoice) {
      // Update existing invoice
      return await prisma.invoice.update({
        where: { id: existingInvoice.id },
        data: {
          status: invoiceData.status as InvoiceStatus,
          invoiceUrl: invoiceData.invoiceUrl,
        },
      });
    }

    // Create new invoice
    return await prisma.invoice.create({
      data: {
        userId,
        subscriptionId,
        amount: invoiceData.amount,
        currency: invoiceData.currency,
        status: invoiceData.status as InvoiceStatus,
        invoiceUrl: invoiceData.invoiceUrl,
        providerInvoiceId: invoiceData.providerInvoiceId,
      },
    });
  }

  /**
   * Get invoices for user
   */
  async getInvoices(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id: string, userId: string) {
    return prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
  }

  /**
   * Handle checkout.session.completed event
   */
  private async handleCheckoutSessionCompleted(event: WebhookEvent) {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      console.error('Missing userId or plan in checkout session metadata');
      return;
    }

    // Subscription will be created via customer.subscription.created event
    console.log(`Checkout session completed for user ${userId}, plan ${plan}`);
  }

  /**
   * Handle invoice.payment_succeeded event
   */
  private async handleInvoicePaymentSucceeded(event: WebhookEvent) {
    const invoiceData = this.ensureAdapter().parseInvoiceData(event);
    if (!invoiceData) return;

    const invoice = event.data.object as any;
    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;

    // Find user by customer ID (you'd need to store this mapping)
    // For now, we'll skip this as it requires customer ID mapping
    console.log(`Invoice payment succeeded: ${invoiceData.providerInvoiceId}`);
  }

  /**
   * Handle invoice.payment_failed event
   */
  private async handleInvoicePaymentFailed(event: WebhookEvent) {
    const invoiceData = this.ensureAdapter().parseInvoiceData(event);
    if (!invoiceData) return;

    console.log(`Invoice payment failed: ${invoiceData.providerInvoiceId}`);
  }

  /**
   * Handle customer.subscription.created event
   */
  private async handleSubscriptionCreated(event: WebhookEvent) {
    const subscriptionData = this.ensureAdapter().parseSubscriptionData(event);
    if (!subscriptionData) return;

    const subscription = event.data.object as any;
    const customerId = subscription.customer;

    // Find user by customer ID (you'd need to store this mapping)
    // For now, we'll use a placeholder
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return;
    }

    await this.syncSubscription(subscriptionData, userId);
    console.log(`Subscription created for user ${userId}`);
  }

  /**
   * Handle customer.subscription.updated event
   */
  private async handleSubscriptionUpdated(event: WebhookEvent) {
    const subscriptionData = this.ensureAdapter().parseSubscriptionData(event);
    if (!subscriptionData) return;

    const subscription = event.data.object as any;
    const customerId = subscription.customer;
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return;
    }

    await this.syncSubscription(subscriptionData, userId);
    console.log(`Subscription updated for user ${userId}`);
  }

  /**
   * Handle customer.subscription.deleted event
   */
  private async handleSubscriptionDeleted(event: WebhookEvent) {
    const subscription = event.data.object as any;
    const providerSubscriptionId = subscription.id;
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in subscription metadata');
      return;
    }

    // Find and update subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        providerSubscriptionId,
      },
    });

    if (existingSubscription) {
      await subscriptionRepository.update(existingSubscription.id, {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
        autoRenew: false,
      });
    }

    console.log(`Subscription deleted for user ${userId}`);
  }
}

export const paymentService = new PaymentService();
