/**
 * Subscription Service
 * Manages premium subscriptions with validation
 */

import { subscriptionRepository } from "@/repositories";
import { SubscriptionPlan } from "@/app/generated/prisma/client";

export class SubscriptionService {
  /**
   * Get user's subscriptions
   */
  async getUserSubscriptions(userId: string) {
    return subscriptionRepository.findByUserId(userId);
  }

  /**
   * Get user's active subscription
   */
  async getActiveSubscription(userId: string) {
    return subscriptionRepository.findActiveByUserId(userId);
  }

  /**
   * Create subscription
   */
  async createSubscription(
    userId: string,
    plan: SubscriptionPlan,
    duration: number
  ) {
    // Validate plan
    if (!Object.values(SubscriptionPlan).includes(plan)) {
      throw new Error("Invalid subscription plan");
    }

    // Validate duration
    if (duration <= 0) {
      throw new Error("Duration must be positive");
    }

    const startsAt = new Date();
    const expiresAt = this.calculateExpiryDate(plan, duration, startsAt);

    return subscriptionRepository.create(userId, plan, startsAt, expiresAt);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(id: string) {
    const existing = await subscriptionRepository.findActiveByUserId(id);
    if (!existing) {
      throw new Error("Subscription not found");
    }

    return subscriptionRepository.delete(id);
  }

  /**
   * Renew subscription
   */
  async renewSubscription(id: string, duration: number) {
    const existing = await subscriptionRepository.findActiveByUserId(id);
    if (!existing) {
      throw new Error("Subscription not found");
    }

    // Validate duration
    if (duration <= 0) {
      throw new Error("Duration must be positive");
    }

    const newExpiresAt = this.calculateExpiryDate(
      existing.plan,
      duration,
      existing.expiresAt
    );

    return subscriptionRepository.update(id, {
      expiresAt: newExpiresAt,
    });
  }

  /**
   * Check if user has active premium
   */
  async isUserPremium(userId: string): Promise<boolean> {
    return subscriptionRepository.isUserPremium(userId);
  }

  /**
   * Get subscriptions expiring soon
   */
  async getExpiringSubscriptions(days: number = 7) {
    return subscriptionRepository.findExpiringSoon(days);
  }

  /**
   * Calculate expiry date based on plan and duration
   */
  private calculateExpiryDate(
    plan: SubscriptionPlan,
    duration: number,
    fromDate: Date
  ): Date {
    const expiryDate = new Date(fromDate);

    switch (plan) {
      case SubscriptionPlan.MONTHLY:
        expiryDate.setMonth(expiryDate.getMonth() + duration);
        break;
      case SubscriptionPlan.YEARLY:
        expiryDate.setFullYear(expiryDate.getFullYear() + duration);
        break;
      case SubscriptionPlan.LIFETIME:
        // Lifetime subscriptions expire in 100 years
        expiryDate.setFullYear(expiryDate.getFullYear() + 100);
        break;
      default:
        throw new Error("Invalid subscription plan");
    }

    return expiryDate;
  }
}

export const subscriptionService = new SubscriptionService();
