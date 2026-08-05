/**
 * Subscription Service
 * Manages premium subscriptions with validation
 */

import { subscriptionRepository } from "@/repositories";
import { SubscriptionPlan, SubscriptionStatus } from "@/app/generated/prisma/client";

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

    // Update status to CANCELLED and set cancelledAt
    return subscriptionRepository.update(id, {
      status: SubscriptionStatus.CANCELLED,
      cancelledAt: new Date(),
      autoRenew: false,
    });
  }

  /**
   * Upgrade or downgrade subscription
   */
  async upgradeSubscription(userId: string, newPlan: SubscriptionPlan) {
    // Validate plan
    if (!Object.values(SubscriptionPlan).includes(newPlan)) {
      throw new Error("Invalid subscription plan");
    }

    // Get current active subscription
    const currentSub = await subscriptionRepository.findActiveByUserId(userId);
    
    if (!currentSub) {
      // No current subscription, create new one
      return this.createSubscription(userId, newPlan, 1);
    }

    // Cancel current subscription
    await this.cancelSubscription(currentSub.id);

    // Create new subscription with new plan
    const startsAt = new Date();
    const expiresAt = this.calculateExpiryDate(newPlan, 1, startsAt);

    return subscriptionRepository.create(userId, newPlan, startsAt, expiresAt);
  }

  /**
   * Toggle auto-renew for subscription
   */
  async toggleAutoRenew(subscriptionId: string, enabled: boolean) {
    const existing = await subscriptionRepository.findById(subscriptionId);
    if (!existing) {
      throw new Error("Subscription not found");
    }

    return subscriptionRepository.update(subscriptionId, {
      autoRenew: enabled,
    });
  }

  /**
   * Get subscription history for user
   */
  async getSubscriptionHistory(userId: string) {
    return subscriptionRepository.findByUserId(userId);
  }

  /**
   * Calculate remaining days until expiry
   */
  calculateRemainingDays(expiresAt: Date): number {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Update subscription status based on expiry
   */
  async updateSubscriptionStatus(subscriptionId: string) {
    const existing = await subscriptionRepository.findById(subscriptionId);
    if (!existing) {
      throw new Error("Subscription not found");
    }

    const now = new Date();
    const isExpired = new Date(existing.expiresAt) < now;

    if (isExpired && existing.status === SubscriptionStatus.ACTIVE) {
      return subscriptionRepository.update(subscriptionId, {
        status: SubscriptionStatus.EXPIRED,
      });
    }

    return existing;
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
   * Get all available plans
   */
  async getAvailablePlans() {
    return subscriptionRepository.getAllPlanDetails();
  }

  /**
   * Get plan details by plan type
   */
  async getPlanDetails(plan: SubscriptionPlan) {
    return subscriptionRepository.getPlanDetailsByPlan(plan);
  }

  /**
   * Seed default plans if they don't exist
   */
  async seedDefaultPlans() {
    const plans = [
      {
        plan: SubscriptionPlan.FREE,
        name: "Free",
        description: "Basic access to manga library",
        price: 0,
        currency: "USD",
        features: [
          "Access to free manga",
          "Standard quality images",
          "Limited chapter access",
          "Advertisements",
        ],
        isPopular: false,
      },
      {
        plan: SubscriptionPlan.MONTHLY,
        name: "Premium Monthly",
        description: "Full premium access billed monthly",
        price: 9.99,
        currency: "USD",
        features: [
          "Unlimited manga access",
          "High-quality images",
          "Early chapter releases",
          "Ad-free experience",
          "Offline reading",
          "Bookmark sync",
        ],
        isPopular: true,
      },
      {
        plan: SubscriptionPlan.YEARLY,
        name: "Premium Yearly",
        description: "Full premium access billed yearly (save 20%)",
        price: 95.88,
        currency: "USD",
        features: [
          "All Monthly features",
          "Save 20% compared to monthly",
          "Priority support",
          "Exclusive content",
          "Beta features access",
        ],
        isPopular: false,
      },
    ];

    for (const planData of plans) {
      await subscriptionRepository.upsertPlanDetails(planData.plan, planData);
    }
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
      case SubscriptionPlan.FREE:
        // Free plans don't expire
        expiryDate.setFullYear(expiryDate.getFullYear() + 100);
        break;
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
