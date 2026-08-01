/**
 * Authentication utilities
 * Prepared for Milestone 5: Authentication
 * Currently placeholder functions - will be implemented with bcrypt, JWT, etc.
 */

import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  const secret = process.env.JWT_SECRET || "fallback-secret-change-in-production";
  return sign(payload, secret, { expiresIn: "7d" });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): {
  userId: string;
  email: string;
  role: string;
} | null {
  try {
    const secret = process.env.JWT_SECRET || "fallback-secret-change-in-production";
    return verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
