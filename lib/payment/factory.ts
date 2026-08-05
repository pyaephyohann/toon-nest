/**
 * Payment Provider Factory
 * Creates payment adapter instances based on configuration
 */

import { IPaymentAdapter } from './adapter';
import { StripeAdapter } from './stripe.adapter';
import { PaymentProvider } from '@/app/generated/prisma/client';

export function createPaymentAdapter(provider: PaymentProvider = PaymentProvider.STRIPE): IPaymentAdapter {
  switch (provider) {
    case PaymentProvider.STRIPE:
      return new StripeAdapter();
    case PaymentProvider.LEMON_SQUEEZY:
      throw new Error('Lemon Squeezy adapter not implemented yet');
    case PaymentProvider.PADDLE:
      throw new Error('Paddle adapter not implemented yet');
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}

export default createPaymentAdapter;
