/**
 * Login Page
 * Premium login page using the Authentication Design System
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthInput,
  PasswordInput,
  Divider,
  SocialLoginButtons,
  RememberMe,
  SubmitButton,
  AuthAlert,
  FormError,
} from "@/components/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setError(null);
    setValidationErrors([]);

    // Validation (placeholder)
    const errors: string[] = [];
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (password && password.length < 8) errors.push("Password must be at least 8 characters");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Simulate loading (placeholder)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setError("Invalid email or password"); // Placeholder error
    }, 2000);
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth
    console.log("Google login clicked");
  };

  const handleGitHubLogin = () => {
    // Placeholder for GitHub OAuth
    console.log("GitHub login clicked");
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue reading your favorite manga"
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

          {/* Password Field */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <RememberMe
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link
              href="/forgot-password"
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <SubmitButton
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign In
          </SubmitButton>
        </form>

        {/* Divider */}
        <Divider className="my-6" />

        {/* Social Login Buttons */}
        <SocialLoginButtons
          showGoogle={true}
          showGitHub={false}
          onGoogleClick={handleGoogleLogin}
          onGitHubClick={handleGitHubLogin}
          className="mb-6"
        />

        {/* Register Link */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
