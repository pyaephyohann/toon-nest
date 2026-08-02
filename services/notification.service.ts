/**
 * Notification Service
 * Handles notification business logic
 */

import { notificationRepository } from "@/repositories";
import { NotificationType } from "@/app/generated/prisma/client";

export class NotificationService {
  /**
   * Get notifications for a user with pagination
   */
  async getNotifications(
    userId: string,
    options?: {
      skip?: number;
      take?: number;
      unreadOnly?: boolean;
    }
  ) {
    return notificationRepository.findByUserId(userId, options);
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId);
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    // Verify the notification belongs to the user
    const notification = await notificationRepository.findByIdAndUser(
      notificationId,
      userId
    );
    if (!notification) {
      throw new Error("Notification not found or access denied");
    }

    return notificationRepository.markAsRead(notificationId);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string) {
    // Verify the notification belongs to the user
    const notification = await notificationRepository.findByIdAndUser(
      notificationId,
      userId
    );
    if (!notification) {
      throw new Error("Notification not found or access denied");
    }

    return notificationRepository.delete(notificationId);
  }

  /**
   * Create a notification (for system use)
   */
  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    chapterId?: string;
    seriesId?: string;
    commentId?: string;
  }) {
    return notificationRepository.create(data);
  }
}

export const notificationService = new NotificationService();
