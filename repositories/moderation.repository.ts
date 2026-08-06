/**
 * Moderation Repository
 * Handles moderation and report database operations
 */

import prisma from "@/lib/prisma";

export class ModerationRepository {
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
    return prisma.report.create({
      data,
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Find report by ID
   */
  async findReportById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        moderator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Find reports with filters
   */
  async findReports(options?: {
    skip?: number;
    take?: number;
    status?: "PENDING" | "RESOLVED" | "DISMISSED";
    targetType?: "COMMENT" | "RATING" | "USER";
    reporterId?: string;
    moderatorId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { skip = 0, take = 20, status, targetType, reporterId, moderatorId, startDate, endDate } = options || {};

    const where: any = {};

    if (status) where.status = status;
    if (targetType) where.targetType = targetType;
    if (reporterId) where.reporterId = reporterId;
    if (moderatorId) where.moderatorId = moderatorId;
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          reporter: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          moderator: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total };
  }

  /**
   * Update report status
   */
  async updateReportStatus(id: string, data: {
    status: "RESOLVED" | "DISMISSED";
    moderatorId: string;
  }) {
    return prisma.report.update({
      where: { id },
      data: {
        ...data,
        resolvedAt: new Date(),
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        moderator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Log moderation action
   */
  async logModerationAction(data: {
    moderatorId: string;
    actionType: "APPROVE" | "DELETE" | "HIDE" | "WARN" | "SUSPEND" | "BAN";
    targetType: "COMMENT" | "RATING" | "USER";
    targetId: string;
    reason?: string;
    metadata?: string;
  }) {
    return prisma.moderationAction.create({
      data,
      include: {
        moderator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Find moderation history with filters
   */
  async findModerationHistory(options?: {
    skip?: number;
    take?: number;
    moderatorId?: string;
    actionType?: "APPROVE" | "DELETE" | "HIDE" | "WARN" | "SUSPEND" | "BAN";
    targetType?: "COMMENT" | "RATING" | "USER";
    targetId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { skip = 0, take = 20, moderatorId, actionType, targetType, targetId, startDate, endDate } = options || {};

    const where: any = {};

    if (moderatorId) where.moderatorId = moderatorId;
    if (actionType) where.actionType = actionType;
    if (targetType) where.targetType = targetType;
    if (targetId) where.targetId = targetId;
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [actions, total] = await Promise.all([
      prisma.moderationAction.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          moderator: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.moderationAction.count({ where }),
    ]);

    return { actions, total };
  }

  /**
   * Count reports by status
   */
  async countReportsByStatus(status: "PENDING" | "RESOLVED" | "DISMISSED"): Promise<number> {
    return prisma.report.count({
      where: { status },
    });
  }

  /**
   * Count reports by target type
   */
  async countReportsByTargetType(targetType: "COMMENT" | "RATING" | "USER"): Promise<number> {
    return prisma.report.count({
      where: { targetType },
    });
  }
}

export const moderationRepository = new ModerationRepository();
