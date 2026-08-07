/**
 * Reset Password Page
 * Premium reset password page using the Authentication Design System
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AuthLayout,
  AuthCard,
  PasswordInput,
  PasswordStrength,
  SubmitButton,
  AuthAlert,
  FormError,
  FormSuccess,
} from "@/components/auth";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (!newPassword) errors.push("New password is required");
    if (newPassword && newPassword.length < 8) errors.push("Password must be at least 8 characters");
    if (!confirmPassword) errors.push("Please confirm your password");
    if (newPassword !== confirmPassword) errors.push("Passwords do not match");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Simulate loading (placeholder)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Password reset successfully! You can now log in with your new password.");
      // Reset form
      setNewPassword("");
      setConfirmPassword("");
    }, 2000);
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        subtitle="Enter your new password below"
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
          {/* New Password Field */}
          <div>
            <PasswordInput
              id="newPassword"
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {/* Password Strength Indicator */}
            {newPassword && <PasswordStrength password={newPassword} showRequirements={true} />}
          </div>

          {/* Confirm Password Field */}
          <div>
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2">
                {passwordsMatch ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-red-400">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <SubmitButton
            isLoading={isLoading}
            loadingText="Resetting password..."
          >
            Reset Password
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
