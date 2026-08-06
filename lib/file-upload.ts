/**
 * File Upload Security Utilities
 * Validates and secures file uploads
 */

import { z } from "zod";

/**
 * Allowed file types for uploads
 */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  COVER_IMAGE: 10 * 1024 * 1024, // 10MB
  CHAPTER_PAGE: 2 * 1024 * 1024, // 2MB
} as const;

/**
 * File magic bytes for validation
 */
const FILE_SIGNATURES: Record<string, string[]> = {
  "image/jpeg": ["FF D8 FF"],
  "image/png": ["89 50 4E 47 0D 0A 1A 0A"],
  "image/webp": ["52 49 46 46"],
  "image/gif": ["47 49 46 38"],
};

/**
 * Validate file type
 */
export function validateFileType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimeType as any);
}

/**
 * Validate file size
 */
export function validateFileSize(
  size: number,
  maxSize: number = MAX_FILE_SIZES.AVATAR
): boolean {
  return size <= maxSize;
}

/**
 * Validate file magic bytes
 */
export function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
  const signatures = FILE_SIGNATURES[mimeType];
  if (!signatures) return false;

  const fileHex = buffer.subarray(0, 8).toString("hex").toUpperCase();
  const fileSignature = fileHex.match(/.{1,2}/g)?.join(" ") || "";

  return signatures.some((sig) => fileSignature.startsWith(sig.replace(/ /g, "")));
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  const sanitized = filename.replace(/^[\.\/]+/, "");
  
  // Remove special characters, keep alphanumeric, dots, hyphens, underscores
  return sanitized.replace(/[^a-zA-Z0-9._-]/g, "");
}

/**
 * Generate safe filename
 */
export function generateSafeFilename(originalName: string): string {
  const sanitized = sanitizeFilename(originalName);
  const ext = sanitized.split(".").pop() || "";
  const base = sanitized.replace(`.${ext}`, "");
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${base}-${timestamp}-${random}.${ext}`;
}

/**
 * File upload validation schema
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  mimeType: z.enum(ALLOWED_IMAGE_TYPES),
  size: z.number().max(MAX_FILE_SIZES.AVATAR, "File too large"),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

/**
 * Validate uploaded file
 */
export async function validateUploadedFile(
  file: File,
  maxSize: number = MAX_FILE_SIZES.AVATAR
): Promise<{ valid: boolean; error?: string }> {
  // Check file type
  if (!validateFileType(file.type)) {
    return { valid: false, error: "Invalid file type" };
  }

  // Check file size
  if (!validateFileSize(file.size, maxSize)) {
    return { valid: false, error: "File too large" };
  }

  // Check magic bytes
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!validateFileSignature(buffer, file.type)) {
    return { valid: false, error: "Invalid file signature" };
  }

  return { valid: true };
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}
