/**
 * Chapter Validation Schemas
 * Zod schemas for chapter input validation
 */

import { z } from "zod";

export const createChapterSchema = z.object({
  seriesId: z
    .string()
    .min(1, "Series ID is required"),
  chapterNumber: z
    .union([z.number(), z.string()])
    .transform((val) => typeof val === "string" ? parseFloat(val) : val)
    .refine((val) => val > 0, "Chapter number must be greater than 0")
    .refine((val) => val <= 9999, "Chapter number must not exceed 9999"),
  title: z
    .string()
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must not exceed 200 characters")
    .regex(/^[a-z0-9\-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  unlockType: z.enum(["FREE", "AD", "PREMIUM"]).optional(),
});

export const updateChapterSchema = z.object({
  chapterNumber: z
    .union([z.number(), z.string()])
    .transform((val) => typeof val === "string" ? parseFloat(val) : val)
    .refine((val) => val > 0, "Chapter number must be greater than 0")
    .refine((val) => val <= 9999, "Chapter number must not exceed 9999")
    .optional(),
  title: z
    .string()
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must not exceed 200 characters")
    .regex(/^[a-z0-9\-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  unlockType: z.enum(["FREE", "AD", "PREMIUM"]).optional(),
});

export const createChapterPageSchema = z.object({
  chapterId: z
    .string()
    .min(1, "Chapter ID is required"),
  pageNumber: z
    .number()
    .int()
    .positive("Page number must be a positive integer"),
  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .min(1, "Image URL is required"),
});

export const createChapterPagesSchema = z.object({
  chapterId: z
    .string()
    .min(1, "Chapter ID is required"),
  pages: z.array(z.object({
    imageUrl: z
      .string()
      .url("Image URL must be valid")
      .min(1, "Image URL is required"),
  })).min(1, "At least one page is required"),
});

export const reorderChapterPagesSchema = z.object({
  pageOrders: z.array(z.object({
    id: z.string().min(1, "Page ID is required"),
    pageNumber: z.number().int().positive("Page number must be a positive integer"),
  })).min(1, "At least one page is required"),
});

export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
export type CreateChapterPageInput = z.infer<typeof createChapterPageSchema>;
export type CreateChapterPagesInput = z.infer<typeof createChapterPagesSchema>;
export type ReorderChapterPagesInput = z.infer<typeof reorderChapterPagesSchema>;
