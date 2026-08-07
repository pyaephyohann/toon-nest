/**
 * Forgot Password Page
 * Premium forgot password page using the Authentication Design System
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  SubmitButton,
  AuthAlert,
  FormError,
  FormSuccess,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors and success
    setError(null);
    setSuccess(null);
    setValidationErrors([]);

    // Validation (placeholder)
    const errors: string[] = [];
    if (!email) errors.push("Email is required");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Simulate loading (placeholder)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Password reset link sent! Please check your email inbox.");
      setEmail("");
    }, 2000);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        subtitle="Enter your email and we'll send you a reset link"
      >
        {/* Server Error Alert */}
        {error && (
          <AuthAlert
            type="error"
            message={error}
            dismissible
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Success Message */}
        {success && (
          <FormSuccess
            message={success}
            onDismiss={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <FormError
            errors={validationErrors}
            onClear={() => setValidationErrors([])}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <AuthInput
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
            required
          />

          {/* Submit Button */}
          <SubmitButton
            isLoading={isLoading}
            loadingText="Sending reset link..."
          >
            Send Reset Link
          </SubmitButton>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Back to Login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
