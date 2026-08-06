/**
 * Moderation Service Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { moderationService } from "@/services/moderation.service";

// Mock moderation repository
vi.mock("@/repositories/moderation.repository", () => ({
  moderationRepository: {
    createReport: vi.fn(),
    findReportById: vi.fn(),
    findReports: vi.fn(),
    updateReportStatus: vi.fn(),
    logModerationAction: vi.fn(),
    findModerationHistory: vi.fn(),
    countReportsByStatus: vi.fn(),
  },
}));

// Mock comment repository
vi.mock("@/repositories/comment.repository", () => ({
  commentRepository: {
    findById: vi.fn(),
  },
}));

import { moderationRepository } from "@/repositories/moderation.repository";
import { commentRepository } from "@/repositories/comment.repository";

describe("ModerationService", () => {
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

      vi.mocked(moderationRepository.createReport).mockResolvedValue(mockReport as any);

      const result = await moderationService.createReport(reportData);

      expect(moderationRepository.createReport).toHaveBeenCalledWith(reportData);
      expect(result).toEqual(mockReport);
    });
  });

  describe("resolveReport", () => {
    it("should resolve a pending report", async () => {
      const mockReport = {
        id: "report-1",
        status: "PENDING",
      };

      vi.mocked(moderationRepository.findReportById).mockResolvedValue(mockReport as any);
      vi.mocked(moderationRepository.updateReportStatus).mockResolvedValue({
        ...mockReport,
        status: "RESOLVED",
      } as any);

      const result = await moderationService.resolveReport("report-1", "admin-1");

      expect(moderationRepository.updateReportStatus).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should throw error if report not found", async () => {
      vi.mocked(moderationRepository.findReportById).mockResolvedValue(null);

      await expect(moderationService.resolveReport("non-existent", "admin-1")).rejects.toThrow();
    });

    it("should throw error if report already resolved", async () => {
      const mockReport = {
        id: "report-1",
        status: "RESOLVED",
      };

      vi.mocked(moderationRepository.findReportById).mockResolvedValue(mockReport as any);

      await expect(moderationService.resolveReport("report-1", "admin-1")).rejects.toThrow();
    });
  });

  describe("dismissReport", () => {
    it("should dismiss a pending report", async () => {
      const mockReport = {
        id: "report-1",
        status: "PENDING",
        targetType: "COMMENT" as const,
        targetId: "comment-1",
      };

      vi.mocked(moderationRepository.findReportById).mockResolvedValue(mockReport as any);
      vi.mocked(moderationRepository.logModerationAction).mockResolvedValue({
        id: "action-1",
        moderatorId: "admin-1",
        actionType: "APPROVE",
        targetType: "COMMENT",
        targetId: "comment-1",
        createdAt: new Date(),
      } as any);
      vi.mocked(moderationRepository.updateReportStatus).mockResolvedValue({
        ...mockReport,
        status: "DISMISSED",
      } as any);

      const result = await moderationService.dismissReport("report-1", "admin-1", "Not a violation");

      expect(moderationRepository.logModerationAction).toHaveBeenCalled();
      expect(moderationRepository.updateReportStatus).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("moderateComment", () => {
    it("should approve a comment", async () => {
      const mockComment = {
        id: "comment-1",
        content: "Test comment",
      };

      vi.mocked(commentRepository.findById).mockResolvedValue(mockComment as any);
      vi.mocked(moderationRepository.logModerationAction).mockResolvedValue({
        id: "action-1",
        moderatorId: "admin-1",
        actionType: "APPROVE",
        targetType: "COMMENT",
        targetId: "comment-1",
        createdAt: new Date(),
      } as any);

      const result = await moderationService.moderateComment("comment-1", {
        moderatorId: "admin-1",
        action: "APPROVE",
      });

      expect(moderationRepository.logModerationAction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should delete a comment", async () => {
      const mockComment = {
        id: "comment-1",
        content: "Spam comment",
      };

      vi.mocked(commentRepository.findById).mockResolvedValue(mockComment as any);
      vi.mocked(moderationRepository.logModerationAction).mockResolvedValue({
        id: "action-1",
        moderatorId: "admin-1",
        actionType: "DELETE",
        targetType: "COMMENT",
        targetId: "comment-1",
        reason: "Spam",
        createdAt: new Date(),
      } as any);

      const result = await moderationService.moderateComment("comment-1", {
        moderatorId: "admin-1",
        action: "DELETE",
        reason: "Spam",
      });

      expect(moderationRepository.logModerationAction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getModerationHistory", () => {
    it("should return moderation history with filters", async () => {
      const mockActions = [
        {
          id: "action-1",
          moderatorId: "admin-1",
          actionType: "DELETE",
          targetType: "COMMENT",
          targetId: "comment-1",
        },
      ];

      vi.mocked(moderationRepository.findModerationHistory).mockResolvedValue(mockActions as any);

      const result = await moderationService.getModerationHistory({
        actionType: "DELETE",
        targetType: "COMMENT",
      });

      expect(moderationRepository.findModerationHistory).toHaveBeenCalledWith({
        actionType: "DELETE",
        targetType: "COMMENT",
      });
      expect(result).toEqual(mockActions);
    });
  });
});
