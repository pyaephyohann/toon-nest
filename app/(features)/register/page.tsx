/**
 * Register Page
 * Premium registration page using the Authentication Design System
 * Integrated with RTK Query for registration
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  PasswordInput,
  PasswordStrength,
  TermsCheckbox,
  Divider,
  SocialLoginButtons,
  SubmitButton,
  AuthAlert,
  FormError,
  FormSuccess,
} from "@/components/auth";
import { useRegisterMutation } from "@/store/api/authApi";
import { registerSchema } from "@/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors and success
    setError(null);
    setSuccess(null);
    setValidationErrors([]);

    // Client-side validation using Zod schema
    try {
      registerSchema.parse({ username, displayName, email, password });
    } catch (validationError: any) {
      const errors = validationError.errors?.map((err: any) => err.message) || ["Validation failed"];
      setValidationErrors(errors);
      return;
    }

    // Additional client-side validation
    const errors: string[] = [];
    if (password !== confirmPassword) errors.push("Passwords do not match");
    if (!agreeToTerms) errors.push("You must agree to the Terms of Service and Privacy Policy");

    if (errors.length > 0) {
      setValidationErrors([...validationErrors, ...errors]);
      return;
    }

    // Call RTK Query register mutation
    try {
      await register({ username, displayName, email, password }).unwrap();
      setSuccess("Account created successfully! Redirecting to email verification...");
      
      // Redirect to Verify Email page after successful registration
      setTimeout(() => {
        router.push("/verify-email");
      }, 2000);
    } catch (err: any) {
      setError(err.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth
    console.log("Google register clicked");
  };

  const handleGitHubLogin = () => {
    // Placeholder for GitHub OAuth
    console.log("GitHub register clicked");
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        subtitle="Join Toon Nest and start reading your favorite manga"
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
          {/* Username Field */}
          <AuthInput
            id="username"
            type="text"
            label="Username"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            required
          />

          {/* Display Name Field */}
          <AuthInput
            id="displayName"
            type="text"
            label="Display Name"
            placeholder="John Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            required
          />

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
          <div>
            <PasswordInput
              id="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Password Strength Indicator */}
            {password && <PasswordStrength password={password} showRequirements={true} />}
          </div>

          {/* Confirm Password Field */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Terms Checkbox */}
          <TermsCheckbox
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            error={!agreeToTerms && validationErrors.length > 0 ? "You must agree to continue" : undefined}
          />

          {/* Submit Button */}
          <SubmitButton
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Create Account
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

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
