/**
 * User Validation Schemas
 */

import { z } from "zod";

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Register schema
 */
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be at most 100 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be at most 100 characters"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Update user profile schema (user mode)
 */
export const updateUserProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;

/**
 * Update user schema (admin mode)
 */
export const updateUserAdminSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  suspendedAt: z.string().datetime().optional(),
  suspendedReason: z.string().optional(),
});

export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;
