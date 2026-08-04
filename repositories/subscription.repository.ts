/**
 * Subscription Repository
 * Handles user premium subscriptions
 */

import prisma from "@/lib/prisma";
import { Subscription, SubscriptionPlan, SubscriptionPlanDetails } from "@/app/generated/prisma/client";

export class SubscriptionRepository {
  /**
   * Find all subscriptions for a user
   */
  async findByUserId(userId: string): Promise<Subscription[]> {
    return prisma.subscription.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Find user's active subscription
   */
  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    const now = new Date();
    return prisma.subscription.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: now,
        },
      },
      orderBy: {
        expiresAt: "desc",
      },
    });
  }

  /**
   * Create a subscription
   */
  async create(
    userId: string,
    plan: SubscriptionPlan,
    startsAt: Date,
    expiresAt: Date
  ): Promise<Subscription> {
    return prisma.subscription.create({
      data: {
        userId,
        plan,
        startsAt,
        expiresAt,
      },
    });
  }

  /**
   * Update a subscription
   */
  async update(
    id: string,
    data: {
      plan?: SubscriptionPlan;
      startsAt?: Date;
      expiresAt?: Date;
    }
  ): Promise<Subscription> {
    return prisma.subscription.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a subscription
   */
  async delete(id: string): Promise<Subscription> {
    return prisma.subscription.delete({
      where: { id },
    });
  }

  /**
   * Check if user has active premium subscription
   */
  async isUserPremium(userId: string): Promise<boolean> {
    const now = new Date();
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: now,
        },
      },
    });

    return !!subscription;
  }

  /**
   * Find subscriptions expiring soon
   */
  async findExpiringSoon(days: number = 7): Promise<Subscription[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.subscription.findMany({
      where: {
        expiresAt: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        expiresAt: "asc",
      },
    });
  }

  /**
   * Get all plan details
   */
  async getAllPlanDetails(): Promise<SubscriptionPlanDetails[]> {
    return prisma.subscriptionPlanDetails.findMany({
      orderBy: {
        price: "asc",
      },
    });
  }

  /**
   * Get plan details by plan type
   */
  async getPlanDetailsByPlan(plan: SubscriptionPlan): Promise<SubscriptionPlanDetails | null> {
    return prisma.subscriptionPlanDetails.findUnique({
      where: { plan },
    });
  }

  /**
   * Create or update plan details
   */
  async upsertPlanDetails(
    plan: SubscriptionPlan,
    data: {
      name: string;
      description: string;
      price: number;
      currency?: string;
      features: any[];
      isPopular?: boolean;
      stripePriceId?: string;
      stripeProductId?: string;
    }
  ): Promise<SubscriptionPlanDetails> {
    return prisma.subscriptionPlanDetails.upsert({
      where: { plan },
      create: {
        plan,
        ...data,
      },
      update: data,
    });
  }
}

export const subscriptionRepository = new SubscriptionRepository();
