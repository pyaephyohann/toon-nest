/**
 * Moderation Service
 * Handles moderation business logic and audit logging
 */

import { moderationRepository } from "@/repositories/moderation.repository";
import { commentRepository } from "@/repositories/comment.repository";
import { ratingRepository } from "@/repositories/rating.repository";
import { userRepository } from "@/repositories/user.repository";
import { createReportSchema, moderateContentSchema, moderateUserSchema } from "@/lib/validations/moderation.validation";

export class ModerationService {
  /**
   * Create a report
   */
  async createReport(data: {
    reporterId: string;
    targetType: "COMMENT" | "RATING" | "USER";
    targetId: string;
    reason: string;
    description?: string;
  }) {
    // Validate input using Zod
    const validatedData = createReportSchema.parse(data);

    return moderationRepository.createReport(validatedData);
  }

  /**
   * Resolve a report
   */
  async resolveReport(reportId: string, moderatorId: string) {
    const report = await moderationRepository.findReportById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    if (report.status !== "PENDING") {
      throw new Error("Report is not pending");
    }

    return moderationRepository.updateReportStatus(reportId, {
      status: "RESOLVED",
      moderatorId,
    });
  }

  /**
   * Dismiss a report
   */
  async dismissReport(reportId: string, moderatorId: string, reason?: string) {
    const report = await moderationRepository.findReportById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    if (report.status !== "PENDING") {
      throw new Error("Report is not pending");
    }

    // Log moderation action
    await moderationRepository.logModerationAction({
      moderatorId,
      actionType: "APPROVE",
      targetType: report.targetType,
      targetId: report.targetId,
      reason: reason || "Report dismissed",
    });

    return moderationRepository.updateReportStatus(reportId, {
      status: "DISMISSED",
      moderatorId,
    });
  }

  /**
   * Moderate a comment
   */
  async moderateComment(commentId: string, data: {
    moderatorId: string;
    action: "APPROVE" | "DELETE" | "HIDE";
    reason?: string;
  }) {
    // Validate input using Zod
    const validatedData = moderateContentSchema.parse(data);

    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Log moderation action
    await moderationRepository.logModerationAction({
      moderatorId: validatedData.moderatorId,
      actionType: validatedData.action,
      targetType: "COMMENT",
      targetId: commentId,
      reason: validatedData.reason,
    });

    // Execute action
    if (validatedData.action === "DELETE") {
      return commentRepository.delete(commentId);
    }

    // For HIDE action, we could add a hidden field to the comment model
    // For now, we'll just log the action
    return comment;
  }

  /**
   * Moderate a rating
   */
  async moderateRating(ratingId: string, data: {
    moderatorId: string;
    action: "APPROVE" | "DELETE";
    reason?: string;
  }) {
    // Validate input using Zod
    const validatedData = moderateContentSchema.parse(data);

    const rating = await ratingRepository.findByUserAndSeries(
      validatedData.moderatorId,
      ratingId
    );

    if (!rating) {
      throw new Error("Rating not found");
    }

    // Log moderation action
    await moderationRepository.logModerationAction({
      moderatorId: validatedData.moderatorId,
      actionType: validatedData.action,
      targetType: "RATING",
      targetId: ratingId,
      reason: validatedData.reason,
    });

    // Execute action
    if (validatedData.action === "DELETE") {
      return ratingRepository.delete(ratingId);
    }

    return rating;
  }

  /**
   * Moderate a user
   */
  async moderateUser(userId: string, data: {
    moderatorId: string;
    action: "WARN" | "SUSPEND" | "BAN";
    reason?: string;
  }) {
    // Validate input using Zod
    const validatedData = moderateUserSchema.parse(data);

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Prevent moderating admins
    if (user.role === "ADMIN") {
      throw new Error("Cannot moderate admin users");
    }

    // Prevent self-moderation
    if (userId === validatedData.moderatorId) {
      throw new Error("Cannot moderate yourself");
    }

    // Log moderation action
    await moderationRepository.logModerationAction({
      moderatorId: validatedData.moderatorId,
      actionType: validatedData.action,
      targetType: "USER",
      targetId: userId,
      reason: validatedData.reason,
    });

    // Execute action
    if (validatedData.action === "SUSPEND") {
      return userRepository.update(userId, { suspendedAt: new Date() });
    }

    if (validatedData.action === "BAN") {
      // For ban, we could add a banned field to the user model
      // For now, we'll suspend indefinitely
      return userRepository.update(userId, { suspendedAt: new Date() });
    }

    // For WARN action, we could send a notification to the user
    // For now, we'll just log the action
    return user;
  }

  /**
   * Get moderation history
   */
  async getModerationHistory(options?: {
    skip?: number;
    take?: number;
    moderatorId?: string;
    actionType?: "APPROVE" | "DELETE" | "HIDE" | "WARN" | "SUSPEND" | "BAN";
    targetType?: "COMMENT" | "RATING" | "USER";
    targetId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return moderationRepository.findModerationHistory(options);
  }

  /**
   * Get reports with filters
   */
  async getReports(options?: {
    skip?: number;
    take?: number;
    status?: "PENDING" | "RESOLVED" | "DISMISSED";
    targetType?: "COMMENT" | "RATING" | "USER";
    reporterId?: string;
    moderatorId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return moderationRepository.findReports(options);
  }

  /**
   * Get report by ID
   */
  async getReportById(id: string) {
    return moderationRepository.findReportById(id);
  }

  /**
   * Get moderation statistics
   */
  async getModerationStatistics() {
    const [pending, resolved, dismissed, comments, ratings, users] = await Promise.all([
      moderationRepository.countReportsByStatus("PENDING"),
      moderationRepository.countReportsByStatus("RESOLVED"),
      moderationRepository.countReportsByStatus("DISMISSED"),
      moderationRepository.countReportsByTargetType("COMMENT"),
      moderationRepository.countReportsByTargetType("RATING"),
      moderationRepository.countReportsByTargetType("USER"),
    ]);

    return {
      pending,
      resolved,
      dismissed,
      comments,
      ratings,
      users,
    };
  }
}

export const moderationService = new ModerationService();
