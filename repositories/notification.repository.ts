/**
 * Notification Repository
 * Handles all notification-related database operations
 */

import prisma from "@/lib/prisma";
import { Notification, NotificationType } from "@/app/generated/prisma/client";

export class NotificationRepository {
  /**
   * Find notifications for a user with pagination
   */
  async findByUserId(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
      unreadOnly?: boolean;
    }
  ): Promise<{ notifications: Notification[]; total: number }> {
    const { skip = 0, take = 20, unreadOnly = false } = options || {};

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  /**
   * Find notification by ID
   */
  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * Find notification by ID and user (for permission checks)
   */
  async findByIdAndUser(id: string, userId: string): Promise<Notification | null> {
    return prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Create a notification
   */
  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    chapterId?: string;
    seriesId?: string;
    commentId?: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    return { count: result.count };
  }

  /**
   * Delete a notification
   */
  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * Count unread notifications for a user
   */
  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}

export const notificationRepository = new NotificationRepository();
