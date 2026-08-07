/**
 * Verify Email Page
 * Premium email verification page using the Authentication Design System
 * Supports multiple states: check-email, success, expired, invalid
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AuthLayout,
  AuthCard,
  SubmitButton,
  AuthAlert,
  FormError,
} from "@/components/auth";

type VerificationState = "check-email" | "success" | "expired" | "invalid";

export default function VerifyEmailPage() {
  const [verificationState, setVerificationState] = useState<VerificationState>("check-email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = () => {
    if (cooldown > 0) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCooldown(60); // Start 60 second cooldown
    }, 2000);
  };

  const handleContinueToLogin = () => {
    // Placeholder for navigation
    window.location.href = "/login";
  };

  // Demo controls for testing (remove in production)
  const DemoControls = () => (
    <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      <p className="text-xs text-gray-500 mb-2">Demo Controls (remove in production):</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setVerificationState("check-email")}
          className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Check Email
        </button>
        <button
          onClick={() => setVerificationState("success")}
          className="px-3 py-1 text-xs bg-green-600 hover:bg-green-500 rounded text-white"
        >
          Success
        </button>
        <button
          onClick={() => setVerificationState("expired")}
          className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-500 rounded text-white"
        >
          Expired
        </button>
        <button
          onClick={() => setVerificationState("invalid")}
          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 rounded text-white"
        >
          Invalid
        </button>
      </div>
    </div>
  );

  return (
    <AuthLayout>
      <AuthCard>
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

        {/* Check Email State */}
        {verificationState === "check-email" && (
          <div className="text-center space-y-6">
            {/* Email Icon */}
            <div className="w-20 h-20 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-gray-400">
                We sent a verification link to your email address. Please click the link to verify your account.
              </p>
            </div>

            <div className="space-y-4">
              <SubmitButton
                isLoading={isLoading}
                loadingText="Sending..."
                onClick={handleResendEmail}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
              </SubmitButton>

              <Link
                href="/login"
                className="block text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Success State */}
        {verificationState === "success" && (
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Email Verified Successfully</h1>
              <p className="text-gray-400">
                Your email has been verified. You can now log in to your account.
              </p>
            </div>

            <div className="space-y-4">
              <SubmitButton onClick={handleContinueToLogin}>
                Continue to Login
              </SubmitButton>
            </div>
          </div>
        )}

        {/* Expired Link State */}
        {verificationState === "expired" && (
          <div className="text-center space-y-6">
            {/* Warning Icon */}
            <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Verification Link Expired</h1>
              <p className="text-gray-400">
                The verification link has expired. Please request a new verification email.
              </p>
            </div>

            <div className="space-y-4">
              <SubmitButton
                isLoading={isLoading}
                loadingText="Sending..."
                onClick={handleResendEmail}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
              </SubmitButton>

              <Link
                href="/login"
                className="block text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Invalid Token State */}
        {verificationState === "invalid" && (
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Invalid Verification Link</h1>
              <p className="text-gray-400">
                The verification link is invalid or has already been used. Please request a new one.
              </p>
            </div>

            <div className="space-y-4">
              <SubmitButton
                isLoading={isLoading}
                loadingText="Sending..."
                onClick={handleResendEmail}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
              </SubmitButton>

              <Link
                href="/login"
                className="block text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Demo Controls */}
        <DemoControls />
      </AuthCard>
    </AuthLayout>
  );
}
