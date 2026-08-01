/**
 * Subscription Repository
 * Handles user premium subscriptions
 */

import prisma from "@/lib/prisma";
import { Subscription, SubscriptionPlan } from "@/app/generated/prisma/client";

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
}

export const subscriptionRepository = new SubscriptionRepository();
