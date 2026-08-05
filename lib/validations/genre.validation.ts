/**
 * Genre Validation Schemas
 * Zod schemas for genre input validation
 */

import { z } from "zod";

export const createGenreSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s\-&]+$/, "Name can only contain letters, numbers, spaces, hyphens, and ampersands"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must not exceed 50 characters")
    .regex(/^[a-z0-9\-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  icon: z.string().max(100, "Icon URL must not exceed 100 characters").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color code (e.g., #FF5733)")
    .optional(),
});

export const updateGenreSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s\-&]+$/, "Name can only contain letters, numbers, spaces, hyphens, and ampersands")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must not exceed 50 characters")
    .regex(/^[a-z0-9\-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  icon: z.string().max(100, "Icon URL must not exceed 100 characters").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color code (e.g., #FF5733)")
    .optional(),
});

export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
