/**
 * Environment variable validation using Zod
 * Ensures all required environment variables are present at build time
 */

import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Application
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Authentication (prepared for later)
  // JWT_SECRET: z.string().min(32),
  // NEXTAUTH_SECRET: z.string().min(32),
  // NEXTAUTH_URL: z.string().url(),

  // Cloudinary (prepared for later)
  // CLOUDINARY_CLOUD_NAME: z.string(),
  // CLOUDINARY_API_KEY: z.string(),
  // CLOUDINARY_API_SECRET: z.string(),
  // NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string(),
});

type EnvSchema = z.infer<typeof envSchema>;

/**
 * Validates and exports environment variables
 * Throws error if validation fails
 */
export const env: EnvSchema = envSchema.parse(process.env);
