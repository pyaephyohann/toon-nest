/**
 * Series Validation Schemas
 * Zod schemas for series input validation
 */

import { z } from "zod";

export const createSeriesSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters"),
  coverImage: z.string().url("Invalid cover image URL"),
  bannerImage: z.string().url("Invalid banner image URL").optional(),
  author: z.string().max(100, "Author name must be at most 100 characters").optional(),
  artist: z.string().max(100, "Artist name must be at most 100 characters").optional(),
  status: z.enum(["ONGOING", "COMPLETED", "HIATUS"]).optional(),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateSeriesSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters")
    .optional(),
  coverImage: z.string().url("Invalid cover image URL").optional(),
  bannerImage: z.string().url("Invalid banner image URL").optional(),
  author: z.string().max(100, "Author name must be at most 100 characters").optional(),
  artist: z.string().max(100, "Artist name must be at most 100 characters").optional(),
  status: z.enum(["ONGOING", "COMPLETED", "HIATUS"]).optional(),
  verified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;
