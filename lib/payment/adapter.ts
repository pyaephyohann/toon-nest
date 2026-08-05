/**
 * Payment Provider Adapter Interface
 * Defines the contract for payment provider implementations
 */

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface WebhookEvent {
  type: string;
  data: any;
}

export interface SubscriptionData {
  providerSubscriptionId: string;
  status: string;
  plan: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface InvoiceData {
  providerInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  invoiceUrl?: string;
}

export interface IPaymentAdapter {
  /**
   * Create a checkout session for subscription purchase
   */
  createCheckoutSession(params: {
    userId: string;
    plan: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSessionResult>;

  /**
   * Verify webhook signature and parse event
   */
  verifyWebhook(signature: string, payload: string): WebhookEvent;

  /**
   * Parse subscription data from webhook event
   */
  parseSubscriptionData(event: WebhookEvent): SubscriptionData | null;

  /**
   * Parse invoice data from webhook event
   */
  parseInvoiceData(event: WebhookEvent): InvoiceData | null;

  /**
   * Get provider name
   */
  getProviderName(): string;
}
