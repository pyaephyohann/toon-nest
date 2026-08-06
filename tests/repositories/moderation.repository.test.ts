/**
 * Moderation Repository Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { moderationRepository } from "@/repositories/moderation.repository";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  default: {
    report: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    moderationAction: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import prisma from "@/lib/prisma";

describe("ModerationRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createReport", () => {
    it("should create a new report", async () => {
      const reportData = {
        reporterId: "user-1",
        targetType: "COMMENT" as const,
        targetId: "comment-1",
        reason: "Spam",
        description: "This is spam",
      };
      
      const mockReport = {
        id: "report-1",
        ...reportData,
        status: "PENDING",
        createdAt: new Date(),
      };
      
      vi.mocked(prisma.report.create).mockResolvedValue(mockReport as any);
      
      const result = await moderationRepository.createReport(reportData);
      
      expect(prisma.report.create).toHaveBeenCalledWith({
        data: reportData,
      });
      expect(result).toEqual(mockReport);
    });
  });

  describe("findReportById", () => {
    it("should find a report by id", async () => {
      const mockReport = {
        id: "report-1",
        reporterId: "user-1",
        targetType: "COMMENT",
        targetId: "comment-1",
        reason: "Spam",
        status: "PENDING",
      };
      
      vi.mocked(prisma.report.findUnique).mockResolvedValue(mockReport as any);
      
      const result = await moderationRepository.findReportById("report-1");
      
      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: { id: "report-1" },
      });
      expect(result).toEqual(mockReport);
    });

    it("should return null if report not found", async () => {
      vi.mocked(prisma.report.findUnique).mockResolvedValue(null);
      
      const result = await moderationRepository.findReportById("non-existent");
      
      expect(result).toBeNull();
    });
  });

  describe("findReports", () => {
    it("should find reports with filters", async () => {
      const mockReports = [
        {
          id: "report-1",
          status: "PENDING",
          targetType: "COMMENT",
        },
      ];
      
      vi.mocked(prisma.report.findMany).mockResolvedValue(mockReports as any);
      
      const result = await moderationRepository.findReports({
        status: "PENDING",
        targetType: "COMMENT",
      });
      
      expect(prisma.report.findMany).toHaveBeenCalledWith({
        where: {
          status: "PENDING",
          targetType: "COMMENT",
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockReports);
    });
  });

  describe("updateReportStatus", () => {
    it("should update report status", async () => {
      const mockReport = {
        id: "report-1",
        status: "RESOLVED",
        moderatorId: "admin-1",
        resolvedAt: new Date(),
      };
      
      vi.mocked(prisma.report.update).mockResolvedValue(mockReport as any);
      
      const result = await moderationRepository.updateReportStatus("report-1", {
        status: "RESOLVED",
        moderatorId: "admin-1",
      });
      
      expect(prisma.report.update).toHaveBeenCalledWith({
        where: { id: "report-1" },
        data: {
          status: "RESOLVED",
          moderatorId: "admin-1",
          resolvedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(mockReport);
    });
  });

  describe("logModerationAction", () => {
    it("should log a moderation action", async () => {
      const actionData = {
        moderatorId: "admin-1",
        actionType: "DELETE" as const,
        targetType: "COMMENT" as const,
        targetId: "comment-1",
        reason: "Spam",
      };
      
      const mockAction = {
        id: "action-1",
        ...actionData,
        createdAt: new Date(),
      };
      
      vi.mocked(prisma.moderationAction.create).mockResolvedValue(mockAction as any);
      
      const result = await moderationRepository.logModerationAction(actionData);
      
      expect(prisma.moderationAction.create).toHaveBeenCalledWith({
        data: actionData,
      });
      expect(result).toEqual(mockAction);
    });
  });

  describe("findModerationHistory", () => {
    it("should find moderation history with filters", async () => {
      const mockActions = [
        {
          id: "action-1",
          moderatorId: "admin-1",
          actionType: "DELETE",
          targetType: "COMMENT",
          targetId: "comment-1",
        },
      ];
      
      vi.mocked(prisma.moderationAction.findMany).mockResolvedValue(mockActions as any);
      
      const result = await moderationRepository.findModerationHistory({
        actionType: "DELETE",
        targetType: "COMMENT",
      });
      
      expect(prisma.moderationAction.findMany).toHaveBeenCalledWith({
        where: {
          actionType: "DELETE",
          targetType: "COMMENT",
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockActions);
    });
  });
});
