/**
 * Stripe Payment Adapter
 * Implements payment provider interface for Stripe
 */

import Stripe from 'stripe';
import {
  IPaymentAdapter,
  CheckoutSessionResult,
  WebhookEvent,
  SubscriptionData,
  InvoiceData,
} from './adapter';

export class StripeAdapter implements IPaymentAdapter {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    this.stripe = new Stripe(secretKey);
  }

  async createCheckoutSession(params: {
    userId: string;
    plan: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSessionResult> {
    // Map plan to Stripe price ID
    const priceId = this.getPriceIdForPlan(params.plan);
    if (!priceId) {
      throw new Error(`No Stripe price ID configured for plan: ${params.plan}`);
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        userId: params.userId,
        plan: params.plan,
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  verifyWebhook(signature: string, payload: string): WebhookEvent {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
    }

    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return {
      type: event.type,
      data: event.data,
    };
  }

  parseSubscriptionData(event: WebhookEvent): SubscriptionData | null {
    const subscription = event.data.object as any;

    if (!subscription) {
      return null;
    }

    // Map Stripe status to our status
    const statusMap: Record<string, string> = {
      active: 'ACTIVE',
      past_due: 'ACTIVE',
      canceled: 'CANCELLED',
      unpaid: 'EXPIRED',
      incomplete: 'CANCELLED',
      incomplete_expired: 'EXPIRED',
      trialing: 'ACTIVE',
    };

    // Map Stripe plan to our plan
    const price = subscription.items?.data?.[0]?.price;
    const lookupKey = price?.lookup_key || '';
    const plan = this.mapStripePlanToSubscriptionPlan(lookupKey);

    return {
      providerSubscriptionId: subscription.id,
      status: statusMap[subscription.status] || 'EXPIRED',
      plan,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  }

  parseInvoiceData(event: WebhookEvent): InvoiceData | null {
    const invoice = event.data.object as any;

    if (!invoice) {
      return null;
    }

    // Map Stripe invoice status to our status
    const statusMap: Record<string, string> = {
      draft: 'PENDING',
      open: 'PENDING',
      paid: 'PAID',
      void: 'FAILED',
      uncollectible: 'FAILED',
    };

    const status = invoice.status || 'PENDING';

    return {
      providerInvoiceId: invoice.id,
      amount: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency?.toUpperCase() || 'USD',
      status: statusMap[status] || 'PENDING',
      invoiceUrl: invoice.hosted_invoice_url || undefined,
    };
  }

  getProviderName(): string {
    return 'STRIPE';
  }

  private getPriceIdForPlan(plan: string): string | null {
    const priceIds: Record<string, string> = {
      MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID || '',
      YEARLY: process.env.STRIPE_YEARLY_PRICE_ID || '',
    };

    return priceIds[plan] || null;
  }

  private mapStripePlanToSubscriptionPlan(lookupKey: string): string {
    if (!lookupKey) return 'MONTHLY';
    
    const planMap: Record<string, string> = {
      monthly: 'MONTHLY',
      yearly: 'YEARLY',
    };

    return planMap[lookupKey.toLowerCase()] || 'MONTHLY';
  }
}
