/**
 * POST /api/payments/webhooks/stripe
 * Handle Stripe webhook events
 */

import { NextRequest } from "next/server";
import { paymentService } from "@/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    const payload = await request.text();

    const result = await paymentService.handleWebhook(signature, payload);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook handler failed', { status: 400 });
  }
}
