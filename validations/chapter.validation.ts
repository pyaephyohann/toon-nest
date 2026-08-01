/**
 * Chapter Validation Schemas
 * Zod schemas for chapter input validation
 */

import { z } from "zod";

export const createChapterSchema = z.object({
  seriesId: z.string().min(1, "Series ID is required"),
  chapterNumber: z
    .number()
    .positive("Chapter number must be positive")
    .max(9999, "Chapter number must be at most 9999"),
  title: z.string().max(200, "Title must be at most 200 characters").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  unlockType: z.enum(["FREE", "AD", "PREMIUM"]).optional(),
});

export const updateChapterSchema = z.object({
  title: z.string().max(200, "Title must be at most 200 characters").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  unlockType: z.enum(["FREE", "AD", "PREMIUM"]).optional(),
});

export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
