/**
 * Validation exports
 * Centralized export for all validation schemas
 */

export {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  type RegisterInput,
  type LoginInput,
  type ChangePasswordInput,
} from "./auth.validation";

export {
  createSeriesSchema,
  updateSeriesSchema,
  type CreateSeriesInput,
  type UpdateSeriesInput,
} from "./series.validation";

export {
  createChapterSchema,
  updateChapterSchema,
  type CreateChapterInput,
  type UpdateChapterInput,
} from "./chapter.validation";
