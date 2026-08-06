/**
 * Moderation Validation Schemas
 * Zod schemas for moderation input validation
 */

import { z } from "zod";

export const createReportSchema = z.object({
  reporterId: z.string().min(1, "Reporter ID is required"),
  targetType: z.enum(["COMMENT", "RATING", "USER"]),
  targetId: z.string().min(1, "Target ID is required"),
  reason: z.string().min(1, "Reason is required").max(500, "Reason must not exceed 500 characters"),
  description: z.string().max(1000, "Description must not exceed 1000 characters").optional(),
});

export const moderateContentSchema = z.object({
  moderatorId: z.string().min(1, "Moderator ID is required"),
  action: z.enum(["APPROVE", "DELETE", "HIDE"]),
  reason: z.string().max(500, "Reason must not exceed 500 characters").optional(),
});

export const moderateUserSchema = z.object({
  moderatorId: z.string().min(1, "Moderator ID is required"),
  action: z.enum(["WARN", "SUSPEND", "BAN"]),
  reason: z.string().min(1, "Reason is required").max(500, "Reason must not exceed 500 characters"),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ModerateContentInput = z.infer<typeof moderateContentSchema>;
export type ModerateUserInput = z.infer<typeof moderateUserSchema>;
