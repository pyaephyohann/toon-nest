/**
 * Manga Validation Schemas
 * Zod schemas for manga (series) input validation
 */

import { z } from "zod";

export const createMangaSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must not exceed 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must not exceed 200 characters")
    .regex(/^[a-z0-9\-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .min(1, "Cover image is required"),
  bannerImage: z
    .string()
    .url("Banner image must be a valid URL")
    .optional(),
  author: z
    .string()
    .max(100, "Author name must not exceed 100 characters")
    .optional(),
  artist: z
    .string()
    .max(100, "Artist name must not exceed 100 characters")
    .optional(),
  status: z.enum(["ONGOING", "COMPLETED", "HIATUS", "DROPPED"]).optional(),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateMangaSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must not exceed 200 characters")
    .regex(/^[a-z0-9\-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .optional(),
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional(),
  bannerImage: z
    .string()
    .url("Banner image must be a valid URL")
    .optional(),
  author: z
    .string()
    .max(100, "Author name must not exceed 100 characters")
    .optional(),
  artist: z
    .string()
    .max(100, "Artist name must not exceed 100 characters")
    .optional(),
  status: z.enum(["ONGOING", "COMPLETED", "HIATUS", "DROPPED"]).optional(),
  verified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export type CreateMangaInput = z.infer<typeof createMangaSchema>;
export type UpdateMangaInput = z.infer<typeof updateMangaSchema>;
