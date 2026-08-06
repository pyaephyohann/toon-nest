/**
 * User Validation Schemas
 * Zod schemas for user input validation (admin operations)
 */

import { z } from "zod";

export const updateUserAdminSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional(),
  displayName: z
    .string()
    .max(50, "Display name must not exceed 50 characters")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  suspendedAt: z.string().datetime().nullable().optional(),
});

export const changeRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export const suspendUserSchema = z.object({
  reason: z.string().max(500, "Reason must not exceed 500 characters").optional(),
});

export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;
